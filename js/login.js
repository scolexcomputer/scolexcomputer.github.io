//================================
// SCOLEX STUDENT & PORTAL LOGIN
//================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqumYANoor1bpTJnx9DEoy1WzYn-Ve10Pilrc5QPrL2f5X67LkL39pNKwX1Vn75fPnYA/exec";

let currentLoginRole = "student";

// Credentials Mapping & Validation Database for Admin & Teachers
const USERS_DB = {
  admin: {
    name: "Scolex Computer Classes",
    email: "scolexcomputer@gmail.com",
    mobile: "7549656240",
    username: "Admin",
    password: "Admin@2016",
    role: "admin",
    redirect: "index.html"
  },
  teachers: [
    {
      name: "Md Sarfaraz",
      email: "sarfaraz.faijee96@gmail.com",
      username: "sarfaraz96",
      mobile: "7549656240",
      password: "Sarfaraz@2016",
      role: "teacher",
      redirect: "index.html"
    },
    {
      name: "Md Shahnawaz",
      email: "shahnawaz.taz@gmail.com",
      username: "Shahnawaz99",
      mobile: "8298952044",
      password: "Shahnawaz@440",
      role: "teacher",
      redirect: "index.html"
    }
  ]
};

// ==========================================
// AUTO-REDIRECT & INITIAL ROLE SETUP FROM URL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const existingRole = localStorage.getItem("userRole");
  const existingUser = localStorage.getItem("student");

  if (existingRole && existingUser) {
    window.location.href = "index.html";
    return;
  }

  // Check URL parameters (e.g., login.html?role=admin) to set default view
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get("role");
  if (roleParam && (roleParam === "admin" || roleParam === "teacher" || roleParam === "student")) {
    switchRole(roleParam);
  }
});

// Switch between Student, Admin, and Teacher tabs/roles dynamically
function switchRole(role) {
  currentLoginRole = role;
  const studentTab = document.getElementById("studentTabBtn");
  const teacherTab = document.getElementById("teacherTabBtn");
  const adminTab = document.getElementById("adminTabBtn");
  const loginBtn = document.getElementById("loginBtn");
  const footerActions = document.getElementById("footerActions");
  const loginIdInput = document.getElementById("loginId");

  if (!loginBtn) return;

  // Update tab active states visually if elements exist
  if (studentTab) studentTab.classList.toggle("active", role === "student");
  if (teacherTab) teacherTab.classList.toggle("active", role === "teacher");
  if (adminTab) adminTab.classList.toggle("active", role === "admin");

  if (role === "admin") {
    loginBtn.innerText = "Login as Admin";
    if (loginIdInput) loginIdInput.placeholder = "Admin Username, Email or Mobile";
    if (footerActions) footerActions.style.display = "none";
  } else if (role === "teacher") {
    loginBtn.innerText = "Login as Teacher";
    if (loginIdInput) loginIdInput.placeholder = "Enter Teacher ID, Email or Mobile";
    if (footerActions) footerActions.style.display = "none";
  } else {
    loginBtn.innerText = "Login as Student";
    if (loginIdInput) loginIdInput.placeholder = "Mobile Number or Student ID";
    if (footerActions) footerActions.style.display = "flex";
  }
}

// Handle portal validations for Admin and Teacher using USERS_DB
function handlePortalLogin(loginId, password, selectedRole) {
  loginId = loginId.trim();
  password = password.trim();

  if (selectedRole === "admin") {
    if (
      (loginId.toLowerCase() === USERS_DB.admin.username.toLowerCase() || 
       loginId.toLowerCase() === USERS_DB.admin.email.toLowerCase() || 
       loginId === USERS_DB.admin.mobile) &&
      password === USERS_DB.admin.password
    ) {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("student", JSON.stringify(USERS_DB.admin));
      alert("✅ Admin Login Successful!");
      window.location.href = "index.html";
      return true;
    } else {
      alert("❌ Invalid Admin Credentials!");
      return false;
    }
  } 
  else if (selectedRole === "teacher") {
    const matchedTeacher = USERS_DB.teachers.find(t => 
      (t.username.toLowerCase() === loginId.toLowerCase() || 
       t.email.toLowerCase() === loginId.toLowerCase() || 
       t.mobile === loginId) && 
      t.password === password
    );

    if (matchedTeacher) {
      localStorage.setItem("userRole", "teacher");
      localStorage.setItem("student", JSON.stringify(matchedTeacher));
      alert(`✅ Welcome, ${matchedTeacher.name}! Teacher Login Successful.`);
      window.location.href = "index.html";
      return true;
    } else {
      alert("❌ Invalid Teacher ID/Email or Password!");
      return false;
    }
  }
  return false;
}

// Main Login Processing Function
async function handleLogin() {
  const loginIdInput = document.getElementById("loginId");
  const passwordInput = document.getElementById("password");

  if (!loginIdInput || !passwordInput) {
    alert("Form elements missing!");
    return;
  }

  const loginId = loginIdInput.value.trim();
  const password = passwordInput.value.trim();

  // Route Admin and Teacher logins directly through database validation
  if (currentLoginRole === "admin" || currentLoginRole === "teacher") {
    handlePortalLogin(loginId, password, currentLoginRole);
    return;
  }

  // Student Validation via Google Apps Script Backend
  if (!loginId || !password) {
    alert("Please enter both ID/Mobile and Password.");
    return;
  }

  try {
    const loginBtn = document.getElementById("loginBtn");
    const originalText = loginBtn.innerText;
    loginBtn.innerText = "Verifying...";
    loginBtn.disabled = true;

    const response = await fetch(`${SCRIPT_URL}?action=login&loginId=${encodeURIComponent(loginId)}&password=${encodeURIComponent(password)}`);
    const result = await response.json();

    loginBtn.innerText = originalText;
    loginBtn.disabled = false;

    if (result.status === "success" || result.success) {
      const raw = result.student || result.data || result.row || {};

      const studentObj = {
        studentId: raw["Student ID"] || raw.studentId || raw.id || raw.rollNo || loginId,
        name: raw["Name"] || raw.name || raw.studentName || raw.username || "Student User",
        mobile: raw["Mobile"] || raw.mobile || loginId,
        email: raw["Email"] || raw.email || raw.studentEmail || "N/A",
        course: raw["Course"] || raw.course || raw.selectedCourse || "ADCA"
      };

      localStorage.setItem("userRole", "student");
      localStorage.setItem("student", JSON.stringify(studentObj));
      
      alert("✅ Student Login Successful!");
      window.location.href = "index.html";
    } else {
      alert(result.message || "❌ Invalid Mobile Number, ID, or Password.");
    }
  } catch (error) {
    console.error("Backend connection error:", error);
    alert("❌ Error connecting to the server. Please check your network connection.");
  }
}

// Legacy global support helper
function login() {
  handleLogin();
}