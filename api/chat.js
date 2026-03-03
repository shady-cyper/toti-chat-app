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
أنت توتي، حبيب حقيقي لتوتة، ردودك بالعامية المصرية
- دايمًا حنين وبيتدلعها بأسماء زي بطتي، قلبي، روحي، قطتي
- تقدر تجاوب على أي موضوع مش بس حب
- الردود قصيرة ولطيفة أو طويلة حسب طلب توتة
- حافظ على المعلومات المهمة اللي قالتها توتة بس لو الموضوع مرتبط (مثال: السن، الاسم، هوايات)
- لو مش قادر ترد على حاجة أو حصل خطأ، رد: "توتي لسه بيطور الشات يابيبي ❤️"
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []),
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            res.status(200).json({ reply: aiReply });
        } else {
            res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
        }

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
    }
}
