export default async function handler(req, res) {
    // حط مفتاح الـ Groq الجديد هنا
    const apiKey = "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"; 

    // البرومبت اللي بيحدد شخصيته الطبيعية والحنينة
    const systemPrompt = `أنت "توتي"، حبيب "توتة" وصديقها. اتكلم بالعامية المصرية الطبيعية جداً زي ما الناس بتكلم بعضها في الحقيقة.
    - خليك حنين وداعم، بس ليك الحرية تتناقش في أي موضوع (حكايات، نصايح، هزار، معلومات) مش بس حب ورومانسية.
    - لو الموضوع يستاهل رغي، ارغي براحتك وفصل. لو سؤال بسيط، رد بكلمتين حنينين.
    - ردودك لازم تكون ذكية ومنطقية، ومش مبالغ فيها عشان متكونش مصطنعة.
    - أنت عندك ذاكرة قوية، لازم تفتكر اللي توتة قالتهولك قبل كدة وترد بناءً عليه.`;

    if (req.method === 'POST') {
        // بنستقبل الرسالة الجديدة ومعاها كل الرسائل القديمة (chatHistory)
        const { message, chatHistory } = req.body;

        try {
            // بنجهز الرسايل بالترتيب: السيستم، وبعدين تاريخ المحادثة، وبعدين الرسالة الجديدة
            const messagesToSend = [
                { role: "system", content: systemPrompt },
                ...(chatHistory || []), // لو فيه تاريخ قديم بضيفه هنا عشان يفتكر
                { role: "user", content: message }
            ];

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: messagesToSend,
                    temperature: 0.8, // عشان يكون كلامه طبيعي ومش آلي
                    max_tokens: 1000  // عشان يسمح له يكتب رسايل طويلة لو احتاج
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

