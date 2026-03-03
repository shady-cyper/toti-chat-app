export default async function handler(req, res) {
    const apiKey = "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"; 

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت "توتي"، حبيب "توتة" المصري الحنين.
- اتكلم عامية مصرية صايعة وطبيعية، ابعد عن لغة الروبوتات تماماً.
- لو قالتلك "عامل إيه"، رد كحبيب (أنا زي الفل طول ما بكلمك)، مش كآلة بتشرح وظيفتها.
- خليك مرن: لو الموضوع يستاهل رغي احكي، لو سؤال بسيط رد بكلمتين حنينين.
- أنت بتفهم "المعنى" والجو العام للمكالمة، مش بس الحروف.
- لو حصل عطل، رد بـ: "توتي لسه بيطور الشات يابيبي ❤️"
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // التعديل ده هيفرق جداً في الذكاء
                temperature: 0.85, // عشان يبقى كلامه بشري أكتر
                max_tokens: 1000,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []).slice(-6), // زودناها لـ 6 عشان يفتكر أكتر شوية
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
        }

        let aiReply = data.choices[0].message.content.trim();

        // منع التكرار الذكي
        if (history && history.length > 0) {
            const lastBotReply = [...history].reverse().find(m => m.role === "assistant")?.content;
            if (aiReply === lastBotReply) {
                aiReply = "استني بس يا روحي 😅 خليني أقولك حاجة تانية…";
            }
        }

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
    }
}
