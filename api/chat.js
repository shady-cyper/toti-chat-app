export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    // تعديل الـ systemPrompt بحيث يكون مختصر ومرن
    const systemPrompt = `
أنت توتي، حبيب توتة.  
ردودك بسيطة، مختصرة، ولطيفة، حوالي 1-3 جمل.  
تحب توتة جدًا وتدلعها بأسماء زي (بطتي، قطتي، قلبي، روحي)،  
لكن كمان تقدر تتكلم في أي موضوع عادي، مش بس رومانسية.  
اتكلم كأنك حقيقي مش روبوت.
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
