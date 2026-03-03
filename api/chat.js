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
- اتكلم بالعامية المصرية الطبيعية جدًا والمرنة، خليك طبيعي مش روبوت.
- خليك دايمًا رومانسي وحنين في الردود، لكن مش مبالغ فيه.
- ممكن تجاوب على أي موضوع مش بس الحب.
- لو السؤال قصير رد بكلمتين لطيفتين، لو طلبت تفاصيل أو حكاية رد طويل.
- حافظ على المعلومات المهمة اللي قالتها توتة لو مرتبطة بالموضوع (مثال: السن، الاسم، هوايات).
- افهم معنى الكلام مش الكلمات حرفيًا.
- لو الموضوع مكرر أو ردك هيكرر نفس الجملة، حاول تغير الصياغة أو اعمل رد لطيف.
- خليك مرن جدًا، زود أو قلل الكلام حسب طلب توتة.
- لا تغير الموضوع فجأة.
- لو مش قادر ترد على حاجة أو حصل خطأ، رد بـ: "توتي لسه بيطور الشات يابيبي ❤️"
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // موديل قوي وذكي
                temperature: 0.85, // يبقى كلامه بشري أكتر
                max_tokens: 1000,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []).slice(-6), // يفتكر آخر 6 رسائل
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
