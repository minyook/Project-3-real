// ✅ Firebase SDK 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// 🔹 Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyC2odyQB0r5loPTqmqHdnkoM-JDxdilNpk",
    authDomain: "project-9th-team3-eb188.firebaseapp.com",
    projectId: "project-9th-team3-eb188",
    storageBucket: "project-9th-team3-eb188.firebasestorage.app",
    messagingSenderId: "682296446694",
    appId: "1:682296446694:web:7dcededde4a7fa18857527",
    measurementId: "G-Z5FR7WTXTB",
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Firebase UID 가져오기 및 저장
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 [DOMContentLoaded] 페이지 로드됨");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.error("❌ [onAuthStateChanged] 로그인된 사용자가 없습니다.");
            return;
        }

        const userId = user.uid;
        console.log("👤 [onAuthStateChanged] 현재 로그인한 사용자 ID:", userId);

        // ✅ Firestore에서 재료 불러오기
        await loadIngredients(userId);

        // ✅ 이벤트 리스너 등록
        setupEventListeners(userId);
    });
});

// ✅ 이벤트 리스너 설정 함수 (UID 설정 후 실행)
function setupEventListeners(userId) {
    const ingredientInput = document.getElementById("ingredient-input");
    const addIngredientBtn = document.getElementById("add-ingredient-btn");

    if (!ingredientInput || !addIngredientBtn) {
        console.error("❌ 입력 필드 또는 버튼을 찾을 수 없습니다.");
        return;
    }

    ingredientInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("⏎ Enter 입력 감지됨!");
            addIngredient(userId);
        }
    });

    addIngredientBtn.addEventListener("click", () => addIngredient(userId));
}

// ✅ 재료 추가 함수 (서버와 통신)
async function addIngredient(userId) {
    const input = document.getElementById("ingredient-input");
    if (!input) return;

    const ingredientName = input.value.trim();
    if (!ingredientName) return;

    // Firestore에 저장하기 전에 중복 재료 확인
    try {

        const ingredientsRef = collection(db, `users/${userId}/ingredients`);
        const q = query(ingredientsRef, where("name", "==", ingredientName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert(`⚠️  이미 존재하는 재료입니다.`);
            return;
        }

        const response = await fetch('/createIngredient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredientName, uid: userId })
        });

        if (response.ok) {
            console.log(`✅ 서버에 '${ingredientName}' 추가 완료!`);
            await loadIngredients(userId); // 새로 추가된 재료를 불러와서 갱신
        } else {
            const errorData = await response.text();
            console.error(`❌ 서버에 재료 추가 실패: ${response.statusText} - ${errorData}`);
        }
    } catch (error) {
        console.error("❌ 서버에 재료 추가 실패:", error);
    }

    input.value = "";
}



// ✅ Firestore에서 사용자별 재료 불러오기
async function loadIngredients(userId) {
    console.log(`🔥 loadIngredients(${userId}) 실행됨!`);

    try {
        const ingredientsRef = collection(db, `users/${userId}/ingredients`);
        const q = query(ingredientsRef);
        const querySnapshot = await getDocs(q);

        const ingredients = [];
        querySnapshot.forEach((doc) => {
            ingredients.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`📌 Firestore에서 불러온 재료 목록:`, ingredients);
        renderIngredients(userId, ingredients);
    } catch (error) {
        console.error("❌ Firestore에서 재료 불러오기 실패:", error);
    }
}

// ✅ 재료 목록 렌더링
function renderIngredients(userId, ingredients = []) {
    const fridge = document.getElementById("fridge");
    if (!fridge) {
        console.error("❌ 냉장고 컨테이너(fridge)를 찾을 수 없습니다.");
        return;
    }

    console.log(`🔎 renderIngredients(${userId}) 실행됨!`);

    fridge.innerHTML = ""; // 기존 내용 초기화

    ingredients.forEach((ingredient) => {
        const ingredientDiv = document.createElement("div");
        ingredientDiv.className = "recipe-card";
        ingredientDiv.innerHTML = `
          <p>${ingredient.name}</p>
          <button class="delete-ingredient-btn" data-id="${ingredient.id}">삭제</button>
      `;

        // 삭제 버튼 이벤트 추가
        ingredientDiv
            .querySelector(".delete-ingredient-btn")
            .addEventListener("click", () => removeIngredient(userId, ingredient.id));

        fridge.appendChild(ingredientDiv);
    });

    console.log("✅ 최종 fridge.innerHTML:", fridge.innerHTML);
}

// ✅ 재료 삭제 함수 (Firestore에서 삭제)
async function removeIngredient(userId, ingredientId) {
    try {
        const ingredientRef = doc(db, `users/${userId}/ingredients`, ingredientId);

        // Firestore에서 해당 재료 삭제
        await deleteDoc(ingredientRef);

        console.log(`❌ Firestore에서 재료 삭제 완료!`);
        await loadIngredients(userId); // 삭제 후 재료 불러와서 갱신
    } catch (error) {
        console.error("❌ Firestore에서 재료 삭제 실패:", error);
    }
}
