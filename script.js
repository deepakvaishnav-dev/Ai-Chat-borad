// Gemini API Chatbot Script - Fixed Version with Correct API URL
const API_KEY = 'AIzaSyAsq5ReWzb5f9-ny62gGJNx8uSZwMZQnVU'; // Replace this with your actual Gemini API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    // Add welcome message
    addMessage("Hello! I'm your AI assistant powered by Gemini. Ask me anything and I'll provide real-time answers!", false);
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Focus input on load
    messageInput.focus();
});

// Function to call Gemini API
async function getGeminiResponse(question) {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        return "⚠️ Please replace 'YOUR_API_KEY_HERE' in the script.js file with your actual Gemini API key to use this chatbot.";
    }
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful AI assistant. Please provide a helpful and accurate response to: ${question}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "I received a response but couldn't process it properly. Please try again.";
        }
        
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        if (error.message.includes('404')) {
            return "❌ API endpoint not found. Please check your API key and ensure the Gemini API is enabled in your Google Cloud Console.";
        } else if (error.message.includes('401')) {
            return "❌ Invalid API key. Please check your Gemini API key in script.js";
        } else if (error.message.includes('403')) {
            return "❌ API key not authorized. Please enable the Gemini API in your Google Cloud Console";
        } else if (error.message.includes('429')) {
            return "⚠️ Rate limit exceeded. Please wait a moment and try again";
        } else {
            return "❌ I'm having trouble connecting to the AI service. Please check your internet connection and API key.";
        }
    }
}

// Function to add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textElement = document.createElement('p');
    textElement.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    content.appendChild(textElement);
    content.appendChild(time);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    messageInput.value = '';
    
    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>🤖 AI is thinking...</p>
            <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Get AI response
    const aiResponse = await getGeminiResponse(message);
    
    // Remove loading and add response
    chatMessages.removeChild(loadingDiv);
    addMessage(aiResponse);
}

// Function to clear chat
function clearChat() {
    chatMessages.innerHTML = '';
    addMessage("Hello! I'm your AI assistant powered by Gemini. Ask me anything and I'll provide real-time answers!");
}

// Function to check API health
async function checkAPIHealth() {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        console.log('⚠️ Please add your API key to test the connection');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "test"
                    }]
                }]
            })
        });
        
        if (response.ok) {
            console.log('✅ Gemini API connection successful');
        } else {
            console.error('❌ Gemini API connection failed:', response.status);
        }
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
    }
}

// Run health check on page load
checkAPIHealth();
