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
        displayRecipes();
    } else {
        console.error("❌ 로그인한 사용자가 없습니다.");
    }
});

// 🔹 레시피 불러오기 함수
async function displayRecipes() {
    if (!window.userId) return;

    const recipesContainer = document.querySelector(".recipes-section");
    recipesContainer.innerHTML = "<h3>나의 레시피</h3>";  // 레시피 목록을 초기화

    try {
        const response = await fetch('/getRecipe');
        const data = await response.json();

        console.log("📌 서버 응답:", data);

        if (data.success && Array.isArray(data.data)) {
            data.data.forEach((recipe) => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");

                recipeCard.innerHTML = `
                    <p name="recipeName">${recipe}</p>
                    <button class="view-recipe-btn" data-id="${recipe}">상세 보기</button>
                    <button class="delete-recipe-btn" data-id="${recipe}">삭제</button>
                `;
                recipesContainer.appendChild(recipeCard);
            });

            // 🔹 상세 보기 버튼 이벤트 추가
            document.querySelectorAll(".view-recipe-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const recipeId = this.getAttribute("data-id");
                    showRecipeDetail(recipeId);
                });
            });

            // 🔹 삭제 버튼 이벤트 추가
            document.querySelectorAll(".delete-recipe-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const recipeId = this.getAttribute("data-id");
                    deleteRecipe(recipeId);
                });
            });

        } else {
            console.error("🚨 올바른 데이터가 아닙니다:", data);
        }
    } catch (error) {
        console.error("❌ 레시피 불러오기 실패:", error);
    }
}

// 🔹 레시피 추가 후, 자동으로 갱신하는 방법
window.addEventListener("load", function () {
    if (window.userId) {
        displayRecipes();  // 페이지 로드 시 레시피 목록을 불러옵니다.
    }
});

// 🔹 서버에서 새로 추가된 레시피 반영
document.getElementById("save-recipe").addEventListener("click", function () {
    // 레시피 추가가 완료된 후, 마이페이지로 리디렉션
    setTimeout(function () {
        displayRecipes();  // 레시피 추가 후 페이지 갱신
    }, 1000);  // 새 레시피 저장 후 1초 뒤에 갱신
});

// 🔹 레시피 삭제
async function deleteRecipe(recipeId) {
    try {
        await fetch(`/deleteRecipe/${recipeId}`, { method: 'DELETE' });
        console.log("🗑️ 레시피 삭제 완료:", recipeId);
        displayRecipes(); // 삭제 후 리스트 다시 불러오기
    } catch (error) {
        console.error("❌ 레시피 삭제 실패:", error);
    }
}

// 🔹 레시피 상세 보기
function showRecipeDetail(recipeId) {
    const recipeDetailWindow = window.open(
        "",
        "레시피 상세보기",
        "width=900,height=700"
    );

    recipeDetailWindow.document.write(`
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>레시피 상세보기</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h2 {
            text-align: center;
          }
          .step {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          ol {
            counter-reset: step-counter;
            list-style: none;
            padding-left: 0;
          }
          ol li {
            counter-increment: step-counter;
            margin-bottom: 15px;
          }
          ol li::before {
            content: counter(step-counter) ".   ";
            font-weight: bold;
            color: #000;
          }
        </style>
      </head>
      <body>
        <h2 name="recipeName"></h2>
        <h3>요리 순서</h3>
        <div id="content" class="mt-2 max-h-[60vh] overflow-y-auto p-2 text-gray-700"></div>
      </body>
    </html>
  `);

    fetch(`/showRecipeDetail/${recipeId}`, { method: 'GET' })
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data; // 데이터 객체 추출
            console.log('Received data:', data);

            const recipeTitle = recipeDetailWindow.document.querySelector('[name="recipeName"]');
            if (recipeTitle) recipeTitle.innerText = data.title || recipeId;

            const stepsContainer = recipeDetailWindow.document.querySelector('#content');

            if (stepsContainer) {
                const li = recipeDetailWindow.document.createElement('li');
                li.classList.add('step');
                li.textContent = data.content;
                stepsContainer.appendChild(li);
            } else {
                console.error('stepsContainer not found!');
                const li = recipeDetailWindow.document.createElement('div');
                li.textContent = "이 레시피에는 요리 단계가 없습니다.";
                stepsContainer.appendChild(li);
                return;
            }
        })
        .catch(error => {
            console.error("❌ 레시피 상세 보기 오류:", error);
        });

}

// 🔹 Firestore에서 냉장고 재료 불러오기
async function loadSavedIngredients() {
    if (!window.userId) {
        console.error("🚨 사용자 ID가 없습니다. 인증 문제일 수 있습니다.");
        return;
    }

    const ingredientsContainer = document.getElementById("savedIngredientsContainer");
    const noIngredientsMessage = document.getElementById("noIngredientsMessage");

    try {
        console.log("🔎 Firestore에서 재료 불러오는 중...");
        const querySnapshot = await getDocs(collection(db, `users/${window.userId}/ingredients`));

        console.log("📃 Firestore에서 가져온 문서 개수:", querySnapshot.size);

        ingredientsContainer.innerHTML = "";

        if (querySnapshot.empty) {
            console.warn("⚠️ Firestore에 저장된 재료가 없습니다.");
            if (noIngredientsMessage) noIngredientsMessage.style.display = "block";
            return;
        }

        if (noIngredientsMessage) noIngredientsMessage.style.display = "none";

        querySnapshot.forEach((docSnapshot) => {
            const ingredientData = docSnapshot.data();
            console.log("🥕 불러온 재료:", ingredientData);

            const ingredientCard = document.createElement("div");
            ingredientCard.classList.add("recipe-card");
            ingredientCard.innerHTML = `
                <p>${ingredientData.name || "이름 없음"}</p>
                <button class="delete-recipe-btn" data-id="${docSnapshot.id}">삭제</button>
            `;
            ingredientsContainer.appendChild(ingredientCard);
        });

        document.querySelectorAll(".delete-ingredient-btn").forEach((button) => {
            button.addEventListener("click", function () {
                deleteIngredient(this.getAttribute("data-id"));
            });
        });
    } catch (error) {
        console.error("❌ 재료 불러오기 실패:", error);
    }
}
// 🔹 Firestore에서 재료 삭제
async function deleteIngredient(ingredientId) {
    if (!window.userId) {
        console.error("🚨 사용자 ID가 없습니다.");
        return;
    }

    try {
        console.log(`🗑️ Firestore에서 재료 삭제 중... ID: ${ingredientId}`);

        await deleteDoc(doc(db, `users/${window.userId}/ingredients`, ingredientId));

        console.log("✅ 재료 삭제 완료:", ingredientId);

        // 삭제 후 목록 다시 불러오기
        loadSavedIngredients();
    } catch (error) {
        console.error("❌ 재료 삭제 실패:", error);
    }
}

// 🔹 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    if (window.userId) {
        loadSavedIngredients();
        displayRecipes();
    }
});
