console.log("✅ app.js loaded!");

class ChatApp {
    constructor() {
        console.log("🚀 Initializing ChatApp...");
        this.modelManager = new ModelManager();
        this.isProcessing = false;
        this.initializeEventListeners();
        this.updateStatus();
        console.log("✅ ChatApp initialized!");
    }

    initializeEventListeners() {
        console.log("🔌 Setting up event listeners...");
        
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        const modelSelect = document.getElementById('modelSelect');
        const autoSelectButton = document.getElementById('autoSelect');

        // Send message on button click
        sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key (but allow Shift+Enter for new line)
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Update auto-select button state
        messageInput.addEventListener('input', () => {
            this.updateAutoSelectVisibility();
        });

        // Handle model switching
        modelSelect.addEventListener('change', (e) => {
            const newModel = e.target.value;
            this.modelManager.switchModel(newModel);
            this.updateStatus();
            this.showNotification(`Switched to ${CONFIG.APIs[newModel]?.name || newModel}`);
        });

        // Auto-select best model
        autoSelectButton.addEventListener('click', () => {
            this.autoSelectModel();
        });

        console.log("✅ Event listeners setup complete!");
    }

    updateAutoSelectVisibility() {
        const messageInput = document.getElementById('messageInput');
        const autoSelectButton = document.getElementById('autoSelect');
        const hasText = messageInput.value.trim().length > 0;
        
        autoSelectButton.style.opacity = hasText ? '1' : '0.6';
        autoSelectButton.disabled = !hasText;
    }

    autoSelectModel() {
        const messageInput = document.getElementById('messageInput');
        const question = messageInput.value.trim();
        
        if (!question) {
            this.showNotification('Please type a question first!', 'warning');
            return;
        }

        const bestModel = this.modelManager.getBestModel(question);
        const modelSelect = document.getElementById('modelSelect');
        
        modelSelect.value = bestModel;
        this.modelManager.switchModel(bestModel);
        this.updateStatus();
        
        const modelInfo = CONFIG.APIs[bestModel];
        this.showNotification(`🎯 Auto-selected: ${modelInfo.name} - ${modelInfo.description}`);
    }

    async sendMessage() {
        if (this.isProcessing) {
            console.log("⏳ Already processing, ignoring click");
            return;
        }
        
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            console.log("⚠️ Empty message, ignoring");
            return;
        }

        console.log("📤 Sending message:", message);
        this.isProcessing = true;

        // Add user message to UI immediately
        this.addMessageToChat('user', message, this.modelManager.currentModel);
        messageInput.value = '';

        // Update UI to show loading state
        const sendButton = document.getElementById('sendButton');
        sendButton.disabled = true;
        sendButton.innerHTML = '<span class="btn-text">Thinking...</span><span class="btn-icon">⏳</span>';
        this.updateStatus();

        try {
            const response = await this.modelManager.sendMessage(message);
            this.addMessageToChat('ai', response, this.modelManager.currentModel);
            
        } catch (error) {
            console.error("💥 Chat error:", error);
            this.addMessageToChat('ai', 
                `❌ ${error.message}\n\n💡 Try:\n• Selecting a different model\n• Checking your internet connection\n• Trying again in a moment`, 
                this.modelManager.currentModel
            );
        } finally {
            // Reset UI
            this.isProcessing = false;
            sendButton.disabled = false;
            sendButton.innerHTML = '<span class="btn-text">Send</span><span class="btn-icon">📤</span>';
            this.updateStatus();
            this.updateAutoSelectVisibility();
            
            // Refocus input
            messageInput.focus();
        }
    }

    addMessageToChat(sender, text, model) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Remove welcome message if it's the first real message
        const welcomeMessage = chatMessages.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const modelInfo = CONFIG.APIs[model];
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = `${sender === 'user' ? 'You' : (modelInfo?.name || model)} • ${new Date().toLocaleTimeString()}`;

        const content = document.createElement('div');
        content.textContent = text;
        content.style.whiteSpace = 'pre-wrap';
        content.style.lineHeight = '1.5';

        messageDiv.appendChild(header);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateStatus() {
        const currentModelSpan = document.getElementById('currentModel');
        const apiStatusSpan = document.getElementById('apiStatus');

        const modelInfo = CONFIG.APIs[this.modelManager.currentModel];
        currentModelSpan.textContent = `Active: ${modelInfo?.name || this.modelManager.currentModel}`;
        
        if (this.isProcessing) {
            apiStatusSpan.textContent = 'Status: Thinking... 🔄';
            apiStatusSpan.style.color = '#f39c12';
        } else {
            apiStatusSpan.textContent = 'Status: Ready ✅';
            apiStatusSpan.style.color = '#27ae60';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'warning' ? '#e74c3c' : '#27ae60';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            font-weight: 500;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM loaded, starting app...");
    window.chatApp = new ChatApp();
});
