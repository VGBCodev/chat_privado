// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAqAadcmcVI-hYBJjpnxdC4lxwxbZIWZks",
    authDomain: "chat-privado-60dc3.firebaseapp.com",
    databaseURL: "https://chat-privado-60dc3-default-rtdb.firebaseio.com",
    projectId: "chat-privado-60dc3",
    storageBucket: "chat-privado-60dc3.appspot.com",
    messagingSenderId: "513902320586",
    appId: "1:513902320586:web:ac8d9015403360ccec0d33"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obter o Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Função para carregar mensagens em tempo real de um chat
function loadMessages(chatId, currentUserId) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = ""; // Limpa as mensagens atuais

    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp"));

    // Escuta as mensagens em tempo real
    onSnapshot(messagesQuery, (querySnapshot) => {
        querySnapshot.forEach(doc => {
            const messageData = doc.data();
            const messageElement = document.createElement("p");
            const senderName = messageData.senderID === currentUserId ? "Você" : messageData.senderName || "Desconhecido";
            messageElement.classList.add("message", messageData.senderID === currentUserId ? "sent" : "received");
            messageElement.innerHTML = `<strong>${senderName}:</strong> ${messageData.text}`;
            messagesDiv.appendChild(messageElement);
        });

        // Mantém o scroll na parte inferior
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Função para enviar uma nova mensagem para o Firestore
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const selectedChat = document.querySelector(".chat-item.active");

    if (messageText && selectedChat) {
        const chatId = selectedChat.dataset.chatId;
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
        // Adiciona a nova mensagem ao Firestore
        addDoc(collection(db, "chats", chatId, "messages"), {
            text: messageText,
            senderID: currentUser.uid,
            senderName: currentUser.name,
            timestamp: new Date()
        });

        // Limpa o campo de texto
        messageInput.value = "";
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

// Função para carregar conversas do usuário (exemplo simples de seleção de chat)
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
