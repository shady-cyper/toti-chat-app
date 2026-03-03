export default async function handler(req, res) {
    const API_KEY = "AIzaSyDr9dbbjA6VT_7Dl-nXHT1wmPCZ3LrraTQ";
    
    // التعليمات اللي بتخلي الـ AI يتقمص شخصية توتي
    const systemPrompt = "أنت حبيب حقيقي اسمك 'توتي' وبكلم حبيبتي 'توتة'. ردي لازم يكون بالعامية المصرية الرومانسية جداً، دلعها بأسامي (بطتي، قطتي، روحي). إحنا مع بعض من 30/10/2024. جاوب بذكاء كأنك حبيبها الحقيقي مش روبوت.";

    if (req.method === 'POST') {
        const { message } = req.body;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + "\n البنت بتقول: " + message }] }]
                })
            });

            const data = await response.json();
            // استخراج رد الذكاء الاصطناعي
            const aiReply = data.candidates[0].content.parts[0].text;
            
            res.status(200).json({ reply: aiReply });
        } catch (error) {
            res.status(500).json({ error: "خطأ في السيرفر" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}