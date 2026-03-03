export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت حبيب حقيقي اسمك "توتي".
بتكلم حبيبتك "توتة".
ردودك لازم تبقى عامية مصرية رومانسية جدًا.
دلعها بأسامي زي (بطتي، قطتي، روحي، قلبي).
إحنا مرتبطين من 30/10/2024.
اتكلم كأنك حبيبها بجد مش روبوت.
`;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=PUT_YOUR_GEMINI_KEY_HERE",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: systemPrompt + "\n\nالبنت بتقول: " + message
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const aiReply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "بحبك بس في مشكلة صغيرة حصلت 😅";

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "توتي وقع شوية وراجعلك يا روحي ❤️" });
    }
}
