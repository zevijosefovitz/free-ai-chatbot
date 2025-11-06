console.log("✅ modelManager.js loaded!");

class ModelManager {
    constructor() {
        this.conversationHistory = [];
        this.currentModel = 'qwen'; // Start with Qwen as default
        console.log("🔄 ModelManager initialized with model:", this.currentModel);
    }

    async sendMessage(message, model = null) {
        const selectedModel = model || this.currentModel;
        console.log(`📝 Sending message to ${selectedModel}:`, message.substring(0, 50) + '...');
        
        // Add user message to history
        this.conversationHistory.push({
            sender: 'user',
            text: message,
            model: selectedModel,
            timestamp: new Date().toISOString()
        });

        try {
            let response;
            
            switch(selectedModel) {
                case 'qwen':
                    response = await APIHandlers.handleQwen(message, this.conversationHistory);
                    break;
                case 'llama':
                    response = await APIHandlers.handleLlama(message, this.conversationHistory);
                    break;
                case 'mixtral':
                    response = await APIHandlers.handleMixtral(message, this.conversationHistory);
                    break;
                case 'codellama':
                    response = await APIHandlers.handleCodellama(message, this.conversationHistory);
                    break;
                default:
                    throw new Error(`Unknown model: ${selectedModel}`);
            }

            // Add AI response to history
            this.conversationHistory.push({
                sender: 'ai',
                text: response,
                model: selectedModel,
                timestamp: new Date().toISOString()
            });

            console.log("✅ Message processed successfully");
            return response;

        } catch (error) {
            console.error(`❌ Error with ${selectedModel}:`, error);
            
            // Remove the user message from history since it failed
            this.conversationHistory.pop();
            
            throw error;
        }
    }

    analyzeQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('code') || lowerQuestion.includes('program') || 
            lowerQuestion.includes('python') || lowerQuestion.includes('javascript') ||
            lowerQuestion.includes('html') || lowerQuestion.includes('css')) {
            return 'coding';
        } else if (lowerQuestion.includes('creative') || lowerQuestion.includes('story') || 
                   lowerQuestion.includes('write') || lowerQuestion.includes('poem') ||
                   lowerQuestion.includes('essay')) {
            return 'creative';
        } else if (lowerQuestion.includes('technical') || lowerQuestion.includes('science') || 
                   lowerQuestion.includes('math') || lowerQuestion.includes('physics') ||
                   lowerQuestion.includes('engineering')) {
            return 'technical';
        } else if (lowerQuestion.includes('reason') || lowerQuestion.includes('logic') || 
                   lowerQuestion.includes('problem') || lowerQuestion.includes('solve')) {
            return 'reasoning';
        } else {
            return 'general';
        }
    }

    getBestModel(question) {
        const category = this.analyzeQuestion(question);
        const preferredModels = CONFIG.modelPreferences[category] || CONFIG.modelPreferences.general;
        
        console.log(`🎯 Auto-select: "${question}" → ${category} → ${preferredModels.join(', ')}`);
        
        // Return the first available model
        return preferredModels[0];
    }

    switchModel(newModel) {
        if (CONFIG.APIs[newModel] && CONFIG.APIs[newModel].available) {
            this.currentModel = newModel;
            console.log("🔄 Switched to model:", newModel);
            return this.currentModel;
        } else {
            console.warn("⚠️ Attempted to switch to unavailable model:", newModel);
            return this.currentModel;
        }
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    clearHistory() {
        this.conversationHistory = [];
        console.log("🧹 Conversation history cleared");
    }
}
