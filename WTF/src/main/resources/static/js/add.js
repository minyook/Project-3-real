document.querySelector(".add-step").addEventListener("click", function () {
    const stepNumber = document.querySelectorAll(".recipe-step").length + 1;
    const newStep = document.createElement("div");
    newStep.classList.add("recipe-step");
    newStep.innerHTML = `
  <h4>Step ${stepNumber}</h4>
  <div class="step-container">
      <textarea name="step" placeholder="예) 다음 요리 단계를 입력하세요."></textarea>
      <input type="file" accept="image/*" />
  </div>
`;
    document.getElementById("recipe-steps").appendChild(newStep);
});

document.getElementById("save-recipe").addEventListener("click", function () {
    const title = document.getElementById("recipe-title").value;
    const imageInput = document.getElementById("recipe-image");

    if (!title || imageInput.files.length === 0) {
        alert("레시피 제목과 대표 이미지를 선택해주세요.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageBase64 = event.target.result; // 대표 이미지 Base64 변환

        const steps = [];
        const stepElements = document.querySelectorAll(".recipe-step");

        let stepImagesLoaded = 0; // 모든 파일이 처리될 때까지 기다리기 위한 카운터

        if (stepElements.length === 0) {
            saveRecipe(title, imageBase64, steps); // 요리 순서가 없으면 즉시 저장
            return;
        }

        stepElements.forEach((stepDiv, index) => {
            const text = stepDiv.querySelector("textarea").value;
            const imgInput = stepDiv.querySelector("input[type='file']");
            const step = { step: index + 1, text };

            if (imgInput.files.length > 0) {
                const stepReader = new FileReader();
                stepReader.onload = function (e) {
                    step.img = e.target.result; // 순서 이미지 Base64 변환
                    stepImagesLoaded++;

                    if (stepImagesLoaded === stepElements.length) {
                        saveRecipe(title, imageBase64, steps);
                    }
                };
                stepReader.readAsDataURL(imgInput.files[0]);
            } else {
                stepImagesLoaded++;
                if (stepImagesLoaded === stepElements.length) {
                    saveRecipe(title, imageBase64, steps);
                }
            }

            steps.push(step);
        });
    };

    reader.readAsDataURL(imageInput.files[0]);
});

function saveRecipe(title, imageBase64, steps) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.push({ title, image: imageBase64, steps });
    localStorage.setItem("recipes", JSON.stringify(recipes));

    alert("레시피가 저장되었습니다!");
    window.location.href = "mypage"; // 저장 후 마이페이지로 이동
}
