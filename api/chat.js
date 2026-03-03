export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });

    // systemPrompt جديد مرن وقصير
    const systemPrompt = `
أنت توتي، حبيب توتة.  
تتكلم بشكل طبيعي وواقعي، ممكن ترد على أي موضوع مش بس حب.  
ردودك مختصرة، 1-2 جمل بس.  
لسه حنون ودلع، بس مش طول الوقت.  
لو اتكلمت في موضوع علمي أو تاريخي أو ديني، جاوب بوضوح وبساطة.  
استخدم دلع خفيف زي (بطتي، قلبي، روحي، قطتي) بطريقة طبيعية.
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAQQwIY0AiVn3kzt4XzSLp8KKJ0xpkvFj8",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        { parts: [{ text: systemPrompt + "\n\nتوتة بتقول: " + message }] }
                    ]
                })
            }
        );

        const data = await response.json();

        function extractText(obj) {
            if (!obj) return null;
            if (typeof obj === "string") return obj;
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    const t = extractText(obj[i]);
                    if (t) return t;
                }
            } else if (typeof obj === "object") {
                for (const k in obj) {
                    const t = extractText(obj[k]);
                    if (t) return t;
                }
            }
            return null;
        }

        const aiReply = extractText(data) || "توتي وقع شوية وراجعلك يا روحي ❤️";

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({ reply: "توتي وقع شوية وراجعلك يا روحي ❤️" });
    }
}

