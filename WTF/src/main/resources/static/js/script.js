// Firestore SDK 가져오기
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const saveButton = document.getElementById("saveRecipeBtn");

    searchButton.addEventListener("click", getRecipes);
    saveButton.addEventListener("click", saveRecipe);
});

// 🔹 **레시피 검색 기능**
async function getRecipes() {
    let input = document.getElementById("ingredientInput").value.trim();
    let outputDiv = document.getElementById("recipeContent");
    let saveButton = document.getElementById("saveRecipeBtn");

    if (input === "") {
        outputDiv.innerHTML = "<p class='text-red-500 text-center'>❗ 재료를 입력하세요.</p>";
        disableSaveButton();
        return;
    }

    outputDiv.innerHTML = "<p class='text-gray-500 text-center'>🔍 레시피 검색 중...</p>";

    try {
        let recipeText = await fetchRecipesFromGemini(input);

        outputDiv.innerHTML = markdownToHtml(recipeText);
        enableSaveButton();

    } catch (error) {
        console.error("AI 응답 오류:", error);
        outputDiv.innerHTML = "<p class='text-red-500 text-center'>⚠️ 오류가 발생했습니다. 다시 시도해주세요.</p>";
        disableSaveButton();
    }
}

// 🔹 **저장 버튼 활성화**
function enableSaveButton() {
    let saveButton = document.getElementById("saveRecipeBtn");
    saveButton.removeAttribute("disabled");
    saveButton.classList.remove("bg-gray-400");
    saveButton.classList.add("bg-red-600", "hover:bg-red-700");
}

// 🔹 **저장 버튼 비활성화**
function disableSaveButton() {
    let saveButton = document.getElementById("saveRecipeBtn");
    saveButton.setAttribute("disabled", true);
    saveButton.classList.add("bg-gray-400");
    saveButton.classList.remove("bg-red-600", "hover:bg-red-700");
}

// 🔹 **Markdown을 HTML로 변환하는 함수**
function markdownToHtml(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **굵은 글씨** → <strong> 변환
        .replace(/\n\* (.*?)/g, "<li>$1</li>") // 리스트 항목 변환
        .replace(/\n/g, "<br>") // 줄바꿈을 <br> 태그로 변환
        .replace(/<li>/, "<ul><li>") // 첫 번째 리스트 시작
        .replace(/<\/li>\n/g, "</li>") // 리스트 유지
        .replace(/<\/li><br>/g, "</li>") // 불필요한 줄바꿈 제거
        .replace(/<\/li>$/, "</li></ul>"); // 리스트 닫기
}

// 🔹 **Gemini API 호출**
async function fetchRecipesFromGemini(ingredients) {
    const apiKey = "api key";  // ❗ 여기에 API 키 직접 넣지 않도록 주의

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            { role: "user", parts: [{ text: `다음 재료로 만들 수 있는 요리를 추천해줘: ${ingredients}` }] }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log("Gemini API 응답:", data);

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "❌ 레시피를 찾을 수 없습니다.";
        }
    } catch (error) {
        console.error("Gemini API 호출 오류:", error);
        return "⚠️ API 호출 실패!";
    }
}

// 🔹 **레시피 Firestore에 저장**
async function saveRecipe() {
    let recipeText = document.getElementById("recipeContent").innerText;

    if (recipeText.trim() === "AI가 추천할 레시피가 여기에 표시됩니다.") {
        alert("저장할 레시피가 없습니다.");
        return;
    }

    try {
        // Firestore "recipes" 컬렉션에 새 레시피 저장
        await addDoc(collection(window.db, "recipes"), {
            content: recipeText,
            timestamp: new Date()
        });

        alert("레시피가 Firestore에 저장되었습니다! ❤️");
        window.location.href = "like"; // 저장 후 이동
    } catch (error) {
        console.error("레시피 저장 중 오류 발생:", error);
        alert("레시피 저장에 실패했습니다.");
    }
}
