class APIHandlers {
    static async handleGemini(message, conversationHistory) {
        if (!CONFIG.APIs.gemini.apiKey || CONFIG.APIs.gemini.apiKey === "YOUR_GEMINI_API_KEY") {
            throw new Error("Please set your Gemini API key in config.js. Get it from: https://makersuite.google.com/app/apikey");
        }

        const contents = [
            {
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(`${CONFIG.APIs.gemini.endpoint}?key=${CONFIG.APIs.gemini.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    static async handleOpenRouter(message, conversationHistory, modelConfig) {
        const messages = [
            ...conversationHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch(modelConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer free',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Free AI Chatbot'
            },
            body: JSON.stringify({
                model: modelConfig.model,
                messages: messages,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    static async handleQwen(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.qwen);
    }

    static async handleClaude(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.claude);
    }

    static async handleLlama(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.llama);
    }
}
