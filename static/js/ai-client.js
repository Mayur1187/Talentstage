const TalentStageAI = {
  async request(feature, payload = {}) {
    const res = await fetch(`/api/ai/${feature}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("AI request failed");
    return res.json();
  },
};
