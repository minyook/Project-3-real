const box1 = document.getElementById("animatedBox1");
    
      box1.addEventListener("mouseenter", () => {
        box1.classList.add("animate__bounce");
      });
    
      box1.addEventListener("mouseleave", () => {
        box1.classList.remove("animate__bounce");
      });
      const box2 = document.getElementById("animatedBox2");
    
      box2.addEventListener("mouseenter", () => {
        box2.classList.add("animate__bounce");
      });
    
      box2.addEventListener("mouseleave", () => {
        box2.classList.remove("animate__bounce");
      });
      const box3 = document.getElementById("animatedBox3");
    
      box3.addEventListener("mouseenter", () => {
        box3.classList.add("animate__bounce");
      });
    
      box3.addEventListener("mouseleave", () => {
        box3.classList.remove("animate__bounce");
      });

      const box4 = document.getElementById("animatedBox4");
    
      box4.addEventListener("mouseenter", () => {
        box4.classList.add("animate__rubberBand");
      });
    
      box4.addEventListener("mouseleave", () => {
        box4.classList.remove("animate__rubberBand");
      });
      const box5 = document.getElementById("animatedBox5");
    
      box5.addEventListener("mouseenter", () => {
        box5.classList.add("animate__bounceIn");
      });
    
      box5.addEventListener("mouseleave", () => {
        box5.classList.remove("animate__bounceIn");
      });

document.addEventListener("DOMContentLoaded", function () {
  const text = "메뉴 정하기가 어렵다면?\nMJ가 도와줄게요!";
  const typingElement = document.getElementById("typing-text");
    
  let index = 0;
    
  function typeEffect() {
      if (index < text.length) {
          typingElement.innerHTML += text[index] === "\n" ? "<br>" : text[index];
          index++;
          setTimeout(typeEffect, 100); // 타이핑 속도 조절 (100ms)
        } else {
              typingElement.classList.add("cursor");
          }
  }
    
    typeEffect();
});
// 🔹 Firebase 설정
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 🔹 Firebase 초기화
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 🔹 로그인 상태 체크
auth.onAuthStateChanged((user) => {
    if (user) {
        // ✅ 로그인 상태
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("signupBtn").style.display = "none";
        document.getElementById("mypageBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
    } else {
        // ❌ 로그아웃 상태
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("signupBtn").style.display = "block";
        document.getElementById("mypageBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";
    }
});

// 🔹 로그아웃 기능
function logout() {
    auth.signOut().then(() => {
        alert("로그아웃되었습니다.");
        location.reload(); // 페이지 새로고침
    }).catch((error) => {
        console.error("로그아웃 오류:", error);
    });
}
