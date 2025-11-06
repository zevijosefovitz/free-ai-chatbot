class ModelManager {
    constructor() {
        this.conversationHistory = [];
        this.currentModel = 'qwen';
    }

    async sendMessage(message, model = null) {
        const selectedModel = model || this.currentModel;
        
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

            this.conversationHistory.push({
                sender: 'ai',
                text: response,
                model: selectedModel,
                timestamp: new Date().toISOString()
            });

            return response;

        } catch (error) {
            console.error(`Error with ${selectedModel}:`, error);
            this.conversationHistory.pop();
            throw error;
        }
    }

    switchModel(newModel) {
        this.currentModel = newModel;
        return this.currentModel;
    }
}
