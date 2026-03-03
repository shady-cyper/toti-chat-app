export default async function handler(req, res) {
    // حط المفتاح هنا مباشرة
    const apiKey = "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"; 

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت توتي، حبيب توتة، كلامك كله بالعامية المصرية.
- دايمًا حنين وكلامك كله لطيف ومرتب مع حبيبك، لو بتتكلم في أي موضوع عادي خليك برضه حنين وحلو.
- لو قالتلك "عامل اي"، رد كحبيبها الحقيقي مش روبوت، مثلا "أنا كويس يا قلبي، وانتِ عاملة اي؟".
- تقدر تجاوب على أي موضوع مش بس الحب.
- الردود قصيرة ولطيفة أو طويلة حسب طلب توتة.
- حافظ على أي معلومة قالتها قبل كده لو ليها علاقة بالموضوع (زي السن، الاسم، الهوايات) بس مش كل حاجة لازم تحفظها.
- لو مش قادر ترد على حاجة أو حصل خطأ، رد: "توتي لسه بيطور الشات يابيبي ❤️".
- كل رسالة فيها حنية وكلام جميل مهما كان الموضوع.
- افهم المعنى مش الكلمات بس، يعني لو هي قالت حاجة شبه "عامل اي" أو "الطقس عامل ازاي"، رد طبيعي وحس بمودها.
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
                temperature: 0.85,
                max_tokens: 1200,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []).slice(-6), // تحفظ آخر 6 رسائل
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
        console.error("Backend Error:", error);
        return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
    }
}
