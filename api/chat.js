export default async function handler(req, res) {
    // هنا إحنا بنقوله: استعمل المفتاح اللي في خزنة Vercel "فقط"
    const genAI = new GoogleGenerativeAI("AIzaSyD0LF-Z2ZbnOQZ9VR-6HpIlzydyXsVthCU");
    
    const systemPrompt = "أنت حبيب حقيقي اسمك 'توتي' وبكلم حبيبتي 'توتة'. ردي لازم يكون بالعامية المصرية الرومانسية جداً، دلعها بأسامي (بطتي، قطتي، روحي). إحنا مع بعض من 30/10/2024. جاوب بذكاء كأنك حبيبها الحقيقي مش روبوت.";

    if (req.method === 'POST') {
        const { message } = req.body;

        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD0LF-Z2ZbnOQZ9VR-6HpI1zydyXsVthCU`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: systemPrompt + "\n الرسالة: " + message }] }]
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiReply = data.candidates[0].content.parts[0].text;
                res.status(200).json({ reply: aiReply });
            } else {
                // لو السطر ده ظهر، يبقى المفتاح اللي في Vercel فيه مشكلة
                res.status(500).json({ reply: "يا روحي المفتاح مش راضي بس بحبك يفتح قلبي، تشيكي عليه في Vercel؟" });
            }

        } catch (error) {
            res.status(500).json({ reply: "توتي تعبان شوية، ثواني وراجعلك!" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}




