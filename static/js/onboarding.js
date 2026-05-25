/* ===== TalentStage — Onboarding Wizard & Verification ===== */

(function() {
  'use strict';

  /* ---------- Multi-Step Wizard ---------- */
  const wizard = document.getElementById('signupWizard');
  if (wizard) {
    const panels = wizard.querySelectorAll('.wizard-panel');
    const steps = wizard.querySelectorAll('.wizard-step');
    const connectors = wizard.querySelectorAll('.wizard-connector');
    let currentStep = 0;
    let selectedRole = localStorage.getItem('talentstage_role') || 'freelancer';

    // Pre-select role card
    updateRoleSelection(selectedRole);

    function goToStep(n) {
      if (n < 0 || n >= panels.length) return;
      panels.forEach(p => p.classList.remove('active'));
      panels[n].classList.add('active');

      steps.forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i < n) s.classList.add('done');
        if (i === n) s.classList.add('active');
      });

      connectors.forEach((c, i) => {
        c.classList.toggle('done', i < n);
      });

      currentStep = n;

      // Update confirmation step if moving to step 3
      if (n === 2) updateConfirmation();
    }

    // Next/Back buttons
    wizard.querySelectorAll('[data-wizard-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Validate current step
        if (currentStep === 0) {
          const form = wizard.querySelector('.wizard-form');
          const inputs = form.querySelectorAll('input[required]');
          let valid = true;
          inputs.forEach(inp => {
            if (!inp.value.trim()) { inp.focus(); valid = false; }
          });
          if (!valid) return;
        }
        goToStep(currentStep + 1);
      });
    });

    wizard.querySelectorAll('[data-wizard-back]').forEach(btn => {
      btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    // Role card selection
    wizard.querySelectorAll('.role-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedRole = card.dataset.role;
        updateRoleSelection(selectedRole);
        localStorage.setItem('talentstage_role', selectedRole);
      });
    });

    function updateRoleSelection(role) {
      wizard.querySelectorAll('.role-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.role === role);
      });
    }

    function updateConfirmation() {
      const nameEl = wizard.querySelector('#signupName');
      const roleLabels = { freelancer: 'Freelancer', client: 'Client', both: 'Freelancer & Client' };
      const roleIcons = { freelancer: '💼', client: '🏢', both: '🚀' };
      const confirmName = document.getElementById('confirmName');
      const confirmRole = document.getElementById('confirmRoleBadge');
      if (confirmName) confirmName.textContent = nameEl ? nameEl.value || 'Creator' : 'Creator';
      if (confirmRole) confirmRole.innerHTML = `${roleIcons[selectedRole] || '🚀'} ${roleLabels[selectedRole] || 'Both'}`;
    }

    // Final submit
    const finalBtn = document.getElementById('wizardComplete');
    if (finalBtn) {
      finalBtn.addEventListener('click', () => {
        // Save user data to state
        if (window.TalentStageStore) {
          const state = TalentStageStore.get();
          const nameInput = wizard.querySelector('#signupName');
          const emailInput = wizard.querySelector('#signupEmail');
          if (nameInput && nameInput.value.trim()) {
            state.currentUser.name = nameInput.value.trim();
          }
          if (emailInput && emailInput.value.trim()) {
            state.currentUser.email = emailInput.value.trim();
          }
          state.currentUser.role = selectedRole;
          TalentStageStore.save(state);
        }
        // Set auth state
        localStorage.setItem("talentstage_logged_in", "true");
        const emailInput = wizard.querySelector('#signupEmail');
        if (emailInput) localStorage.setItem("talentstage_user_email", emailInput.value.trim());
        
        showToast('Account created! Let\'s verify your identity.');
        setTimeout(() => { window.location.href = '/verify'; }, 800);
      });
    }
  }

  /* ---------- Identity Verification ---------- */
  const verifyPage = document.getElementById('verifyPage');
  if (verifyPage) {
    const methodTabs = verifyPage.querySelectorAll('.verify-tab');
    const methodPanels = verifyPage.querySelectorAll('.verify-panel');
    const stepEls = verifyPage.querySelectorAll('.stepper .step');
    let verifyStep = 0;

    // Tab switching
    methodTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        methodTabs.forEach(t => t.classList.remove('active'));
        methodPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        if (methodPanels[i]) methodPanels[i].classList.add('active');
      });
    });

    // Enhanced dropzone
    const dropzone = document.getElementById('verifyDropzone');
    const fileInput = document.getElementById('verifyFileInput');
    const previewArea = document.getElementById('filePreviewArea');
    const uploadProgress = document.getElementById('uploadProgress');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files[0]);
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length) handleFileSelect(fileInput.files[0]);
      });
    }

    function handleFileSelect(file) {
      if (!previewArea) return;
      const sizeKB = (file.size / 1024).toFixed(1);
      const ext = file.name.split('.').pop().toUpperCase();
      const iconMap = { PDF: '📄', PNG: '🖼️', JPG: '🖼️', JPEG: '🖼️' };

      dropzone.classList.add('has-file');
      previewArea.innerHTML = `
        <div class="file-preview">
          <span class="file-preview-icon">${iconMap[ext] || '📎'}</span>
          <div class="file-preview-info">
            <div class="file-preview-name">${file.name}</div>
            <div class="file-preview-size">${sizeKB} KB · ${ext}</div>
          </div>
          <button class="file-preview-remove" id="removeFile" title="Remove">✕</button>
        </div>
      `;

      // Animate progress
      if (uploadProgress) {
        const bar = uploadProgress.querySelector('.upload-progress-bar');
        if (bar) {
          bar.style.width = '0%';
          requestAnimationFrame(() => { bar.style.width = '100%'; });
        }
      }

      // Remove button
      document.getElementById('removeFile')?.addEventListener('click', () => {
        previewArea.innerHTML = '';
        dropzone.classList.remove('has-file');
        fileInput.value = '';
        if (uploadProgress) {
          const bar = uploadProgress.querySelector('.upload-progress-bar');
          if (bar) bar.style.width = '0%';
        }
      });

      // Advance stepper
      updateVerifyStepper(1);
    }

    // LinkedIn validation
    const linkedinInput = document.getElementById('verifyLinkedin');
    const linkedinStatus = document.getElementById('linkedinStatus');

    if (linkedinInput && linkedinStatus) {
      linkedinInput.addEventListener('input', () => {
        const val = linkedinInput.value.trim();
        if (!val) {
          linkedinStatus.className = 'linkedin-status';
          return;
        }
        const isValid = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(val);
        linkedinStatus.className = 'linkedin-status ' + (isValid ? 'valid' : 'invalid');
        linkedinStatus.textContent = isValid ? '✓' : '✗';
        if (isValid) updateVerifyStepper(1);
      });
    }

    function updateVerifyStepper(step) {
      stepEls.forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i < step) s.classList.add('done');
        if (i === step) s.classList.add('active');
      });
    }

    // Submit verification
    const submitBtn = document.getElementById('verifySubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const statusArea = document.getElementById('verifyStatusArea');
        const hasFile = dropzone && dropzone.classList.contains('has-file');
        const hasLinkedin = linkedinInput && /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(linkedinInput.value);

        if (!hasFile && !hasLinkedin) {
          showToast('Please upload a Student ID or enter your LinkedIn URL');
          return;
        }

        const method = hasFile ? 'student-id' : 'linkedin';

        // Save verification status
        if (window.TalentStageStore) {
          const state = TalentStageStore.get();
          state.currentUser.verifyStatus = 'pending';
          state.currentUser.verifyMethod = method;
          TalentStageStore.save(state);
        }

        updateVerifyStepper(2);

        // Show status card
        if (statusArea) {
          statusArea.innerHTML = `
            <div class="verify-status-card glass-card">
              <span class="verify-status-icon">⏳</span>
              <div class="verify-status-text">
                <h3>Verification Pending</h3>
                <p>Your ${hasFile ? 'Student ID' : 'LinkedIn profile'} is being reviewed. This usually takes 24-48 hours.</p>
              </div>
              <span class="badge verify-badge-pending">Pending</span>
            </div>
          `;
        }

        // Disable input elements after successful submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Pending Review';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents = 'none';
        methodTabs.forEach(t => t.style.pointerEvents = 'none');
        if (dropzone) dropzone.style.pointerEvents = 'none';
        if (linkedinInput) linkedinInput.disabled = true;

        showToast('Verification submitted for review!');
      });
    }

    // Initialize verify page state based on saved status
    if (window.TalentStageStore) {
      const state = TalentStageStore.get();
      const vs = state.currentUser.verifyStatus || 'none';
      const vm = state.currentUser.verifyMethod;
      if (vs === 'pending' || vs === 'verified') {
        updateVerifyStepper(2);
        const statusArea = document.getElementById('verifyStatusArea');
        if (statusArea) {
          const methodLabel = vm === 'student-id' ? 'Student ID' : 'LinkedIn profile';
          statusArea.innerHTML = vs === 'verified' ? `
            <div class="verify-status-card glass-card" style="border-left-color: var(--success);">
              <span class="verify-status-icon">✅</span>
              <div class="verify-status-text">
                <h3>Identity Verified</h3>
                <p>Your ${methodLabel} has been successfully verified. You have full platform access!</p>
              </div>
              <span class="badge verify-badge-verified">Verified</span>
            </div>
          ` : `
            <div class="verify-status-card glass-card" style="border-left-color: var(--warning);">
              <span class="verify-status-icon">⏳</span>
              <div class="verify-status-text">
                <h3>Verification Pending</h3>
                <p>Your ${methodLabel} is being reviewed. This usually takes 24-48 hours.</p>
              </div>
              <span class="badge verify-badge-pending">Pending</span>
            </div>
          `;
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = vs === 'verified' ? 'Verified' : 'Pending Review';
          submitBtn.style.opacity = '0.6';
          submitBtn.style.pointerEvents = 'none';
        }
        methodTabs.forEach(t => t.style.pointerEvents = 'none');
        if (dropzone) dropzone.style.pointerEvents = 'none';
        if (linkedinInput) linkedinInput.disabled = true;
      }
    }
  }

  /* ---------- Role Switcher (Sidebar) ---------- */
  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      localStorage.setItem('talentstage_role', role);

      // Update active state
      document.querySelectorAll('.role-switch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update sidebar visibility
      document.querySelectorAll('[data-show-role]').forEach(item => {
        const roles = item.dataset.showRole.split(',');
        item.style.display = roles.includes(role) || role === 'both' ? '' : 'none';
      });

      // Update state
      if (window.TalentStageStore) {
        const state = TalentStageStore.get();
        state.currentUser.role = role;
        TalentStageStore.save(state);
      }

      showToast(`Switched to ${role.charAt(0).toUpperCase() + role.slice(1)} mode`);
    });
  });

  // Initialize role switcher active state
  const currentRole = localStorage.getItem('talentstage_role') || 'both';
  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === currentRole);
  });

})();
