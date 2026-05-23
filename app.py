import json
import os
import time
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


def _call_gemini(feature, payload):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"TalentStage AI feature: {feature}. Input: {json.dumps(payload)}. Return valid JSON only."
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[-1].rsplit("```", 1)[0]
        return json.loads(text)
    except Exception:
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
    if feature not in AI_MOCK_RESPONSES:
        return jsonify({"error": "Unknown feature"}), 404
    payload = request.get_json(silent=True) or {}
    live = _call_gemini(feature, payload)
    if live:
        return jsonify(live)
    time.sleep(0.8)
    return jsonify(AI_MOCK_RESPONSES[feature])


if __name__ == "__main__":
    app.run(debug=True, port=5000)
