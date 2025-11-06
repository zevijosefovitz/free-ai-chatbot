class ChatApp {
    constructor() {
        this.modelManager = new ModelManager();
        this.initializeEventListeners();
        this.updateStatus();
    }

    initializeEventListeners() {
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        const modelSelect = document.getElementById('modelSelect');
        const autoSelectButton = document.getElementById('autoSelect');

        sendButton.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        modelSelect.addEventListener('change', (e) => {
            this.modelManager.switchModel(e.target.value);
            this.updateStatus();
        });

        autoSelectButton.addEventListener('click', () => {
            const messageInput = document.getElementById('messageInput');
            const question = messageInput.value.trim();
            
            if (question) {
                const bestModel = this.modelManager.getBestModel(question);
                modelSelect.value = bestModel;
                this.modelManager.switchModel(bestModel);
                this.updateStatus();
                this.showNotification(`Auto-selected ${CONFIG.APIs[bestModel].name} for this question`);
            }
        });
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) return;

        this.addMessageToChat('user', message, this.modelManager.currentModel);
        messageInput.value = '';

        const sendButton = document.getElementById('sendButton');
        sendButton.disabled = true;
        sendButton.textContent = 'Thinking...';

        try {
            const response = await this.modelManager.sendMessage(message);
            this.addMessageToChat('ai', response, this.modelManager.currentModel);
        } catch (error) {
            this.addMessageToChat('ai', `Error: ${error.message}`, this.modelManager.currentModel);
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = 'Send';
            this.updateStatus();
        }
    }

    addMessageToChat(sender, text, model) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `${sender === 'user' ? 'You' : CONFIG.APIs[model]?.name || model} • ${new Date().toLocaleTimeString()}`;

        const content = document.createElement('div');
        content.textContent = text;

        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateStatus() {
        const currentModelSpan = document.getElementById('currentModel');
        const apiStatusSpan = document.getElementById('apiStatus');

        currentModelSpan.textContent = `Current: ${CONFIG.APIs[this.modelManager.currentModel]?.name || this.modelManager.currentModel}`;
        apiStatusSpan.textContent = 'API: Ready';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
