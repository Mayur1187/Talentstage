import json
import os
import re
import time

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
app.config.from_pyfile("instance/config.py")

AI_MOCK_RESPONSES = {
    "match": {
        "matches": [
            {"id": 1, "name": "Priya Sharma", "score": 96, "reason": "React + Figma portfolio, 4.9 rating, within budget"},
            {"id": 2, "name": "Marcus Chen", "score": 91, "reason": "Full-stack match, strong SaaS projects"},
            {"id": 3, "name": "Elena Vasquez", "score": 88, "reason": "UI/UX specialist, verified badges"},
            {"id": 4, "name": "Jordan Blake", "score": 84, "reason": "Video + motion graphics for brand campaigns"},
            {"id": 5, "name": "Aisha Okonkwo", "score": 81, "reason": "Content strategy + technical writing"},
        ]
    },
    "evaluate": {
        "proposals": [
            {"id": 101, "freelancer": "Priya Sharma", "relevance": 94, "clarity": 92, "value": 89, "recommended": True},
            {"id": 102, "freelancer": "Marcus Chen", "relevance": 87, "clarity": 90, "value": 85, "recommended": True},
            {"id": 103, "freelancer": "Sam Rivera", "relevance": 72, "clarity": 68, "value": 91, "recommended": False},
        ]
    },
    "portfolio-review": {
        "suggestions": [
            "Your project descriptions are too short — aim for 3–4 sentences with outcomes.",
            "Add measurable results to Project 3 (e.g. conversion lift, load time).",
            "4 portfolio items are missing live demo links.",
            "Highlight your verified React badge on the hero section.",
            "Consider adding a case study PDF for your top SaaS project.",
        ]
    },
    "skill-test": {
        "questions": [
            {"q": "What hook runs after every render?", "options": ["useEffect", "useMemo", "useCallback", "useRef"], "answer": 0},
            {"q": "Which prop spreads remaining props to a DOM element?", "options": ["spread", "rest", "forward", "None — use {...props}"], "answer": 3},
            {"q": "Keys in lists help React with:", "options": ["Styling", "Reconciliation", "Routing", "State persistence only"], "answer": 1},
            {"q": "Controlled input value is set by:", "options": ["DOM default", "React state", "CSS", "Browser cache"], "answer": 1},
            {"q": "useState initial value can be:", "options": ["Function lazy init", "Only strings", "Only numbers", "Undefined only"], "answer": 0},
            {"q": "Context avoids:", "options": ["Re-renders always", "Prop drilling", "Hooks", "Components"], "answer": 1},
            {"q": "Strict Mode in dev:", "options": ["Disables hooks", "Double-invokes effects", "Removes warnings", "Speeds prod"], "answer": 1},
            {"q": "Fragment syntax:", "options": ["<></>", "<fragment>", "<div>", "<react>"], "answer": 0},
            {"q": "memo() optimizes:", "options": ["Network", "Re-renders when props same", "Bundle size", "CSS"], "answer": 1},
            {"q": "Virtual DOM diffing is called:", "options": ["Reconciliation", "Hydration only", "Compilation", "Tree shaking"], "answer": 0},
        ]
    },
    "scope": {
        "title": "SaaS Dashboard Redesign",
        "deliverables": ["Wireframes (Figma)", "High-fidelity UI kit", "Responsive React components", "Handoff documentation"],
        "timeline": "4–6 weeks",
        "budget_min": 2500,
        "budget_max": 4500,
        "summary": "Structured brief for a B2B analytics dashboard refresh with design system alignment and developer-ready assets.",
    },
}

# ---------------------------------------------------------------------------
# Freelancer database used by AI to produce real, data-grounded answers
# ---------------------------------------------------------------------------
FREELANCER_DB = [
    {"id": 1, "name": "Priya Sharma", "title": "Senior UI/UX Designer", "skills": ["Figma", "React", "Design Systems"], "rate": 65, "rating": 4.9, "verified": ["React", "Figma"], "availability": "Available", "completeness": 92, "jobSuccess": 98, "totalEarned": "$30k+", "completedJobs": 42, "hoursWorked": 1200, "location": "San Francisco, CA (UTC-8)", "responseTime": "< 1 hr", "languages": ["English (Fluent)", "Hindi (Native)"], "badges": ["Top Rated", "Verified"], "bio": "I am a Senior UI/UX Designer with over 7 years of experience crafting intuitive, high-converting digital experiences. I specialize in SaaS platforms and design systems, ensuring scalability and consistency across your product. I've helped startups raise over $50M by designing pitch-perfect MVPs."},
    {"id": 2, "name": "Marcus Chen", "title": "Full-Stack Developer", "skills": ["Python", "Flask", "PostgreSQL", "Vue.js"], "rate": 85, "rating": 4.8, "verified": ["Python"], "availability": "Busy", "completeness": 88, "jobSuccess": 95, "totalEarned": "$50k+", "completedJobs": 38, "hoursWorked": 2100, "location": "Toronto, Canada (UTC-5)", "responseTime": "1-2 hrs", "languages": ["English (Fluent)", "Mandarin (Native)"], "badges": ["Rising Talent"], "bio": "Full-stack developer focused on building robust, scalable backends and snappy frontends. With a strong foundation in Python (Flask/Django) and modern JavaScript frameworks, I deliver end-to-end solutions. I prioritize clean code, comprehensive testing, and clear communication."},
    {"id": 3, "name": "Elena Vasquez", "title": "Brand & Motion Designer", "skills": ["After Effects", "Illustrator", "Branding"], "rate": 55, "rating": 4.95, "verified": [], "availability": "Available", "completeness": 76, "jobSuccess": 100, "totalEarned": "$15k+", "completedJobs": 24, "hoursWorked": 450, "location": "Madrid, Spain (UTC+1)", "responseTime": "< 24 hrs", "languages": ["Spanish (Native)", "English (Conversational)"], "badges": ["Top Rated"], "bio": "Award-winning brand and motion designer passionate about bringing brands to life through dynamic visuals. I create memorable logos, cohesive brand guidelines, and engaging motion graphics that capture attention and communicate your message effectively."},
    {"id": 4, "name": "Jordan Blake", "title": "Video Editor & Producer", "skills": ["Premiere Pro", "DaVinci", "YouTube"], "rate": 45, "rating": 4.7, "verified": ["Video"], "availability": "Available", "completeness": 84, "jobSuccess": 92, "totalEarned": "$8k+", "completedJobs": 56, "hoursWorked": 320, "location": "Austin, TX (UTC-6)", "responseTime": "< 1 hr", "languages": ["English (Native)"], "badges": [], "bio": "Creative video editor with a knack for storytelling. I specialize in fast-paced YouTube edits, promotional content, and social media shorts. My workflow is highly optimized in Premiere Pro and DaVinci Resolve, ensuring quick turnarounds without sacrificing quality."},
    {"id": 5, "name": "Aisha Okonkwo", "title": "Technical Content Writer", "skills": ["SEO", "API Docs", "Blogging"], "rate": 50, "rating": 4.85, "verified": ["Writing"], "availability": "Limited", "completeness": 90, "jobSuccess": 96, "totalEarned": "$12k+", "completedJobs": 89, "hoursWorked": 800, "location": "Lagos, Nigeria (UTC+1)", "responseTime": "2-4 hrs", "languages": ["English (Fluent)"], "badges": ["Top Rated"], "bio": "Technical writer bridging the gap between complex engineering concepts and user-friendly documentation. I excel at writing comprehensive API docs, engaging engineering blogs, and SEO-optimized technical content that drives organic traffic."},
    {"id": 6, "name": "Sam Rivera", "title": "Frontend Developer", "skills": ["JavaScript", "CSS", "Vue"], "rate": 70, "rating": 4.6, "verified": [], "availability": "Available", "completeness": 70, "jobSuccess": 88, "totalEarned": "$4k+", "completedJobs": 12, "hoursWorked": 150, "location": "Mexico City, Mexico (UTC-6)", "responseTime": "< 24 hrs", "languages": ["Spanish (Native)", "English (Fluent)"], "badges": [], "bio": "Detail-oriented frontend developer focused on creating responsive, accessible, and performant user interfaces. I love turning complex Figma designs into pixel-perfect code using modern HTML, CSS, and JavaScript frameworks."},
]

PROPOSAL_DB = [
    {"id": 101, "projectId": 1, "freelancer": "Priya Sharma", "bid": 3800, "timeline": "5 weeks", "message": "I've redesigned 3 B2B dashboards with measurable UX wins."},
    {"id": 102, "projectId": 1, "freelancer": "Marcus Chen", "bid": 4200, "timeline": "6 weeks", "message": "Full design-to-code delivery with component library."},
    {"id": 103, "projectId": 1, "freelancer": "Sam Rivera", "bid": 2900, "timeline": "4 weeks", "message": "Quick turnaround on UI implementation."},
]


# ---------------------------------------------------------------------------
# Build the system + user prompt for each AI feature
# ---------------------------------------------------------------------------
def _build_prompts(feature, payload):
    """Return (system_prompt, user_prompt) for a given feature."""

    if feature == "match":
        skills_needed = payload.get("skills", "React, Figma")
        budget_min = payload.get("budgetMin", 0)
        budget_max = payload.get("budgetMax", 99999)
        return (
            "You are TalentStage's AI matching engine. You receive a list of freelancers and project requirements. "
            "Rank the top 5 freelancers best suited for the project. For each, provide a match score (0-100) and a "
            "one-sentence reason. Consider skill overlap, rating, verified badges, hourly rate vs budget, and availability. "
            "Return ONLY valid JSON in this exact format: "
            '{"matches": [{"id": <int>, "name": "<string>", "score": <int 0-100>, "reason": "<string>"}]}',

            f"Project requires these skills: {skills_needed}. "
            f"Budget range: ${budget_min} - ${budget_max}. "
            f"Here is our freelancer database:\n{json.dumps(FREELANCER_DB, indent=2)}\n"
            "Rank the top 5 matches. Return ONLY the JSON object, nothing else."
        )

    elif feature == "evaluate":
        project_id = payload.get("projectId", 1)
        return (
            "You are TalentStage's proposal evaluator AI. You score each proposal on three criteria: "
            "relevance (how well the freelancer's skills/experience match the project), "
            "clarity (how well-written and specific the proposal is), and "
            "value (how competitive the bid is relative to the work). "
            "Each score is 0-100. Set recommended=true for proposals scoring above 80 average. "
            "Return ONLY valid JSON in this format: "
            '{"proposals": [{"id": <int>, "freelancer": "<string>", "relevance": <int>, "clarity": <int>, "value": <int>, "recommended": <bool>}]}',

            f"Evaluate these proposals for project ID {project_id} (SaaS Dashboard Redesign, skills: Figma+React, budget $2500-$4500):\n"
            f"{json.dumps(PROPOSAL_DB, indent=2)}\n"
            "Score each and return ONLY the JSON object."
        )

    elif feature == "portfolio-review":
        portfolio = payload.get("portfolio", [
            {"title": "FinTech Dashboard", "desc": "Redesigned analytics dashboard - 34% faster task completion.", "tools": ["Figma", "React"], "link": ""},
            {"title": "Health App UI Kit", "desc": "Complete mobile design system with 40+ components.", "tools": ["Figma", "Principle"], "link": ""},
            {"title": "E-learning Platform", "desc": "End-to-end UX for 50k+ monthly active learners.", "tools": ["Figma", "User Research"], "link": ""},
        ])
        return (
            "You are TalentStage's portfolio reviewer AI. Analyze the freelancer's portfolio projects and give "
            "specific, actionable improvement suggestions. Focus on: description quality, measurable outcomes, "
            "missing live links/demos, visual presentation, and strategic positioning. "
            "Return ONLY valid JSON: {\"suggestions\": [\"<suggestion 1>\", \"<suggestion 2>\", ...]}. "
            "Give 4-6 suggestions.",

            f"Review this portfolio:\n{json.dumps(portfolio, indent=2)}\n"
            "Give specific, actionable improvement suggestions. Return ONLY the JSON object."
        )

    elif feature == "skill-test":
        skill = payload.get("skill", "React")
        return (
            "You are TalentStage's skill verification AI. Generate a 10-question multiple-choice quiz to verify "
            f"proficiency in {skill}. Questions should range from intermediate to advanced. "
            "Each question has exactly 4 options with one correct answer. "
            "Return ONLY valid JSON in this exact format: "
            '{"questions": [{"q": "<question text>", "options": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"], "answer": <index 0-3 of correct option>}]}. '
            "Generate exactly 10 questions. Make them challenging but fair. Cover different aspects of the skill.",

            f"Generate 10 multiple-choice questions to verify proficiency in {skill}. "
            "Make them practical and challenging. Return ONLY the JSON object, no markdown."
        )

    elif feature == "scope":
        brief = payload.get("brief", "I need a dashboard redesign for our analytics SaaS")
        return (
            "You are TalentStage's project scoping AI. A client has described a vague project need. "
            "Generate a structured project brief with: a clear title, a summary paragraph, "
            "a list of specific deliverables, an estimated timeline, and a realistic budget range (min and max in USD). "
            "Return ONLY valid JSON in this format: "
            '{"title": "<string>", "summary": "<string>", "deliverables": ["<item1>", "<item2>", ...], '
            '"timeline": "<string>", "budget_min": <int>, "budget_max": <int>}',

            f"Client's description: \"{brief}\"\n"
            "Create a structured project brief. Be specific with deliverables. "
            "Give a realistic timeline and budget range. Return ONLY the JSON object."
        )

    return None, None


# ---------------------------------------------------------------------------
# Call the Groq API (OpenAI-compatible REST endpoint)
# ---------------------------------------------------------------------------
def _call_groq(feature, payload):
    """Call Groq's chat completions API. Returns parsed JSON or None."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None

    system_prompt, user_prompt = _build_prompts(feature, payload)
    if not system_prompt:
        return None

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 2048,
                "response_format": {"type": "json_object"},
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        text = data["choices"][0]["message"]["content"].strip()

        # Strip markdown code fences if the model wraps its output
        if text.startswith("```"):
            text = re.sub(r"^```\w*\n?", "", text)
            text = re.sub(r"\n?```$", "", text)

        return json.loads(text)
    except Exception as e:
        print(f"[Groq AI] Error for feature '{feature}': {e}")
        return None


@app.route("/")
def index():
    return render_template("pages/index.html", page_title="TalentStage — Creator & Freelancer Marketplace")


@app.route("/explore")
def explore():
    return render_template("pages/explore.html", page_title="Explore Talents")


@app.route("/talent/<int:talent_id>")
def talent_details(talent_id):
    return render_template("pages/talent-details.html", page_title="Talent Profile", talent_id=talent_id)


@app.route("/competitions")
def competitions():
    return render_template("pages/competitions.html", page_title="Skill Challenges")


@app.route("/competitions/<int:challenge_id>")
def competition_details(challenge_id):
    return render_template("pages/competition-details.html", page_title="Challenge Details", challenge_id=challenge_id)


@app.route("/community")
def community_feed():
    return render_template("pages/community-feed.html", page_title="Community Feed")


@app.route("/mentorship")
def mentorship():
    return render_template("pages/mentorship.html", page_title="Mentorship")


@app.route("/login")
def login():
    return render_template("pages/login.html", page_title="Log In")


@app.route("/signup")
def signup():
    return render_template("pages/signup.html", page_title="Sign Up")


@app.route("/verify")
def identity_verify():
    return render_template("pages/identity-verify.html", page_title="Identity Verification")


@app.route("/dashboard")
def dashboard():
    return render_template("pages/dashboard.html", page_title="Dashboard")


@app.route("/profile")
def profile():
    return render_template("pages/profile.html", page_title="My Profile")


@app.route("/profile/edit")
def edit_profile():
    return render_template("pages/edit-profile.html", page_title="Edit Profile")


@app.route("/upload")
def upload():
    return render_template("pages/upload.html", page_title="Upload Portfolio")


@app.route("/proposals")
def proposals_browse():
    return render_template("pages/proposals-browse.html", page_title="Browse Projects")


@app.route("/proposals/submit/<int:project_id>")
def submit_proposal(project_id):
    return render_template("pages/submit-proposal.html", page_title="Submit Proposal", project_id=project_id)


@app.route("/contracts")
def active_contracts():
    return render_template("pages/active-contracts.html", page_title="Active Contracts")


@app.route("/earnings")
def earnings():
    return render_template("pages/earnings.html", page_title="Earnings")


@app.route("/skill-verifier")
def skill_verifier():
    return render_template("pages/skill-verifier.html", page_title="Skill Verifier")


@app.route("/portfolio-reviewer")
def portfolio_reviewer():
    return render_template("pages/portfolio-reviewer.html", page_title="Portfolio Reviewer")


@app.route("/client/dashboard")
def recruiter_dashboard():
    return render_template("pages/recruiter-dashboard.html", page_title="Client Dashboard")


@app.route("/client/post-project")
def post_project():
    return render_template("pages/post-project.html", page_title="Post a Project")


@app.route("/client/projects/<int:project_id>")
def project_details(project_id):
    return render_template("pages/project-details.html", page_title="Project Details", project_id=project_id)


@app.route("/client/proposals/<int:project_id>")
def view_proposals(project_id):
    return render_template("pages/view-proposals.html", page_title="View Proposals", project_id=project_id)


@app.route("/client/milestones/<int:contract_id>")
def milestones(contract_id):
    return render_template("pages/milestones.html", page_title="Milestones & Payments", contract_id=contract_id)


@app.route("/client/saved")
def saved_freelancers():
    return render_template("pages/saved-freelancers.html", page_title="Saved Freelancers")


@app.route("/client/discover")
def talent_discovery():
    return render_template("pages/talent-discovery.html", page_title="Smart Match")


@app.route("/client/active-projects")
def client_active_projects():
    return render_template("pages/client-active-contracts.html", page_title="Active Projects")


@app.route("/client/review/<int:freelancer_id>")
def client_review(freelancer_id):
    return render_template("pages/client-review.html", page_title="Review Freelancer", freelancer_id=freelancer_id)


@app.route("/subscription")
def subscription():
    return render_template("pages/subscription.html", page_title="Pro Subscription")


@app.route("/reviews")
def reviews():
    return render_template("pages/reviews.html", page_title="Reviews")


@app.route("/messages")
def messages():
    return render_template("pages/messages.html", page_title="Messages")


@app.route("/notifications")
def notifications():
    return render_template("pages/notifications.html", page_title="Notifications")


@app.route("/api/ai/<feature>", methods=["POST"])
def ai_proxy(feature):
    allowed_features = {"match", "evaluate", "portfolio-review", "skill-test", "scope"}
    if feature not in allowed_features:
        return jsonify({"error": "Unknown feature"}), 404
    payload = request.get_json(silent=True) or {}
    live = _call_groq(feature, payload)
    if live:
        return jsonify(live)
    # Fallback to mock data when no API key or on error
    time.sleep(0.8)
    return jsonify(AI_MOCK_RESPONSES.get(feature, {"error": "No mock available"}))


@app.route("/api/ai/status")
def ai_status():
    """Quick endpoint so the frontend can check if real AI is available."""
    has_key = bool(os.environ.get("GROQ_API_KEY"))
    return jsonify({"live": has_key, "provider": "groq" if has_key else "mock"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
