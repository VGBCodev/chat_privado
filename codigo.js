import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAqAadcmcVI-hYBJjpnxdC4lxwxbZIWZks",
    authDomain: "chat-privado-60dc3.firebaseapp.com",
    databaseURL: "https://chat-privado-60dc3-default-rtdb.firebaseio.com",
    projectId: "chat-privado-60dc3",
    storageBucket: "chat-privado-60dc3.firebasestorage.app",
    messagingSenderId: "513902320586",
    appId: "1:513902320586:web:ac8d9015403360ccec0d33"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Alternar entre formulários
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignupBtn = document.getElementById("showSignupBtn");
const backToLoginBtn = document.getElementById("backToLoginBtn");

showSignupBtn.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});

backToLoginBtn.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
});

// Pré-visualização do avatar
const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");
const chooseAvatarBtn = document.getElementById("chooseAvatarBtn");

chooseAvatarBtn.addEventListener("click", () => {
    avatarUpload.click();
});

avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            avatarPreview.src = event.target.result;
            avatarPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Formulário de Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        console.log("Usuário autenticado:", user.uid);

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            localStorage.setItem("currentUser", JSON.stringify(userData));
            window.location.href = "chat.html";
        } else {
            alert("Usuário não encontrado no banco de dados.");
        }
    } catch (error) {
        console.error("Erro no login:", error.code, error.message);
        alert("Erro no login: " + error.message + " (Código: " + error.code + ")");
    }
});

// Formulário de Cadastro
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const senha = document.getElementById("signupPassword").value;
    const avatarFile = avatarUpload.files[0];

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        console.log("Usuário cadastrado:", user.uid);

        let avatarURL = "";
        if (avatarFile) {
            const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
            await uploadBytes(storageRef, avatarFile);
            avatarURL = await getDownloadURL(storageRef);
        }

        const userData = {
            email: user.email,
            uid: user.uid,
            avatar: avatarURL,
            createdAt: new Date()
        };

        await setDoc(doc(db, "usuarios", user.uid), userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        window.location.href = "chat.html";
    } catch (error) {
        console.error("Erro no cadastro:", error.code, error.message);
        alert("Erro no cadastro: " + error.message + " (Código: " + error.code + ")");
    }
});

// Login com Google
const googleBtn = document.getElementById("googleBtn");
googleBtn.addEventListener("click", async () => {
    console.log("Botão Google clicado");
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Usuário autenticado com Google:", user.uid);

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        let userData;
        if (!docSnap.exists()) {
            userData = {
                email: user.email,
                uid: user.uid,
                avatar: user.photoURL || "",
                createdAt: new Date()
            };
            await setDoc(docRef, userData);
            console.log("Novo usuário registrado no Firestore");
        } else {
            userData = docSnap.data();
            console.log("Usuário existente carregado:", userData);
        }

        localStorage.setItem("currentUser", JSON.stringify(userData));
        window.location.href = "chat.html";
    } catch (error) {
        console.error("Erro no login com Google:", error.code, error.message);
        alert("Erro no login com Google: " + error.message + " (Código: " + error.code + ")");
    }
});