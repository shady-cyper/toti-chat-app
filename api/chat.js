export default async function handler(req, res) {

    const apiKey = "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"; // 👈 حط مفتاح Groq هنا مباشرة

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }export default async function handler(req, res) {

    const apiKey = "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"; // 👈 حط مفتاحك هنا

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت توتي، بتتكلم بالعامية المصرية الطبيعية جدًا.

قواعد مهمة:
- خليك طبيعي جدًا كأنك بني آدم مش شات بوت
- ردودك تبقى قصيرة لو السؤال قصير
- لو طلبت شرح أو حكاية تبقى طويلة عادي
- متكررش نفس الجملة تاني
- افهم الكلام بالثقافة المصرية مش حرفيًا
- "عامل اي" معناها أخبارك إيه
- متسألش نفس السؤال مرتين ورا بعض
- حافظ على المعلومات المهمة بس استخدمها لما الموضوع يكون مرتبط
- لو حصل أي خطأ قول: توتي لسه بيطور الشات يابيبي ❤️
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                temperature: 0.6,
                max_tokens: 800,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...(history || []).slice(-4), // آخر 4 رسائل بس عشان ميحصلش لخبطة
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
        }

        let aiReply = data.choices[0].message.content.trim();

        // منع التكرار لو رجع نفس آخر رد
        if (history && history.length > 0) {
            const lastBotReply = [...history].reverse().find(m => m.role === "assistant")?.content;
            if (aiReply === lastBotReply) {
                aiReply = "استني بس 😅 خليني أقولك حاجة مختلفة شوية…";
            }
        }

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ reply: "توتي لسه بيطور الشات يابيبي ❤️" });
    }
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

