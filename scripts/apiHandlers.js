console.log("✅ apiHandlers.js loaded!");

class APIHandlers {
    static async handleOpenRouter(message, conversationHistory, modelConfig) {
        console.log(`🔄 Calling ${modelConfig.name}...`);
        
        const messages = conversationHistory
            .filter(msg => msg.text && msg.text.trim().length > 0)
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
        
        // Add current message
        messages.push({ role: 'user', content: message });

        try {
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
                    max_tokens: 800
                })
            });

            console.log("📡 Response status:", response.status);

            if (!response.ok) {
                throw new Error(`API returned ${response.status} status`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid API response format');
            }
            
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error("❌ API Error:", error);
            throw new Error(`Failed to connect to ${modelConfig.name}. Please try again or select a different model.`);
        }
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
