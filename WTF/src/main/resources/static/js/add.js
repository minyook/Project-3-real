// 파일명: addRecipe.js

document.addEventListener("DOMContentLoaded", function () {
    // 🔹 순서 추가 버튼 클릭 시, 새로운 요리 단계 추가
    document.querySelector(".add-step").addEventListener("click", function () {
        const stepsContainer = document.getElementById("recipe-steps");
        const stepCount = stepsContainer.children.length + 1; // 현재 추가된 Step 수에 따라 번호 지정
        const newStep = document.createElement("div");
        newStep.classList.add("recipe-step");

        newStep.innerHTML = `
            <h4>Step ${stepCount}</h4>
            <div class="step-container">
                <textarea name="step" placeholder="예) 새로운 단계 추가 설명"></textarea>
            </div>
        `;
        stepsContainer.appendChild(newStep);
    });

    // 🔹 레시피 저장 버튼 클릭 시
    document.getElementById("recipe-form").addEventListener("submit", function (event) {
        event.preventDefault();  // 폼 제출 기본 동작을 막음

        const formData = new FormData(event.target);
        const recipeName = formData.get("recipeName");
        const steps = [];

        // 각 step을 수집
        formData.forEach((value, key) => {
            if (key === "step") {
                steps.push(value);
            }
        });

        // POST 요청을 보내는 코드 (fetch 사용)
        fetch('/createRecipe', {
            method: 'POST',
            body: new URLSearchParams({
                recipeName: recipeName,
                step: steps.join(",")  // 여러 step을 콤마로 구분해서 서버로 전송
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("레시피 저장 성공!");
                    // 저장 후 mypage로 리다이렉트
                    window.location.href = '/mypage';  // 원하는 페이지로 리다이렉트
                } else {
                    alert("레시피 저장 실패: " + data.message);
                }
            })
            .catch(error => {
                alert("오류 발생: " + error);
            });
    });

    // 🔹 레시피 저장 함수
    async function saveRecipe(title, steps) {
        try {
            const response = await fetch('/createRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, steps }),
            });

            const data = await response.json();
            if (data.success) {
                alert("레시피가 저장되었습니다!");
                window.location.href = "/mypage";  // 저장 후 마이페이지로 이동
            } else {
                alert("레시피 저장 실패. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("레시피 저장 중 오류가 발생했습니다:", error);
            alert("레시피 저장 실패. 네트워크 오류.");
        }
    }

    // 🔹 레시피 삭제 함수
    async function deleteRecipe(recipeId) {
        try {
            const response = await fetch(`/deleteRecipe/${recipeId}`, { method: 'DELETE' });
            if (response.ok) {
                console.log("레시피 삭제 완료:", recipeId);
                // 레시피 삭제 후 DOM에서 해당 레시피 카드 제거
                const recipeCard = document.querySelector(`.delete-recipe-btn[data-id="${recipeId}"]`).closest(".recipe-card");
                if (recipeCard) {
                    recipeCard.remove();
                }
            } else {
                console.error("레시피 삭제 실패:", response.statusText);
            }
        } catch (error) {
            console.error("레시피 삭제 중 오류 발생:", error);
        }
    }

    // 🔹 레시피 목록 표시 함수
    async function displayRecipes() {
        try {
            const response = await fetch('/getRecipe');
            const data = await response.json();
            const recipesContainer = document.querySelector(".recipes-section");

            recipesContainer.innerHTML = "<h3>나의 레시피</h3>"; // 레시피 목록 초기화

            if (data.success) {
                if (Array.isArray(data.data) && data.data.length > 0) {
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

                    // 상세 보기 버튼 이벤트 추가
                    document.querySelectorAll(".view-recipe-btn").forEach((button) => {
                        button.addEventListener("click", function () {
                            const recipeId = this.getAttribute("data-id");
                            showRecipeDetail(recipeId);
                        });
                    });

                    // 삭제 버튼 이벤트 추가
                    document.querySelectorAll(".delete-recipe-btn").forEach((button) => {
                        button.addEventListener("click", function () {
                            const recipeId = this.getAttribute("data-id");
                            deleteRecipe(recipeId);
                        });
                    });
                } else {
                    console.log("레시피가 없습니다.");
                }
            } else {
                console.error("레시피 데이터를 불러오지 못했습니다.");
            }
        } catch (error) {
            console.error("레시피 목록 불러오기 실패:", error);
        }
    }

    // 페이지 로드 시 레시피 목록을 불러옵니다.
    displayRecipes();
});
