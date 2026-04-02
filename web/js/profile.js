const email = localStorage.getItem("userEmail");

if (!email) {
    window.location.href = "login.html";
}

const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bio");
const profileImage = document.getElementById("profileImage");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const imageInput = document.getElementById("imageInput");
const message = document.getElementById("message");

let selectedFile = null;

/* ================= LOAD PROFILE ================= */

function loadProfile() {
    fetch(BASE_URL + "get_profile?email=" + email)
        .then(res => res.json())
        .then(data => {

            usernameInput.value = data.username || "";
            bioInput.value = data.bio || "";

            if (data.profile_image) {
                // 🔥 Cache fix
                profileImage.src = data.profile_image + "?t=" + new Date().getTime();
            }

        });
}

loadProfile();

/* ================= EDIT MODE ================= */

editBtn.addEventListener("click", () => {

    usernameInput.disabled = false;
    bioInput.disabled = false;

    saveBtn.classList.remove("hidden");
    changePhotoBtn.classList.remove("hidden");
});

/* ================= IMAGE PICK ================= */

changePhotoBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];
    profileImage.src = URL.createObjectURL(selectedFile);
});

/* ================= SAVE PROFILE ================= */

saveBtn.addEventListener("click", () => {

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", usernameInput.value);
    formData.append("bio", bioInput.value);

    if (selectedFile) {
        formData.append("photo", selectedFile);
    }

    fetch(BASE_URL + "save_profile", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        if (data.status === "success") {

            message.innerText = "Profile updated successfully ✓";

            usernameInput.disabled = true;
            bioInput.disabled = true;

            saveBtn.classList.add("hidden");
            changePhotoBtn.classList.add("hidden");

            // 🔥 IMPORTANT
            // Refresh dashboard automatically
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);

        } else {
            message.innerText = "Update failed ❌";
        }

    });

});