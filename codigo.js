// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Obter os serviços do Firebase
const auth = getAuth(app);
const db = getFirestore(app);

// Habilitar persistência offline do Firestore
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log("Falha na persistência offline: mais de uma aba do navegador aberta.");
    } else if (err.code === 'unimplemented') {
      console.log("Persistência offline não suportada no navegador.");
    }
  });

// FORMULÁRIO DE LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  try {
    // Realiza o login
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Obter dados do usuário no Firestore
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
    console.error("Erro no login:", error);
    alert("Erro no login: " + error.message);
  }
});
