async function getRecipes() {
    let input = document.getElementById("ingredientInput").value.trim();
    let outputDiv = document.getElementById("recipeResults");

    if (input === "") {
        outputDiv.innerHTML = "<p class='text-red-500'>❗ 재료를 입력하세요.</p>";
        return;
    }

    outputDiv.innerHTML = "<p class='text-gray-500'>🔍 레시피 검색 중...</p>";

    try {
        let recipeText = await fetchRecipesFromGemini(input);

        // Markdown 형식을 HTML로 변환하여 표시
        outputDiv.innerHTML = markdownToHtml(recipeText);

    } catch (error) {
        outputDiv.innerHTML = "<p class='text-red-500'>⚠️ 오류가 발생했습니다. 다시 시도해주세요.</p>";
    }
}

// 🔹 **Markdown을 HTML로 변환하는 함수**
function markdownToHtml(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **굵은 글씨** → <strong>변환
        .replace(/\n\* (.*?)/g, "<li>$1</li>") // 리스트 항목 변환
        .replace(/\n/g, "<br>") // 줄바꿈을 <br> 태그로 변환
        .replace(/<li>/, "<ul><li>") // 첫 번째 리스트 시작
        .replace(/<\/li>\n/g, "</li>") // 리스트 유지
        .replace(/<\/li><br>/g, "</li>") // 불필요한 줄바꿈 제거
        .replace(/<\/li>$/, "</li></ul>"); // 리스트 닫기
}

// 🔹 **Gemini API 호출**
async function fetchRecipesFromGemini(ingredients) {
    const apiKey = "google api key";  // 🔥 Google AI Studio에서 발급한 API 키 입력

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
        console.log(data);

        if (data.candidates) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "❌ 레시피를 찾을 수 없습니다.";
        }
    } catch (error) {
        console.error("Gemini API 호출 오류:", error);
        return "⚠️ API 호출 실패!";
    }
}
