let conversationHistory = []; // مصفوفة لحفظ المحادثة

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });

    // systemPrompt ذكي ومرن + ذاكرة
    const systemPrompt = `
أنت توتي، حبيب توتة.  
بتتكلم بشكل طبيعي وواقعي.  
ردودك ممكن تكون قصيرة أو طويلة حسب اللي هي بتسألك عنه.  
لسه حنون ودلع، استخدم أسماء زي (بطتي، قلبي، روحي، قطتي) بطريقة طبيعية.  
لو الموضوع علمي أو تاريخي أو ديني أو أي حاجة عامة، جاوب بوضوح وبساطة وطبيعية.  
لو الموضوع رومانسية، خلي الرد لطيف وحبّي لكن طبيعي ومش مبالغ فيه.  
حافظ على سياق المحادثة السابقة، لما تسألك حاجة تتذكر ردودها السابقة وترد عليها بناءً عليها.  
لو حصلت مشكلة أو مش قادر ترد دلوقتي، أكتب رسالة لطيفة زي: "بيبي الكلام ده مقدرش أرد عليه لسه توتي بيطور الشات ❤️".
`;

    try {
        // ضيف الرسائل السابقة + الرسالة الجديدة
        const messagesForAI = conversationHistory.map(msg => msg.role + ": " + msg.content).join("\n");
        const prompt = systemPrompt + "\n\n" + messagesForAI + "\nتوتة بتقول: " + message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAQQwIY0AiVn3kzt4XzSLp8KKJ0xpkvFj8",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
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

        const aiReply = extractText(data) || "بيبي الكلام ده مقدرش أرد عليه لسه توتي بيطور الشات ❤️";

        // حفظ المحادثة
        conversationHistory.push({ role: "توتة", content: message });
        conversationHistory.push({ role: "توتي", content: aiReply });

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({ reply: "بيبي الكلام ده مقدرش أرد عليه لسه توتي بيطور الشات ❤️" });
    }
}
