// ✅ Firebase SDK 초기화 (필요한 경우 추가)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// 🔹 Firebase 설정 (자신의 Firebase 설정으로 변경)
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
const auth = getAuth(app);

// ✅ Firebase UID 가져오기 및 저장
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 [DOMContentLoaded] 페이지 로드됨");

    // 🔹 기존 저장된 UID 불러오기
    let storedUserId = localStorage.getItem("uid") || null;
    console.log("📌 [DOMContentLoaded] 기존 저장된 userId:", storedUserId);

    onAuthStateChanged(auth, (user) => {
        let userId = user ? user.uid : storedUserId;

        if (!userId) {
            console.error("❌ [onAuthStateChanged] userId가 없음! 기본값 'guest' 사용");
            userId = "guest"; // 기본값 설정
        }

        console.log("👤 [onAuthStateChanged] 현재 로그인한 사용자 ID:", userId);

        // ✅ localStorage에 userId 저장
        localStorage.setItem("uid", userId);

        // ✅ userId가 설정된 후 재료 로드
        loadIngredients(userId);

        // ✅ 이벤트 리스너도 userId 설정 후 등록
        setupEventListeners(userId);
    });
});


// ✅ 이벤트 리스너 설정 함수 (userId가 설정된 후 실행)
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

// ✅ 재료 추가 함수
function addIngredient(userId) {
    const input = document.getElementById("ingredient-input");
    if (!input) return;

    const ingredientName = input.value.trim();
    if (!ingredientName) return;

    let ingredients = getIngredients(userId);

    // 중복 확인 후 추가
    if (!ingredients.includes(ingredientName)) {
        ingredients.push(ingredientName);
        saveIngredients(userId, ingredients);
    }

    renderIngredients(userId);
    input.value = "";
}
// ✅ addIngredient 함수를 전역 범위에 등록
window.addIngredient = addIngredient;
// ✅ 재료 목록 렌더링
function renderIngredients(userId) {
    const fridge = document.getElementById("fridge");
    if (!fridge) {
        console.error("❌ 냉장고 컨테이너(fridge)를 찾을 수 없습니다.");
        return;
    }

    console.log(`🔎 renderIngredients(${userId}) 실행됨!`);

    fridge.innerHTML = ""; // 기존 내용 초기화

    const ingredients = getIngredients(userId);
    console.log(`📌 ${userId}의 재료 목록:`, ingredients);

    ingredients.forEach((ingredient) => {
        const ingredientDiv = document.createElement("div");
        ingredientDiv.className = "recipe-card";
        ingredientDiv.innerHTML = `
          <p>${ingredient}</p>
          <button class="delete-ingredient-btn">삭제</button>
      `;

        // 삭제 버튼 이벤트 추가
        ingredientDiv
            .querySelector(".delete-ingredient-btn")
            .addEventListener("click", () => removeIngredient(userId, ingredient));

        fridge.appendChild(ingredientDiv);
    });

    console.log("✅ 최종 fridge.innerHTML:", fridge.innerHTML);
}

// ✅ 재료 삭제 함수
function removeIngredient(userId, ingredientName) {
    let ingredients = getIngredients(userId).filter((ing) => ing !== ingredientName);
    saveIngredients(userId, ingredients);
    renderIngredients(userId);
}

// ✅ 저장된 재료 불러오기
function loadIngredients(userId) {
    console.log(`🔥 loadIngredients(${userId}) 실행됨!`);
    let ingredients = getIngredients(userId);
    console.log(`📌 ${userId}의 불러온 재료 목록:`, ingredients);

    if (ingredients.length === 0) {
        console.warn("⚠️ 저장된 재료가 없습니다!");
    }

    renderIngredients(userId);
}

// ✅ localStorage에서 사용자별 재료 목록 가져오기
function getIngredients(userId) {
    let data = localStorage.getItem(`ingredients_${userId}`);
    console.log(`🔍 localStorage에서 ${userId}의 데이터 가져옴:`, data);
    try {
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
        return [];
    }
}

// ✅ localStorage에 사용자별 재료 저장
function saveIngredients(userId, ingredients) {
    localStorage.setItem(`ingredients_${userId}`, JSON.stringify(ingredients));
}
