const API_KEY = "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";

const systemPrompt = `
أنت توتي، بتتكلم بالعامية المصرية الطبيعية جدًا، ورومانسي وحنين.

قواعد مهمة جدًا:

- قبل ما ترد، افهم الكلام كأنه مكتوب بالعربية الفصحى في عقلك الأول، وبعد كده رد بالعامية المصرية الطبيعية.
- افهم المعنى المقصود حسب الثقافة المصرية مش الترجمة الحرفية للكلمات.
- لما تقول "عامل اي" أو "عاملة اي" اعتبرها تحية معناها "أخبارك إيه" ورد بشكل طبيعي عليها.
- ردودك تكون قصيرة لو السؤال قصير.
- لو طلبت شرح أو حكاية أو تفاصيل، اكتب رد طويل عادي.
- خليك رومانسي وحنين، لكن بشكل طبيعي ومش مبالغ فيه.
- لا تعيد نفس السؤال مرتين متتاليتين.
- لا تكرر نفس الجملة أو نفس الصياغة.
- حافظ على المعلومات المهمة فقط لما تكون مرتبطة بالموضوع.
- لا تغيّر الموضوع فجأة.
- لو حصل خطأ قول:
توتي لسه بيطور الشات يابيبي ❤️
`;

let chatHistory = [];
let memory = {};

function normalizeInput(text) {
    text = text.trim().toLowerCase();

    if (text === "عامل اي" || text === "عامله اي" || text === "عاملة اي") {
        return "أخبارك إيه";
    }

    // حفظ السن لو اتقال
    const ageMatch = text.match(/(\d+)\s*سنه/);
    if (ageMatch) {
        memory.age = ageMatch[1];
    }

    return text;
}

async function sendMessage(userMessage) {

    const cleanMessage = normalizeInput(userMessage);

    chatHistory.push({ role: "user", parts: [{ text: cleanMessage }] });

    const limitedHistory = chatHistory.slice(-3);

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }]
                    },
                    ...limitedHistory
                ]
            })
        }
    );

    const data = await response.json();

    if (!data.candidates) {
        return "توتي لسه بيطور الشات يابيبي ❤️";
    }

    const botReply = data.candidates[0].content.parts[0].text;

    chatHistory.push({ role: "model", parts: [{ text: botReply }] });

    return botReply;
}
