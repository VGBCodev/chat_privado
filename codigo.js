// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const storage = getStorage(app);

// FORMULÁRIO DE LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

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
    alert("Erro no login: " + error.message);
  }
});

// FORMULÁRIO DE CADASTRO
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const senha = document.getElementById("signupPassword").value;
  const avatarFile = document.getElementById("avatarUpload").files[0];

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    let avatarURL = "";
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
      const snapshot = await uploadBytes(storageRef, avatarFile);
      avatarURL = await getDownloadURL(snapshot.ref);
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.email.split("@")[0],
      profileImage: avatarURL,
      conversations: {}
    };

    await setDoc(doc(db, "usuarios", user.uid), userData);

    localStorage.setItem("currentUser", JSON.stringify(userData));
    window.location.href = "chat.html";
  } catch (error) {
    alert("Erro no cadastro: " + error.message);
  }
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

// Avatar preview
const chooseAvatarBtn = document.getElementById("chooseAvatarBtn");
const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");

chooseAvatarBtn.addEventListener("click", () => {
  avatarUpload.click();
});

avatarUpload.addEventListener("change", () => {
  const file = avatarUpload.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
    avatarPreview.style.display = "block";
  }
});
