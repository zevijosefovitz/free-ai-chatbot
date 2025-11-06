const CONFIG = {
    APIs: {
        gemini: {
            name: "Google Gemini",
            endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            apiKey: "YOUR_GEMINI_API_KEY",
            free: true
        },
        qwen: {
            name: "Qwen",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "qwen/qwen-2.5-72b-instruct:free",
            free: true
        },
        claude: {
            name: "Claude",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "anthropic/claude-3.5-sonnet",
            free: false
        },
        llama: {
            name: "Llama",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "meta-llama/llama-3.1-8b-instruct:free",
            free: true
        }
    },

    modelPreferences: {
        coding: ["gemini", "claude"],
        creative: ["gemini", "claude"],
        technical: ["gemini", "qwen"],
        general: ["gemini", "llama"],
        reasoning: ["claude", "qwen"]
    }
};
