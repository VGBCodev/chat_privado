// Dados simulados para usuários
let mockUsers = {
    "userID1": {
        uid: "userID1",
        email: "joao@example.com",
        name: "João",
        profileImage: "",
        conversations: { "chatID1": true, "chatID2": true }
    },
    "userID2": {
        uid: "userID2",
        email: "maria@example.com",
        name: "Maria",
        profileImage: "",
        conversations: { "chatID1": true }
    }
};

// Simula o usuário atual (para teste, usamos o usuário João por padrão)
let currentUser = mockUsers["userID1"];

// Login com email/senha (simulado)
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;

    // Simula login: verifica se o email existe nos mockUsers
    const user = Object.values(mockUsers).find(u => u.email === email);
    if (user) {
        currentUser = user;
        window.location.href = "chat.html";
    } else {
        alert("Email não encontrado. Use joao@example.com ou maria@example.com.");
    }
});

// Cadastro com email/senha (simulado)
document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const avatarFile = document.getElementById("avatarUpload").files[0];

    // Simula criação de novo usuário
    const newUserId = `userID${Object.keys(mockUsers).length + 1}`;
    let avatarURL = avatarFile ? URL.createObjectURL(avatarFile) : "";

    mockUsers[newUserId] = {
        uid: newUserId,
        email: email,
        name: email.split("@")[0],
        profileImage: avatarURL,
        conversations: {}
    };

    currentUser = mockUsers[newUserId];
    window.location.href = "chat.html";
});

// Alternar para formulário de cadastro
document.getElementById("showSignupBtn").addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
});

// Voltar para login
document.getElementById("backToLoginBtn").addEventListener("click", () => {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
});

// Obtém o botão de escolher avatar e o campo de upload de arquivo
const chooseAvatarBtn = document.getElementById("chooseAvatarBtn");
const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");

// Quando o botão de escolher avatar for clicado, exibe o campo de arquivo
chooseAvatarBtn.addEventListener("click", function () {
    avatarUpload.click();
});
