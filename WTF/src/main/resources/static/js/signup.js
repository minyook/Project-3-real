import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "project-9th-team3-eb188.firebaseapp.com",
    projectId: "project-9th-team3-eb188",
    storageBucket: "project-9th-team3-eb188.firebasestorage.app",
    messagingSenderId: "682296446694",
    appId: "1:682296446694:web:7dcededde4a7fa18857527",
    measurementId: "G-Z5FR7WTXTB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signup = function (e) {
    e.preventDefault();

    var name = document.getElementById('memberName').value.trim();
    var email = document.getElementById('memberEmail').value.trim();
    var password = document.getElementById('memberPassword').value;
    var rePassword = document.getElementById('memberRePassword').value;

    // 1️⃣ 이메일 유효성 검사
    if (!validate_email(email)) {
        alert('이메일 형식이 올바르지 않습니다.');
        return;
    }

    // 2️⃣ 비밀번호 보안 강도 검사
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength === "약함") {
        alert('비밀번호가 너무 약합니다! 최소 8자 이상, 대문자, 숫자, 특수문자를 포함하세요.');
        return;
    }

    // 3️⃣ 비밀번호 재확인 검사
    if (password !== rePassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    // 4️⃣ Firebase에 회원가입 요청
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Firestore에 사용자 정보 저장
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email
            });

            alert("회원가입이 완료되었습니다!");
            window.location.href = '/';
        })
        .catch((error) => {
            const errorCode = error.code;

            // 5️⃣ 중복 이메일 처리
            if (errorCode === "auth/email-already-in-use") {
                alert("이미 존재하는 이메일입니다. 다른 이메일을 사용하세요.");
            } else {
                alert(`회원가입 실패: ${error.message}`);
            }
        });
}

// ✅ 이메일 유효성 검사 함수
function validate_email(email) {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return pattern.test(email);
}

// ✅ 비밀번호 보안 강도 검사 함수 (중간 수준 보안)
function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);

    if (password.length < minLength) return "약함";
    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) return "강함";
    if ((hasUpperCase || hasLowerCase) && hasNumber && hasSpecialChar) return "중간";

    return "약함";
}
