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
//    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipesContainer = document.querySelector(".recipes-section");

    // 기존 "나의 레시피" 제목 유지
    recipesContainer.innerHTML = "<h3>나의 레시피</h3>";

    function displayRecipes() {
        // 레시피 목록 초기화 후 다시 그리기
        recipesContainer.innerHTML = "<h3>나의 레시피</h3>";

        fetch(`/getRecipe`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(recipes => {
            if (recipes.length > 0) {
                recipes.forEach((recipe) => {
                    const recipeCard = document.createElement("div");
                    recipeCard.classList.add("recipe-card");

                    recipeCard.innerHTML = `
                      <p name="recipeName">${recipe}</p>
                      <button class="view-recipe-btn" data-comments="${recipe}">상세 보기</button>
                      <button class="delete-recipe-btn" data-comments="${recipe}">삭제</button>
                    `;
                    recipesContainer.appendChild(recipeCard);
                });
            }

            // 모든 삭제 버튼에 이벤트 추가
            document.querySelectorAll(".delete-recipe-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const data = this.getAttribute("data-comments");
                    deleteRecipe(data);
                });
            });

            // 모든 상세 보기 버튼에 이벤트 추가
            document.querySelectorAll(".view-recipe-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const data = this.getAttribute("data-comments");
                    showRecipeDetail(data);
                });
            });
        })
        .catch(error => {
            console.error("Error fetching recipe data:", error);
        });
    }

    // 🔹 레시피 삭제 함수
    function deleteRecipe(data) {
        fetch(`/deleteRecipe/${data}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(deletedRecipe => {
            console.log(`삭제된 레시피명: ${deletedRecipe}`);
        })
        .catch(error => console.error("삭제 중 오류 발생:", error));

        window.location.href = "mypage"
    }


    // 🔹 레시피 상세보기 함수
    function showRecipeDetail(data) {
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
            <title name="recipeName"></title>
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
            <h2 name="recipeName"></h2>
            <h3>요리 순서</h3>
            <ol id="recipe-steps"></ol>
          </body>
        </html>
      `);

        fetch(`/showRecipeDetail/${data}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setTimeout(() => {
                const recipeTitle = recipeDetailWindow.document.querySelector('[name="recipeName"]');

                const stepsContainer = recipeDetailWindow.document.querySelector('#recipe-steps');
                if (!stepsContainer) {
                    console.error('stepsContainer not found!');
                    return;
                }

                let stepIndex = 1;
                while (data[`step${stepIndex}`] !== undefined) {
                    const stepKey = `step${stepIndex}`;
                    const li = recipeDetailWindow.document.createElement('li');
                    li.classList.add('step');
                    li.textContent = data[stepKey];

                    stepsContainer.appendChild(li);
                    stepIndex++;
                }
            }, 10);
        })
        .catch(error => {
            console.error(error);
        });
    }

    // 페이지 로드 시 레시피 표시
    displayRecipes();
});
