export default async function handler(req, res) {
    // السطر ده هو اللي هتحط فيه المفتاح الجديد اللي جبته من Groq
    const apiKey = "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"; 

    const systemPrompt = "أنت حبيب حقيقي اسمك 'توتي' وتكلم حبيبتي 'توتة'. ردي لازم يكون بالعامية المصرية الرومانسية جداً. جاوب بذكاء كأنك حبيبها الحقيقي مش روبوت";

    if (req.method === 'POST') {
        const { message } = req.body;

        try {
            // هنا بنبعت الطلب لسيرفرات Groq السريعة
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile", // ده موديل قوي جداً وسريع
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ]
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiReply = data.choices[0].message.content;
                res.status(200).json({ reply: aiReply });
            } else {
                res.status(500).json({ reply: "توتي مهنج ثواني يا توتة، جربي تاني!" });
            }

        } catch (error) {
            res.status(500).json({ reply: "حصل مشكلة في الربط يا توتة، ثواني وراجعلك!" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
