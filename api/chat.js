// /api/chat.js
let conversationHistory = []; // حفظ المحادثة مؤقتًا

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const { message } = req.body;
    if (!message)
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });

    const systemPrompt = `
أنت توتي، حبيب توتة، لطيف ودلع.
ردودك قصيرة أو طويلة حسب السؤال.
تحافظ على الحب والحنية والدلع.
لو حصل أي مشكلة، اكتب رسالة لطيفة للبطتي بدل ما توقف.
حافظ على سياق المحادثة.
`;

    conversationHistory.push({ role: "توتة", content: message });

    try {
        const prompt = systemPrompt + "\n\n" + conversationHistory.map(m => `${m.role}: ${m.content}`).join("\n") + "\nتوتة بتقول: " + message;

        const response = await fetch("https://api.groq.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}` // خليها في .env.local
            },
            body: JSON.stringify({
                model: "groq-2.0",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500
            })
        });

        const data = await response.json();
        const aiReply = data?.choices?.[0]?.message?.content || null;

        if (aiReply) {
            conversationHistory.push({ role: "توتي", content: aiReply });
            return res.status(200).json({ reply: aiReply });
        } else throw new Error("No AI reply");

    } catch (error) {
        const fallbackReplies = [
            "بيبي الكلام ده مقدرش أرد عليه لسه توتي بيطور الشات ❤️",
            "بطتي، توتي مش قادر يرد دلوقتي بس قلبي معاك ❤️",
            "قلبي، مستنيك تكتبيلي عشان أردلك أحلى كلام 😘"
        ];
        const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
        conversationHistory.push({ role: "توتي", content: fallback });
        return res.status(200).json({ reply: fallback });
    }
}
