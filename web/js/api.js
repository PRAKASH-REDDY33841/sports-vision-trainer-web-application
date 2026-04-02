const BASE_URL = "http://180.235.121.253:8141/";

function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(BASE_URL + "login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {

            localStorage.setItem("userEmail", email);
            alert("Login successful");
            window.location.href = "profile.html";

        } else {
            alert(data.message || data.msg);
        }

    })
    .catch(err => {
        console.error(err);
        alert("Error connecting to server");
    });
}

function loadProfile() {

    const email = localStorage.getItem("userEmail");

    if (!email) {
        window.location.href = "login.html";
        return;
    }

    fetch(BASE_URL + "get_profile?email=" + email)
    .then(res => res.json())
    .then(data => {

        document.getElementById("username").innerText = data.username || "No username";
        document.getElementById("bio").innerText = data.bio || "No bio";

        if (data.profile_image) {
            document.getElementById("profileImage").src = data.profile_image;
            document.getElementById("profileImage").style.display = "block";
        }

    })
    .catch(err => {
        console.error(err);
        alert("Failed to load profile");
    });
}

function logout() {
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}

function register() {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    // Clear old errors
    document.getElementById("uError").innerText = "";
    document.getElementById("eError").innerText = "";
    document.getElementById("pError").innerText = "";
    document.getElementById("cError").innerText = "";

    let hasError = false;

    if (username === "") {
        document.getElementById("uError").innerText = "Username required";
        hasError = true;
    }

    if (email === "") {
        document.getElementById("eError").innerText = "Email required";
        hasError = true;
    }

    if (password === "") {
        document.getElementById("pError").innerText = "Password required";
        hasError = true;
    }

    if (confirm !== password) {
        document.getElementById("cError").innerText = "Passwords must match";
        hasError = true;
    }

    if (hasError) return;

    fetch(BASE_URL + "register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {
            alert("Registered Successfully");
            window.location.href = "login.html";
        } else {
            alert(data.message || data.msg);
        }

    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}

function sendOtp() {

    const email = document.getElementById("email").value.trim();
    const errorBox = document.getElementById("emailError");
    const successBox = document.getElementById("successMessage");

    errorBox.innerText = "";
    successBox.innerHTML = "";

    if (email === "") {
        errorBox.innerText = "Email is required";
        return;
    }

    fetch(BASE_URL + "send_otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {

            localStorage.setItem("resetEmail", email);

            successBox.innerHTML =
                `<div class="success-box">
                    <i class="fa-solid fa-circle-check"></i>
                    OTP sent successfully. Redirecting...
                </div>`;

            setTimeout(() => {
                window.location.href = "verify.html";
            }, 1500);

        } else {
            errorBox.innerText = data.msg || "Something went wrong";
        }

    })
    .catch(err => {
        errorBox.innerText = "Server error";
    });
}

function verifyOtp() {

    const otp = document.getElementById("otp").value.trim();
    const email = localStorage.getItem("resetEmail");
    const errorBox = document.getElementById("otpError");
    const successBox = document.getElementById("successMessage");

    errorBox.innerText = "";
    successBox.innerHTML = "";

    if (!email) {
        window.location.href = "login.html";
        return;
    }

    if (otp.length !== 6) {
        errorBox.innerText = "OTP must be 6 digits";
        return;
    }

    fetch(BASE_URL + "verify_otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            otp: otp
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {

            successBox.innerHTML =
                `<div class="success-box">
                    <i class="fa-solid fa-circle-check"></i>
                    OTP Verified Successfully. Redirecting...
                </div>`;

            setTimeout(() => {
                window.location.href = "reset.html";
            }, 1500);

        } else {
            errorBox.innerText = data.msg || "Invalid OTP";
        }

    })
    .catch(() => {
        errorBox.innerText = "Server error";
    });
}
function resetPassword() {

    const password = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();
    const email = localStorage.getItem("resetEmail");

    document.getElementById("pError").innerText = "";
    document.getElementById("cError").innerText = "";

    if (!email) {
        window.location.href = "login.html";
        return;
    }

    let hasError = false;

    if (password === "") {
        document.getElementById("pError").innerText = "Password required";
        hasError = true;
    }

    if (confirm !== password) {
        document.getElementById("cError").innerText = "Passwords must match";
        hasError = true;
    }

    if (hasError) return;

    fetch(BASE_URL + "reset_password_final", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {
            alert("Password Reset Successful");
            localStorage.removeItem("resetEmail");
            window.location.href = "login.html";
        } else {
            alert(data.msg || data.message);
        }

    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}

document.addEventListener("input", function () {

    const pass = document.getElementById("newPassword");
    const confirm = document.getElementById("confirmPassword");
    const btn = document.getElementById("resetBtn");

    if (pass && confirm && btn) {
        btn.disabled = !(pass.value !== "" && pass.value === confirm.value);
    }

});

function togglePassword() {

    const pass = document.getElementById("password");
    const eyeBtn = document.getElementById("eyeBtn").querySelector("i");

    if (pass.type === "password") {
        pass.type = "text";
        eyeBtn.classList.remove("fa-eye");
        eyeBtn.classList.add("fa-eye-slash");
    } else {
        pass.type = "password";
        eyeBtn.classList.remove("fa-eye-slash");
        eyeBtn.classList.add("fa-eye");
    }
}

function saveSession(sessionData) {
    const email = localStorage.getItem("userEmail");
    if (!email) {
        console.warn("No user logged in, session not saved to backend");
        return Promise.resolve();
    }
    return fetch(BASE_URL + "save_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            gameType: sessionData.gameType,
            score: sessionData.score,
            avgReaction: sessionData.avgReaction,
            wrong: sessionData.wrong,
            timestamp: sessionData.timestamp
        })
    })
    .then(res => res.json())
    .catch(err => console.error("Failed to save session to backend:", err));
}

function getSessions(email) {
    if (!email) return Promise.resolve({ sessions: [] });
    return fetch(BASE_URL + "get_sessions?email=" + email)
    .then(res => res.json())
    .catch(err => {
        console.error("Failed to fetch sessions from backend:", err);
        return { sessions: [] };
    });
}
