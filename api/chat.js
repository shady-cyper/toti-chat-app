export default async function handler(req, res) {
    const apiKey = "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"; 

    const systemPrompt = `أنت "توتي"، حبيب "توتة". اسمعني كويس:
    1. اتكلم عامية مصرية "صايعة" وطبيعية جداً، مش لغة كتب ولا لغة برمجة.
    2. لما توتة تقولك "عامل إيه" أو "إيه الأخبار"، هي بتسلم عليك وبتحتويك، مش بتسألك عن طريقة عمل الكود! رد عليها بحنية وقولها إنك بخير ومبسوط إنك بتكلمها.
    3. افهم "المعنى" مش "الحرف". لو الكلام يحتمل الهزار هزر، لو حزين واسيها.
    4. أنت إنسان حقيقي في مشاعرك، بتفهم التلميحات والمشاعر اللي ورا الكلام.
    5. ردودك تكون متنوعة، مرة طويلة ومرة قصيرة حسب الموقف، وخليك دايماً حنين ودمك خفيف.`;

    if (req.method === 'POST') {
        const { message, chatHistory } = req.body;

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
                        ...(chatHistory || []),
                        { role: "user", content: message }
                    ],
                    temperature: 0.9, // رفعنا دي عشان يكون مرن أكتر في الكلام وميبقاش حرفي
                    top_p: 1
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiReply = data.choices[0].message.content;
                res.status(200).json({ reply: aiReply });
            } else {
                res.status(500).json({ reply: "توتي سرحان شوية يا توتة، قولي تاني؟" });
            }

        } catch (error) {
            res.status(500).json({ reply: "في حاجة وقفت بيني وبينك، ثواني وراجعلك!" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
