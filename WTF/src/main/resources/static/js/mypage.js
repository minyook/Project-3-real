document.addEventListener("DOMContentLoaded", function () {
    // 🔹 프로필 편집 팝업 기능
    const popup = document.getElementById("profile-popup");
    const overlay = document.getElementById("popup-overlay");
    const editProfileBtn = document.querySelector(".edit-profile-btn");
    const closePopup = document.getElementById("close-popup");

    // 팝업 열기
    editProfileBtn.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 링크 동작 방지
        popup.style.display = "block";
        overlay.style.display = "block";
    });

    // 팝업 닫기
    closePopup.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    // 오버레이 클릭 시 팝업 닫기
    overlay.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    // 🔹 저장된 레시피 불러오기 및 삭제 기능 추가
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipesContainer = document.querySelector(".recipes-section");

    // 기존 "나의 레시피" 제목 유지
    recipesContainer.innerHTML = "<h3>나의 레시피</h3>";

    function displayRecipes() {
        // 레시피 목록 초기화 후 다시 그리기
        recipesContainer.innerHTML = "<h3>나의 레시피</h3>";

        recipes.forEach((recipe, index) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="레시피 이미지">
      <p>${recipe.title}</p>
      <button class="view-recipe-btn" data-index="${index}">상세 보기</button>
      <button class="delete-recipe-btn" data-index="${index}">삭제</button>
    `;
            recipesContainer.appendChild(recipeCard);
        });

        // 모든 삭제 버튼에 이벤트 추가
        document.querySelectorAll(".delete-recipe-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteRecipe(index);
            });
        });

        // 모든 상세 보기 버튼에 이벤트 추가
        document.querySelectorAll(".view-recipe-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                showRecipeDetail(index);
            });
        });
    }

    // 🔹 레시피 삭제 함수
    function deleteRecipe(index) {
        recipes.splice(index, 1); // 배열에서 해당 인덱스의 레시피 제거
        localStorage.setItem("recipes", JSON.stringify(recipes)); // localStorage 업데이트
        displayRecipes(); // 화면 갱신
    }

    // 🔹 레시피 상세보기 함수
    function showRecipeDetail(index) {
        const recipe = recipes[index];

        // 새 창에서 레시피 상세 정보를 표시
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
        <title>${recipe.title}</title>
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
          .step img {
            max-width: 200px;
            margin-left: 20px;
          }
          .step-text {
            flex: 1;
            text-align: left;
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
        <h2>${recipe.title}</h2>
        <img src="${
            recipe.image
        }" alt="${recipe.title}" style="max-width: 50%; height: auto;" />
        <h3>요리 순서</h3>
        <ol>
        ${recipe.steps
            .map(
                (step) => `
              <li class="step">
                <div class="step-text">${step.text}</div>
                ${step.img ? `<img src="${step.img}" alt="step image" />` : ""}
              </li>`
            )
            .join("")}
        
        </ol>
      </body>
    </html>
  `);
    }

    // 페이지 로드 시 레시피 표시
    displayRecipes();
});
