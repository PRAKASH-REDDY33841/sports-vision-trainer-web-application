const email = localStorage.getItem("userEmail");

if (!email) {
    window.location.href = "login.html";
}

/* ================= LOAD PROFILE ================= */

function loadDashboardProfile() {

    fetch(BASE_URL + "get_profile.php?email=" + email)
        .then(res => res.json())
        .then(data => {

            const username = data.username || "User";

            document.getElementById("usernameText").innerText = username;

            const profileImg = document.getElementById("profileImg");
            const profileInitial = document.getElementById("profileInitial");

            if (data.profile_image) {

                profileImg.src = data.profile_image + "?t=" + new Date().getTime();
                profileImg.style.display = "block";
                profileInitial.style.display = "none";

            } else {

                profileInitial.innerText =
                    username.charAt(0).toUpperCase();

                profileImg.style.display = "none";
                profileInitial.style.display = "block";
            }

        });
}

loadDashboardProfile();

/* ================= NAVIGATION ================= */

function navigate(page) {
    window.location.href = page;
}

/* ================= UNIVERSAL COUNTDOWN ================= */

function startSession(gamePage) {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.85)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "80px";
    overlay.style.fontWeight = "bold";
    overlay.style.zIndex = "9999";

    document.body.appendChild(overlay);

    let count = 3;
    overlay.innerText = count;

    const timer = setInterval(() => {

        count--;

        if (count > 0) {
            overlay.innerText = count;
        } else if (count === 0) {
            overlay.innerText = "GO!";
        } else {
            clearInterval(timer);
            window.location.href = gamePage;   // ✅ USE PARAMETER
        }

    }, 1000);
}