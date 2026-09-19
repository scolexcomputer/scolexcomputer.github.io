//====================================================
// SCOLEX STUDENT SIGNUP
//====================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqumYANoor1bpTJnx9DEoy1WzYn-Ve10Pilrc5QPrL2f5X67LkL39pNKwX1Vn75fPnYA/exec";

// Local storage key for previously registered students (backup check)
const LOCAL_SIGNUPS_KEY = "scolexStudentSignups";

function getLocalSignups() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SIGNUPS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocalSignup(data) {
  const list = getLocalSignups();
  list.push({
    mobile: data.mobile,
    email: (data.email || "").toLowerCase(),
    name: data.name,
    studentId: data.studentId || "",
    registeredAt: new Date().toISOString()
  });
  localStorage.setItem(LOCAL_SIGNUPS_KEY, JSON.stringify(list));
}

function isMobileRegisteredLocally(mobile) {
  const clean = (mobile || "").replace(/\D/g, "");
  if (clean.length < 10) return false;
  return getLocalSignups().some(s => (s.mobile || "").replace(/\D/g, "") === clean);
}

function isEmailRegisteredLocally(email) {
  const clean = (email || "").trim().toLowerCase();
  if (!clean) return false;
  return getLocalSignups().some(s => (s.email || "").toLowerCase() === clean);
}

function showError(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

function setInputError(inputId, isError) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (isError) {
    input.classList.add("input-error");
  } else {
    input.classList.remove("input-error");
  }
}

function clearAllErrors() {
  showError("mobile-error", false);
  showError("email-error", false);
  showError("password-error", false);
  setInputError("mobile", false);
  setInputError("email", false);
  setInputError("confirm", false);
}

// Live validation while typing
document.addEventListener("DOMContentLoaded", function () {
  const mobileInput = document.getElementById("mobile");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm");

  if (mobileInput) {
    mobileInput.addEventListener("input", function () {
      // Only digits, max 10
      this.value = this.value.replace(/\D/g, "").slice(0, 10);
      if (this.value.length === 10 && isMobileRegisteredLocally(this.value)) {
        showError("mobile-error", true);
        setInputError("mobile", true);
      } else {
        showError("mobile-error", false);
        setInputError("mobile", false);
      }
    });
    mobileInput.addEventListener("blur", function () {
      if (this.value.length === 10 && isMobileRegisteredLocally(this.value)) {
        showError("mobile-error", true);
        setInputError("mobile", true);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const val = this.value.trim().toLowerCase();
      if (val && isEmailRegisteredLocally(val)) {
        showError("email-error", true);
        setInputError("email", true);
      } else {
        showError("email-error", false);
        setInputError("email", false);
      }
    });
    emailInput.addEventListener("input", function () {
      // Clear error while typing if it was shown
      if (this.classList.contains("input-error")) {
        const val = this.value.trim().toLowerCase();
        if (!val || !isEmailRegisteredLocally(val)) {
          showError("email-error", false);
          setInputError("email", false);
        }
      }
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener("input", function () {
      const pass = passwordInput ? passwordInput.value : "";
      if (this.value && pass && this.value !== pass) {
        showError("password-error", true);
        setInputError("confirm", true);
      } else {
        showError("password-error", false);
        setInputError("confirm", false);
      }
    });
  }
});

function signup() {
  clearAllErrors();

  const name = document.getElementById("name").value.trim();
  const father = document.getElementById("father").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  // Basic checks
  if (!name || !father || !mobile || !email || !course || !password || !confirm) {
    alert("Please fill all required fields.");
    return;
  }

  // Mobile format
  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    document.getElementById("mobile").focus();
    return;
  }

  // Password match
  if (password !== confirm) {
    showError("password-error", true);
    setInputError("confirm", true);
    alert("Password and Confirm Password do not match!");
    return;
  }

  // Client-side duplicate check (localStorage)
  let hasLocalError = false;

  if (isMobileRegisteredLocally(mobile)) {
    showError("mobile-error", true);
    setInputError("mobile", true);
    hasLocalError = true;
  }

  if (isEmailRegisteredLocally(email)) {
    showError("email-error", true);
    setInputError("email", true);
    hasLocalError = true;
  }

  if (hasLocalError) {
    if (isMobileRegisteredLocally(mobile) && isEmailRegisteredLocally(email)) {
      alert("Mobile Number Already Registered!\nE-mail id already registered");
    } else if (isMobileRegisteredLocally(mobile)) {
      alert("Mobile Number Already Registered!");
    } else {
      alert("E-mail id already registered");
    }
    return;
  }

  const signupData = {
    action: "signup",
    name: name,
    father: father,
    mobile: mobile,
    email: email,
    course: course,
    password: password
  };

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(signupData)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.status == "success") {
        // Save locally so future checks work even offline
        saveLocalSignup({
          mobile: mobile,
          email: email,
          name: name,
          studentId: data.studentId || ""
        });

        alert("Registration Successful!\nYour Student ID: " + data.studentId);
        window.location.href = "login.html";
      }
      // Server says mobile already exists
      else if (data.status == "exists" || data.status == "mobile_exists" || data.message == "mobile_exists") {
        showError("mobile-error", true);
        setInputError("mobile", true);
        alert("Mobile Number Already Registered!");
      }
      // Server says email already exists
      else if (data.status == "email_exists" || data.message == "email_exists") {
        showError("email-error", true);
        setInputError("email", true);
        alert("E-mail id already registered");
      }
      // Generic exists – try to detect from message
      else if (data.status == "exists" || (data.message && data.message.toLowerCase().includes("mobile"))) {
        showError("mobile-error", true);
        setInputError("mobile", true);
        alert("Mobile Number Already Registered!");
      }
      else if (data.message && data.message.toLowerCase().includes("email")) {
        showError("email-error", true);
        setInputError("email", true);
        alert("E-mail id already registered");
      }
      else {
        alert("Registration Failed" + (data.message ? ": " + data.message : ""));
      }
    })
    .catch(error => {
      console.log(error);
      alert("Server Error. Please try again.");
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
      }
    });
}
