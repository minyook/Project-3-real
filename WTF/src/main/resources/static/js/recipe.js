import { collection, getDocs, doc, deleteDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// 🔹 Firebase 초기화
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
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 로그인한 사용자의 UID 가져오기
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.userId = user.uid;
        console.log("✅ 로그인한 사용자 UID:", window.userId);
        loadSavedIngredients();
    } else {
        console.error("❌ 로그인한 사용자가 없습니다.");
    }
});

// 🔹 Firestore에서 냉장고 재료 불러오기
async function loadSavedIngredients() {
    if (!window.userId) {
        console.error("🚨 사용자 ID가 없습니다. 인증 문제일 수 있습니다.");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, `users/${window.userId}/ingredients`));

        if (querySnapshot.empty) {
            console.warn("⚠️ Firestore에 저장된 재료가 없습니다.");
            if (noIngredientsMessage) noIngredientsMessage.style.display = "block";
            return;
        }

        if (noIngredientsMessage) noIngredientsMessage.style.display = "none";

        querySnapshot.forEach((docSnapshot) => {
            const ingredientData = docSnapshot.data();
            console.log("🥕 불러온 재료:", ingredientData);

            const fridgeItems = document.getElementById('fridgeItems');

            const li = document.createElement('li');
            li.classList.add('p-2', 'bg-gray-100', 'rounded-md');
            li.textContent = ingredientData.name;

            fridgeItems.appendChild(li);
        });
    } catch (error) {
        console.error("❌ 재료 불러오기 실패:", error);
    }
}