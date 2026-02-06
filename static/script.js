class ChatBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageForm = document.getElementById('messageForm');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.settingsButton = document.getElementById('settingsButton');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkConnection();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
            this.autoResizeTextarea();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggestion cards click handlers
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const message = card.getAttribute('data-message');
                this.sendMessageWithText(message);
            });
        });

        // Settings button handler
        this.settingsButton.addEventListener('click', () => {
            this.showSettings();
        });

        document.addEventListener('DOMContentLoaded', () => {
            this.messageInput.focus();
        });
    }

    sendMessageWithText(text) {
        this.messageInput.value = text;
        this.sendMessage();
    }

    showChatInterface() {
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }
        this.chatMessages.style.display = 'block';
        this.scrollToBottom();
    }

    showSettings() {
        // Placeholder for settings functionality
        alert('Settings functionality coming soon!');
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }

    async checkConnection() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            if (data.ai_configured) {
                // Connection is good, no need to show status in new UI
            } else {
                console.warn('API key not configured');
            }
        } catch (error) {
            console.error('Connection failed:', error);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Show chat interface on first message
        if (this.welcomeScreen && this.welcomeScreen.style.display !== 'none') {
            this.showChatInterface();
        }

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.updateSendButton();
        this.autoResizeTextarea();
        this.showTypingIndicator();
        this.sendButton.disabled = true;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            this.addMessage(data.response, 'ai');
            
            if (!data.configured) {
                console.warn('API key not configured');
            }
        } catch (error) {
            this.addMessage(`Error: ${error.message}`, 'ai', true);
        } finally {
            this.hideTypingIndicator();
            this.sendButton.disabled = false;
            this.messageInput.focus();
        }
    }

    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'ai') {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#avatarGradient)" opacity="0.9"/>
                    <circle cx="12" cy="12" r="8" fill="white" opacity="0.95"/>
                    <circle cx="12" cy="8" r="3" fill="#ec4899"/>
                    <path d="M9 14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14Z" fill="#ec4899"/>
                    <circle cx="8" cy="10" r="1.5" fill="#ec4899"/>
                    <circle cx="16" cy="10" r="1.5" fill="#ec4899"/>
                </svg>
            `;
        } else {
            avatar.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isError) {
            messageContent.style.background = '#fef2f2';
            messageContent.style.border = '1px solid #fecaca';
            messageContent.style.color = '#dc2626';
        }
        
        // Parse markdown for AI responses
        if (sender === 'ai' && !isError) {
            messageContent.innerHTML = marked.parse(content);
        } else {
            const paragraph = document.createElement('p');
            paragraph.textContent = content;
            messageContent.appendChild(paragraph);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

const chatBot = new ChatBot();
