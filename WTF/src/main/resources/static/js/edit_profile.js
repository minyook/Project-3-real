// 🔹 기존 회원 정보 불러오기 (localStorage 사용)
const userData = {
    username: localStorage.getItem("username") || "홍길동",
    userid: localStorage.getItem("userid") || "hong123",
    password: localStorage.getItem("password") || "1234",
    profilePic: localStorage.getItem("profilePic") || "", // 프로필 사진
};

// 🔹 요소 가져오기
const profilePicDiv = document.getElementById("profile-pic");
const profileName = document.querySelector(".profile-info h2");
const usernameInput = document.getElementById("username");
const useridInput = document.getElementById("userid");
const passwordInput = document.getElementById("new-password");
const editProfileForm = document.getElementById("edit-profile-form");
const uploadInput = document.getElementById("upload-profile-pic");
const changePicBtn = document.getElementById("change-pic-btn");

// 🔹 프로필 사진 설정 (기존 데이터 유지)
function loadProfilePic() {
    if (userData.profilePic) {
        profilePicDiv.style.backgroundImage = `url(${userData.profilePic})`;
    }
}

// 🔹 기존 정보 입력 필드 & 프로필 이름 설정
if (profileName) {
    profileName.textContent = userData.username;
}
usernameInput.value = userData.username;
useridInput.value = userData.userid;
loadProfilePic(); // 프로필 사진 로드

// 🔹 사진 변경 버튼 클릭 시 파일 선택 창 열기
changePicBtn.addEventListener("click", function () {
    uploadInput.click();
});

// 🔹 파일 선택 시 프로필 사진 변경
uploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            profilePicDiv.style.backgroundImage = `url(${imageUrl})`;
            localStorage.setItem("profilePic", imageUrl); // 🔹 localStorage에 저장
        };
        reader.readAsDataURL(file);
    }
});

// 🔹 폼 제출 시 데이터 업데이트
editProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newUsername = usernameInput.value.trim();
    const newUserid = useridInput.value.trim();
    const newPassword = passwordInput.value.trim();

    if (newUsername === "" || newUserid === "") {
        alert("이름과 아이디를 입력하세요.");
        return;
    }

    // 변경된 정보 저장
    localStorage.setItem("username", newUsername);
    localStorage.setItem("userid", newUserid);
    if (newPassword !== "") {
        localStorage.setItem("password", newPassword);
    }

    // 🔹 실시간으로 프로필 이름 업데이트
    if (profileName) {
        profileName.textContent = newUsername;
    }

    alert("회원정보가 수정되었습니다.");

    // 🔹 팝업 닫기
    document.getElementById("profile-popup").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none";
});

// 🔹 페이지 로드 시 프로필 이름 & 사진 업데이트 (새로고침 후 유지)
document.addEventListener("DOMContentLoaded", function () {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername && profileName) {
        profileName.textContent = savedUsername;
    }
    loadProfilePic(); // 새로고침 시 프로필 사진 유지
});
