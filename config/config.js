const CONFIG = {
    APIs: {
        qwen: {
            name: "Qwen 2.5 (72B) - POWERFUL",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "qwen/qwen-2.5-72b-instruct:free",
            free: true,
            available: true,
            description: "Best for general questions, reasoning, and complex tasks"
        },
        mixtral: {
            name: "Mixtral 8x7B - SMART",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "mistralai/mixtral-8x7b-instruct:free",
            free: true,
            available: true,
            description: "Excellent for creative writing and analysis"
        },
        llama: {
            name: "Llama 3.1 (8B) - FAST",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "meta-llama/llama-3.1-8b-instruct:free",
            free: true,
            available: true,
            description: "Quick responses, good for everyday questions"
        },
        codellama: {
            name: "Code Llama (34B) - PROGRAMMING",
            endpoint: "https://api.openrouter.ai/api/v1/chat/completions",
            model: "codellama/codellama-34b-instruct:free",
            free: true,
            available: true,
            description: "Specialized for coding and technical questions"
        }
    },

    modelPreferences: {
        coding: ["codellama", "qwen", "llama"],
        creative: ["mixtral", "qwen", "llama"],
        technical: ["qwen", "mixtral", "codellama"],
        general: ["qwen", "mixtral", "llama"],
        reasoning: ["mixtral", "qwen", "llama"]
    }
};
