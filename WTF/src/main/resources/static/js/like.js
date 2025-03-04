import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const GEMINI_API_KEY = "api key"; // 🔥 API 키 보안 유지
let showOnlyLiked = false; // 🔥 현재 필터 상태 (찜한 목록만 보기 여부)

// 🔹 Firestore에서 레시피 불러오기
async function loadSavedRecipes() {
    const recipesContainer = document.getElementById("savedRecipesContainer");
    const noRecipesMessage = document.getElementById("noRecipesMessage");

    if (!recipesContainer) {
        console.error("❌ 'savedRecipesContainer' 요소를 찾을 수 없습니다.");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(window.db, "recipes"));

        recipesContainer.innerHTML = ""; // 기존 내용 초기화

        if (querySnapshot.empty) {
            if (noRecipesMessage) noRecipesMessage.style.display = "block"; // 오류 방지
            return;
        }

        if (noRecipesMessage) noRecipesMessage.style.display = "none"; // 저장된 레시피가 있으면 숨김

        querySnapshot.forEach(async (docSnapshot) => {
            const recipeData = docSnapshot.data();
            let menuTitle = recipeData.title || "레시피"; // Firestore에 제목이 없으면 기본값 설정
            const recipeContent = recipeData.content;
            const isLiked = recipeData.liked || false;

            // 🔹 "찜한 목록만 보기" 필터링 적용
            if (showOnlyLiked && !isLiked) return;

            // 🔹 Firestore에 저장된 제목이 없으면 AI를 이용해 자동 추출
            if (!recipeData.title) {
                menuTitle = await extractRecipeTitleAI(recipeContent);
                await updateDoc(doc(window.db, "recipes", docSnapshot.id), { title: menuTitle });
            }

            // 🔹 레시피 카드 생성
            const recipeCard = document.createElement("div");
            recipeCard.className = "like-item";

            recipeCard.innerHTML = `
                <i class="fa fa-heart heart-icon ${isLiked ? 'active' : ''}" onclick="toggleLike('${docSnapshot.id}', this)">♥</i>
                <h3 class="recipe-title">${menuTitle}</h3>
                <button class="recipe-button" onclick="showPopup('${menuTitle}', \`${recipeContent}\`)">
                    자세히 보기
                </button>
            `;

            recipesContainer.appendChild(recipeCard);
        });
    } catch (error) {
        console.error("❌ 레시피 불러오기 실패:", error);
    }
}

// 🔹 Gemini AI를 이용한 요리 제목 자동 추출
async function extractRecipeTitleAI(content) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [
            { role: "user", parts: [{ text: `다음 레시피에서 요리 이름(예: 김치찌개, 된장찌개, 파스타 등)만 추출해줘. 단어 하나로만 알려줘: ${content}` }] }
        ]
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기 후 요청 (429 방지)
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Gemini API 응답:", data);

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            return "레시피";
        }
    } catch (error) {
        console.error("❌ AI 요리명 추출 오류:", error);
        return "레시피";
    }
}

// 🔹 "찜한 목록만 보기" 버튼 클릭 시 실행되는 함수
window.toggleLikedItems = function () {
    showOnlyLiked = !showOnlyLiked; // 필터 상태 변경
    document.getElementById("toggleLikedRecipes").innerText = showOnlyLiked ? "전체 목록 보기" : "찜한 목록만 보기";
    loadSavedRecipes();
};

// 🔹 찜 버튼 클릭 시 Firestore 업데이트 (찜 / 취소)
window.toggleLike = async function (docId, heartIcon) {
    const recipeRef = doc(window.db, "recipes", docId);
    const isLiked = heartIcon.classList.contains("active");

    try {
        await updateDoc(recipeRef, { liked: !isLiked });
        heartIcon.classList.toggle("active");
    } catch (error) {
        console.error("❌ 찜 상태 업데이트 실패:", error);
    }
};

// 🔹 팝업 창 열기
window.showPopup = function (title, content) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupContent").innerHTML = `<p>${content.replace(/\n/g, "<br>")}</p>`;
    document.getElementById("recipePopup").classList.remove("hidden");
};

// 🔹 팝업 닫기
window.closePopup = function () {
    document.getElementById("recipePopup").classList.add("hidden");
};

// 🔹 페이지 로드 시 레시피 불러오기
document.addEventListener("DOMContentLoaded", () => {
    loadSavedRecipes();
});
