class APIHandlers {
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
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    static async handleQwen(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.qwen);
    }

    static async handleLlama(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.llama);
    }

    static async handleMixtral(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.mixtral);
    }

    static async handleCodellama(message, conversationHistory) {
        return this.handleOpenRouter(message, conversationHistory, CONFIG.APIs.codellama);
    }
}
