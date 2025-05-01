import { getFirestore, collection, query, where, onSnapshot, addDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Inicializa o Firestore
const db = getFirestore();
const auth = getAuth();

// Carrega as conversas
function loadConversations(userId) {
    const chatList = document.querySelector(".chat-list");
    chatList.innerHTML = ""; // Limpa a lista de conversas

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("members", "array-contains", userId)); 
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(doc => {
            const chatData = doc.data();
            const chatItem = document.createElement("li");
            chatItem.classList.add("chat-item");
            chatItem.textContent = chatData.title || "Sem título";
            chatItem.dataset.chatId = doc.id;
            chatItem.addEventListener("click", () => loadMessages(doc.id, userId));
            chatList.appendChild(chatItem);
        });
    });
}

// Carrega as mensagens
function loadMessages(chatId, userId) {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = "<p>Carregando mensagens...</p>";

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    onSnapshot(q, (querySnapshot) => {
        messagesContainer.innerHTML = ""; // Limpa as mensagens anteriores
        querySnapshot.forEach(doc => {
            const messageData = doc.data();
            const messageElement = document.createElement("p");
            messageElement.textContent = `${messageData.senderName}: ${messageData.text}`;
            messagesContainer.appendChild(messageElement);
        });
    });
}

// Envia uma nova mensagem
const sendButton = document.querySelector(".enviar");
sendButton.addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const selectedChat = document.querySelector(".chat-item.active");

    if (messageText === "" || !selectedChat) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const chatId = selectedChat.dataset.chatId;

    addDoc(collection(db, "chats", chatId, "messages"), {
        text: messageText,
        senderID: currentUser.uid,
        senderName: currentUser.name,
        timestamp: new Date()
    });

    messageInput.value = ""; // Limpa o campo de mensagem
});

// Logout
function signOut() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html"; 
}

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        loadConversations(currentUser.uid);
    } else {
        window.location.href = "index.html";
    }
});
