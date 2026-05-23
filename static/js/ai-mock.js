const AI_MOCK = {
  match: () => ({
    matches: [
      { id: 1, name: "Priya Sharma", score: 96, reason: "React + Figma portfolio, 4.9 rating, within budget" },
      { id: 2, name: "Marcus Chen", score: 91, reason: "Full-stack match, strong SaaS projects" },
      { id: 3, name: "Elena Vasquez", score: 88, reason: "UI/UX specialist, verified badges" },
      { id: 4, name: "Jordan Blake", score: 84, reason: "Video + motion for brand campaigns" },
      { id: 5, name: "Aisha Okonkwo", score: 81, reason: "Content strategy + technical writing" },
    ],
  }),
  evaluate: () => ({
    proposals: MOCK_DATA.proposals.map(p => ({
      id: p.id,
      freelancer: p.freelancer,
      relevance: p.relevance,
      clarity: p.clarity,
      value: p.value,
      recommended: p.recommended,
    })),
  }),
  "portfolio-review": () => ({
    suggestions: [
      "Your project descriptions are too short — aim for 3–4 sentences with outcomes.",
      "Add measurable results to Project 3 (e.g. conversion lift, load time).",
      "4 portfolio items are missing live demo links.",
      "Highlight your verified React badge on the hero section.",
    ],
  }),
  "skill-test": () => AI_MOCK_QUESTIONS,
  scope: () => ({
    title: "SaaS Dashboard Redesign",
    deliverables: ["Wireframes (Figma)", "High-fidelity UI kit", "Responsive React components", "Handoff docs"],
    timeline: "4–6 weeks",
    budget_min: 2500,
    budget_max: 4500,
    summary: "Structured brief for a B2B analytics dashboard refresh.",
  }),
};

const AI_MOCK_QUESTIONS = {
  questions: [
    { q: "What hook runs after every render?", options: ["useEffect", "useMemo", "useCallback", "useRef"], answer: 0 },
    { q: "Keys in lists help React with:", options: ["Styling", "Reconciliation", "Routing", "Caching"], answer: 1 },
    { q: "Controlled input value is set by:", options: ["DOM", "React state", "CSS", "Browser"], answer: 1 },
    { q: "Context avoids:", options: ["Re-renders", "Prop drilling", "Hooks", "JSX"], answer: 1 },
    { q: "Fragment syntax:", options: ["<></>", "<frag>", "<div>", "<r>"], answer: 0 },
    { q: "memo() optimizes:", options: ["Network", "Re-renders", "Bundle", "CSS"], answer: 1 },
    { q: "Virtual DOM diffing:", options: ["Reconciliation", "Hydration", "Compile", "Shake"], answer: 0 },
    { q: "useState lazy init uses:", options: ["Function", "String only", "Number", "Null"], answer: 0 },
    { q: "Strict Mode in dev:", options: ["Disables hooks", "Double-invokes effects", "No warnings", "Prod only"], answer: 1 },
    { q: "Spread props syntax:", options: ["{...props}", "{{props}}", "[props]", "<props>"], answer: 0 },
  ],
};

async function runAI(feature, payload = {}) {
  const panel = document.querySelector(`[data-ai-panel="${feature}"]`);
  const resultEl = panel?.querySelector(".ai-result");
  const loadingEl = panel?.querySelector(".ai-loading");
  if (loadingEl) loadingEl.classList.remove("hidden");
  if (resultEl) resultEl.classList.add("hidden");

  try {
    const data = await TalentStageAI.request(feature, payload);
    if (loadingEl) loadingEl.classList.add("hidden");
    if (resultEl) {
      resultEl.classList.remove("hidden");
      renderAIResult(feature, data, resultEl);
    }
    return data;
  } catch (err) {
    if (loadingEl) loadingEl.classList.add("hidden");
    showToast("AI request failed — showing offline results.");
    const fallback = AI_MOCK[feature]?.() || {};
    if (resultEl) {
      resultEl.classList.remove("hidden");
      renderAIResult(feature, fallback, resultEl);
    }
    return fallback;
  }
}

function renderAIResult(feature, data, el) {
  if (feature === "match" && data.matches) {
    el.innerHTML = data.matches.map(m => `
      <div class="match-card glass-card">
        <div class="match-score">${m.score}</div>
        <div><strong>${m.name}</strong><p class="text-sm text-muted">${m.reason}</p></div>
        <a href="/talent/${m.id}" class="btn btn-sm btn-secondary">View</a>
      </div>`).join("");
  } else if (feature === "evaluate" && data.proposals) {
    el.innerHTML = data.proposals.map(p => `
      <div class="glass-card mb-2 ${p.recommended ? "proposal-card recommended" : ""}">
        <div class="flex-between"><strong>${p.freelancer}</strong>${p.recommended ? '<span class="badge badge-recommended">Recommended</span>' : ""}</div>
        <div class="score-bar"><label>Relevance <span>${p.relevance}%</span></label><div class="progress-bar"><span style="width:${p.relevance}%"></span></div></div>
        <div class="score-bar"><label>Clarity <span>${p.clarity}%</span></label><div class="progress-bar"><span style="width:${p.clarity}%"></span></div></div>
        <div class="score-bar"><label>Value <span>${p.value}%</span></label><div class="progress-bar"><span style="width:${p.value}%"></span></div></div>
      </div>`).join("");
  } else if (feature === "portfolio-review" && data.suggestions) {
    el.innerHTML = "<ul>" + data.suggestions.map(s => `<li class="mb-2">${s}</li>`).join("") + "</ul>";
  } else if (feature === "scope") {
    el.innerHTML = `
      <h4>${data.title}</h4>
      <p class="text-muted mt-1">${data.summary}</p>
      <p class="mt-2"><strong>Timeline:</strong> ${data.timeline}</p>
      <p><strong>Budget:</strong> $${data.budget_min?.toLocaleString()} – $${data.budget_max?.toLocaleString()}</p>
      <ul class="mt-2">${(data.deliverables || []).map(d => `<li>${d}</li>`).join("")}</ul>`;
    const form = document.getElementById("project-form");
    if (form) {
      const title = form.querySelector("[name=title]");
      if (title) title.value = data.title || "";
    }
  } else {
    el.innerHTML = '<pre class="text-sm">' + JSON.stringify(data, null, 2) + "</pre>";
  }
}

window.runAI = runAI;
