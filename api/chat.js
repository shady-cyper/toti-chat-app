let conversationHistory = []; // حفظ كل المحادثة عشان AI يفتكر

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "مقولتيش حاجة يا بطتي 😅" });
    }

    const systemPrompt = `
أنت توتي، حبيب حقيقي.
بتكلم حبيبتك توتة.
ردودك رومانسية، دلعها بأسامي زي بطتي، قلبي، روحي، قطتي.
اتكلم كأنك معاها على طول، مش روبوت.
الردود قصيرة لما مش محتاج طول.
تقدر تتكلم على أي موضوع.
`;

    // أضف رسالة المستخدم للتاريخ
    conversationHistory.push({ role: "user", content: message });

    try {
        const response = await fetch("https://api.groq.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "groq-chat-latest",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...conversationHistory
                ]
            })
        });

        // لو حصل مشكلة في API
        if (!response.ok) {
            const errorText = await response.text();
            console.error("خطأ من الـ API:", errorText);
            return res.status(response.status).json({ reply: `في مشكلة في الـ AI: ${errorText}` });
        }

        const data = await response.json();

        // الرد من AI
        const aiReply = data?.choices?.[0]?.message?.content || "بحبك بس في مشكلة صغيرة حصلت 😅";

        // نحفظ الرد عشان يتذكر
        conversationHistory.push({ role: "assistant", content: aiReply });

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("خطأ في الـ backend:", error);
        return res.status(500).json({ reply: `في مشكلة بالـ backend: ${error.message}` });
    }
}
