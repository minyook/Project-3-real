import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// 🔹 Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyC2odyQB0r5loPTqmqHdnkoM-JDxdilNpk",
    authDomain: "project-9th-team3-eb188.firebaseapp.com",
    projectId: "project-9th-team3-eb188",
    storageBucket: "project-9th-team3-eb188.firebasestorage.app",
    messagingSenderId: "682296446694",
    appId: "1:682296446694:web:7dcededde4a7fa18857527",
    measurementId: "G-Z5FR7WTXTB"
};

// 🔹 Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// 🔹 로그인 상태 체크
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ✅ 로그인 상태
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("mypageBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
        document.getElementById("list1").onclick = function() {location.href = '#';};
        document.getElementById("list2").onclick = function() {location.href = 'recipe';};
        document.getElementById("list3").onclick = function() {location.href = 'like';};
    } else {
        // ❌ 로그아웃 상태
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("signupBtn").style.display = "block";
        document.getElementById("mypageBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("list1").onclick = function() {alert("로그인 후 이용하세요.");};
        document.getElementById("list2").onclick = function() {alert("로그인 후 이용하세요.");};
        document.getElementById("list3").onclick = function() {alert("로그인 후 이용하세요.");};
    }
});

// 🔹 로그아웃 기능
window.logout = function (e) {
    auth.signOut().then(() => {
        alert("로그아웃되었습니다.");
        location.reload(); // 페이지 새로고침
    }).catch((error) => {
        console.error("로그아웃 오류:", error);
    });
}
