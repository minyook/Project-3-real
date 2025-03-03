import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC2odyQB0r5loPTqmqHdnkoM-JDxdilNpk",
    authDomain: "project-9th-team3-eb188.firebaseapp.com",
    projectId: "project-9th-team3-eb188",
    storageBucket: "project-9th-team3-eb188.firebasestorage.app",
    messagingSenderId: "682296446694",
    appId: "1:682296446694:web:7dcededde4a7fa18857527",
    measurementId: "G-Z5FR7WTXTB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.login = function (e) {
    e.preventDefault();

    var email = document.getElementById('memberEmail').value.trim();
    var password = document.getElementById('memberPassword').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert('로그인에 성공했습니다.');
        window.location.href = '/';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(errorMessage);
        alert(errorMessage);
      });
}