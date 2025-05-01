// Dados simulados baseados na estrutura do seu banco de dados
const mockData = {
    users: {
        "userID1": {
            name: "João",
            email: "joao@example.com",
            profileImage: "",
            conversations: {
                "chatID1": true,
                "chatID2": true
            }
        },
        "userID2": {
            name: "Maria",
            email: "maria@example.com",
            profileImage: "",
            conversations: {
                "chatID1": true
            }
        },
        "userID3": {
            name: "Paulo",
            email: "paulo@example.com",
            profileImage: "",
            conversations: {
                "chatID2": true
            }
        },
        "userID4": {
            name: "Ana",
            email: "ana@example.com",
            profileImage: "",
            conversations: {
                "chatID2": true
            }
        }
    },
    chats: {
        "chatID1": {
            type: "private",
            members: {
                "userID1": true,
                "userID2": true
            },
            lastMessage: {
                text: "Oi, como você está?",
                senderID: "userID1",
                timestamp: "2025-05-01T12:00:00Z"
            }
        },
        "chatID2": {
            type: "group",
            title: "Amigos",
            members: {
                "userID1": true,
                "userID3": true,
                "userID4": true
            },
            lastMessage: {
                text: "Vamos sair hoje?",
                senderID: "userID3",
                timestamp: "2025-05-01T12:05:00Z"
            }
        }
    },
    messages: {
        "chatID1": [
            {
                messageID: "messageID1",
                text: "Oi, como você está?",
                senderID: "userID1",
                timestamp: "2025-05-01T12:00:00Z"
            },
            {
                messageID: "messageID2",
                text: "Tudo bem, e contigo?",
                senderID: "userID2",
                timestamp: "2025-05-01T12:01:00Z"
            }
        ],
        "chatID2": [
            {
                messageID: "messageID1",
                text: "Vamos sair hoje?",
                senderID: "userID3",
                timestamp: "2025-05-01T12:05:00Z"
            }
        ]
    }
};

// Simula o usuário atual (João por padrão)
const currentUserId = "userID1";

// Carrega as conversas ao abrir a página
window.onload = () => {
    loadConversations(currentUserId);
};

// Função para carregar as conversas do usuário
function loadConversations(userId) {
    const chatList = document.querySelector(".chat-list");
    chatList.innerHTML = ""; // Limpa a lista de conversas

    const userConversations = mockData.users[userId].conversations || {};

    // Itera sobre as conversas do usuário
    for (const chatId of Object.keys(userConversations)) {
        const chatData = mockData.chats[chatId];
        const chatItem = document.createElement("li");
        chatItem.classList.add("chat-item");
        chatItem.textContent = chatData.title || getChatName(chatData, userId);
        chatItem.dataset.chatId = chatId;
        chatItem.addEventListener("click", () => loadMessages(chatId, userId));
        chatList.appendChild(chatItem);
    }
}

// Função para obter o nome do chat (para chats privados)
function getChatName(chatData, currentUserId) {
    if (chatData.type === "private") {
        const members = Object.keys(chatData.members);
        const otherUserId = members.find(id => id !== currentUserId);
        return mockData.users[otherUserId]?.name || "Usuário Desconhecido";
    }
    return "Grupo Sem Nome";
}

// Função para carregar as mensagens de um chat
function loadMessages(chatId, currentUserId) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = ""; // Limpa as mensagens atuais

    const messages = mockData.messages[chatId] || [];

    // Exibe as mensagens
    messages.forEach(messageData => {
        const messageElement = document.createElement("p");
        const senderName = mockData.users[messageData.senderID]?.name || "Desconhecido";
        messageElement.classList.add("message", messageData.senderID === currentUserId ? "sent" : "received");
        messageElement.innerHTML = `<strong>${senderName}:</strong> ${messageData.text}`;
        messagesDiv.appendChild(messageElement);
    });

    // Mantém o scroll na parte inferior
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Função para enviar uma nova mensagem
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const selectedChat = document.querySelector(".chat-item.active");

    if (messageText && selectedChat) {
        const chatId = selectedChat.dataset.chatId;

        // Adiciona a nova mensagem aos dados mock
        if (!mockData.messages[chatId]) {
            mockData.messages[chatId] = [];
        }
        mockData.messages[chatId].push({
            messageID: `messageID${mockData.messages[chatId].length + 1}`,
            text: messageText,
            senderID: currentUserId,
            timestamp: new Date().toISOString()
        });

        // Atualiza o último mensagem no chat
        mockData.chats[chatId].lastMessage = {
            text: messageText,
            senderID: currentUserId,
            timestamp: new Date().toISOString()
        };

        messageInput.value = ""; // Limpa o campo de texto
        loadMessages(chatId, currentUserId); // Recarrega as mensagens
    }
}

// Adiciona o evento de clique ao botão de enviar
document.querySelector(".enviar").addEventListener("click", sendMessage);

// Permite enviar mensagem ao pressionar Enter
document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Função para destacar a conversa selecionada
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chat-item")) {
        document.querySelectorAll(".chat-item").forEach(item => item.classList.remove("active"));
        e.target.classList.add("active");
    }
});

// Simula logout
window.signOut = function () {
    window.location.href = "index.html";
};