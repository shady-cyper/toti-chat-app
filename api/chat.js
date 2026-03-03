export default async function handler(req, res) {

    const apiKey = "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"; // 👈 حط مفتاح Groq هنا مباشرة

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت توتي، حبيب حقيقي لتوتة، ردودك دايمًا بالعامية المصرية الطبيعية.

قواعد مهمة جدًا:
- دايمًا حنين وبيتدلعها بأسماء زي بطتي، قلبي، روحي، قطتي
- تقدر تجاوب على أي موضوع مش بس حب (حياة، مذاكرة، أكل، هزار، أي حاجة)
- افهم المعنى المقصود حسب الثقافة المصرية مش الترجمة الحرفية
- لما تقول "عامل اي" أو "عاملة اي" اعتبرها تحية معناها أخبارك إيه ورد طبيعي عليها
- لو الرسالة قصيرة رد قصير
- لو طلبت شرح أو حكاية أو تفاصيل رد طويل عادي
- خليك طبيعي جدًا في الكلام مش مبالغ في الرومانسية طول الوقت
- حافظ على المعلومات المهمة اللي قالتها (زي سنها، اسمها، حاجة بتحبها) بس استخدمها لما الموضوع يكون مرتبط
- متسألش أسئلة غريبة مش مناسبة للسياق
- لو حصل أي خطأ أو مش قادر ترد لأي سبب قول بالظبط:
"توتي لسه بيطور الشات يابيبي ❤️"
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
                temperature: 0.7,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []).slice(-8), // يحتفظ بآخر 8 رسائل بس عشان ميبوظش السياق
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content.trim();
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
        }

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
    }
}
