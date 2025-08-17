// Firebase SDK
const firebaseConfig = {
  apiKey: "AIzaSyC19E3MVbm6CLw3YwQS8qmbxxwXqho6BmQ",
  authDomain: "controle-financeiro-4de81.firebaseapp.com",
  projectId: "controle-financeiro-4de81",
  storageBucket: "controle-financeiro-4de81.appspot.com",
  messagingSenderId: "760886734865",
  appId: "1:760886734865:web:e9f9bcc410d1e1647581b0"
};

firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');

  if (!form) {
    console.error('Elemento #loginForm não encontrado.');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch((error) => {
        alert('Login inválido. Verifique e-mail e senha.');
      });
  });
});