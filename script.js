// ===========================
// DYNAMIC CINEMATIC SPLASH SCREEN LOGIC (8 SECONDS)
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    const hasSeenSplash = sessionStorage.getItem("scoolexSplashShown");

    if (!hasSeenSplash) {
        const splashScreen = document.createElement("div");
        splashScreen.id = "splash-screen";
        
        splashScreen.innerHTML = `
            <button class="splash-skip-btn" id="skip-splash">Skip Intro ➔</button>
            <div class="splash-content">
                <div class="badge-logo splash-logo-wrap">
                    <div class="badge-top-arc">★ Learn • Practice • Grow ★</div>
                    <div class="badge-main-banner">
                        <span class="logo-s">S</span><span class="logo-colex">COLEX</span>
                    </div>
                    <div class="badge-sub-text">COMPUTER CLASSES</div>
                    <div class="badge-teacher-text">by SARFARAZ FAIJEE</div>
                </div>
                <div class="splash-welcome-banner">
                    Welcome to the Digital Future
                </div>
                <div class="splash-title">
                    SCOLEX COMPUTER CLASSES
                </div>
                <div class="splash-tagline">
                    Learn • Practice • Succeed
                </div>
                <div class="splash-founder-badge">
                    <span class="splash-founder-label">Excellence Driven By</span>
                    <span class="splash-founder-name">Sarfaraz Faijee</span>
                </div>
            </div>
            <div class="splash-progress-track">
                <div class="splash-progress-bar" style="animation-duration: 8s; -webkit-animation-duration: 8s;"></div>
            </div>
        `;

        document.body.prepend(splashScreen);
        document.body.style.overflow = "hidden";

        // Function to dismiss splash smoothly
        const dismissSplash = () => {
            if (!splashScreen.parentNode) return;
            splashScreen.classList.add("splash-fade-out");
            document.body.style.overflow = ""; 
            sessionStorage.setItem("scoolexSplashShown", "true");

            setTimeout(() => {
                if (splashScreen.parentNode) {
                    splashScreen.remove();
                }
            }, 1000);
        };

        // Skip button event listener
        document.getElementById("skip-splash").addEventListener("click", dismissSplash);

        // Timed to exactly 8 seconds (8000ms) to match the progress bar
        setTimeout(dismissSplash, 8000);
    }
});


// ===========================
// NAVIGATION & MENU LOGIC
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".mobile-menu-btn");
    const ul = document.querySelector("nav ul");
    const dropdownParents = document.querySelectorAll("nav ul .dropdown-parent, nav ul .dropdown-parent-nested");

    // Toggle mobile menu visibility
    if (btn) {
        btn.addEventListener("click", function () {
            ul.classList.toggle("nav-active");
        });
    }

    // Handle dropdown click behaviors for desktop and mobile
    dropdownParents.forEach(function (parentLi) {
        const link = parentLi.querySelector("a");
        const dropdown = parentLi.querySelector(".dropdown, .dropdown2");

        link.addEventListener("click", function (e) {
            if (window.innerWidth > 900) {
                // Desktop Toggle Behavior
                const isOpen = dropdown.classList.contains("active");
                
                parentLi.parentElement.querySelectorAll(":scope > li > .dropdown, :scope > li > .dropdown2").forEach(d => {
                    if (d !== dropdown) d.classList.remove("active");
                });

                if (!isOpen) {
                    dropdown.classList.add("active");
                    e.preventDefault(); 
                }
            } else {
                // Mobile Toggle Behavior: open dropdown instead of closing menu
                if (dropdown) {
                    e.preventDefault();
                    dropdown.classList.toggle("active");
                }
            }
        });
    });

    // Auto-hide menu when clicking final menu options
    const allNavLinks = document.querySelectorAll("nav ul li a");
    allNavLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            const parentLi = this.parentElement;
            const hasSubmenu = parentLi.classList.contains("dropdown-parent") || parentLi.classList.contains("dropdown-parent-nested");

            if (!hasSubmenu) {
                if (ul) ul.classList.remove("nav-active");
                document.querySelectorAll(".dropdown, .dropdown2").forEach(menu => {
                    menu.classList.remove("active");
                });
            }
        });
    });

    // Close all open menus when clicking outside the navbar
    document.addEventListener("click", function (event) {
        if (!event.target.closest("nav")) {
            document.querySelectorAll(".dropdown, .dropdown2").forEach(menu => {
                menu.classList.remove("active");
            });
            if (ul) {
                ul.classList.remove("nav-active");
            }
        }
    });
});


// ===========================
// DYNAMIC HOME PROFILE & LOGOUT SESSION LOGIC
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole");
    const studentDataStr = localStorage.getItem("student");
    const profileBar = document.getElementById("homeProfileBar");

    if (userRole && studentDataStr && profileBar) {
        try {
            const userData = JSON.parse(studentDataStr);
            
            // Display User Name
            const studentName = userData.name || userData.studentName || userData.username || "User";
            document.getElementById("profileName").textContent = studentName;
            
            let detailsText = "";
            if (userRole === "admin") {
                detailsText = "(Role: Administrator)";
            } else if (userRole === "teacher") {
                detailsText = `(Post: ${userData.course || "Faculty Member"})`;
            } else {
                const studentId = userData.studentId || userData.id || userData.rollNo || "N/A";
                const courseName = userData.course || userData.selectedCourse || "N/A";
                const studentEmail = userData.email || userData.studentEmail || "N/A";
                
                detailsText = `| Student ID: ${studentId} | Course: ${courseName} | E-mail: ${studentEmail}`;
            }
            
            document.getElementById("profileDetails").textContent = detailsText;
            profileBar.style.display = "flex";
        } catch (err) {
            console.error("Error parsing user profile data:", err);
        }
    }
});

// Global Logout Function (Redirects back to index.html)
function scolexLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("student");
        window.location.href = "index.html";
    }
}


// ===========================
// TEACHER & ADMIN NAV PERMISSIONS EXTENSION
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole"); // "teacher", "admin", or student/null

    if (userRole === "teacher" || userRole === "admin") {
        // Reveal elements meant for both teachers and admins (View Admissions, Mock Test Details, Uploads)
        document.querySelectorAll(".teacher-admin-only").forEach(el => {
            el.style.display = "block";
        });
    }

    if (userRole === "admin") {
        // Reveal elements meant exclusively for the admin (Edit Admissions)
        document.querySelectorAll(".admin-only").forEach(el => {
            el.style.display = "block";
        });
    }

    // Direct redirection handlers for Admission ERP pages
    const viewAdmBtn = document.getElementById("admissionViewOpt");
    if (viewAdmBtn) {
        viewAdmBtn.addEventListener("click", () => {
            window.location.href = "admission-manage.html";
        });
    }

    const editAdmBtn = document.getElementById("admissionEditOpt");
    if (editAdmBtn) {
        editAdmBtn.addEventListener("click", () => {
            window.location.href = "admission-manage.html";
        });
    }

    const mockTestDetailsBtn = document.getElementById("mockTestDetailsOpt");
    if (mockTestDetailsBtn) {
        mockTestDetailsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("📊 Opening Question-wise Student Mock Test Analytics...");
        });
    }
});


// ===========================
// PROTECTED PAGES & FEATURES ACCESS CONTROL
// ===========================
document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole");
    
    // Restrict access behind login
    const protectedPages = [
        "dashboard.html",   
        "notes.html",       
        "project.html",
        "mocktest.html",
        "admission-manage.html"
    ];

    const currentPath = window.location.pathname;
    const isProtectedPage = protectedPages.some(page => currentPath.includes(page));

    // If attempting to load a protected page directly without authorization
    if (isProtectedPage && !userRole) {
        alert("⚠️ Access Denied! Please log in first to access this portal feature.");
        window.location.href = "login.html";
        return;
    }

    // Intercept navigation links
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && protectedPages.some(page => href.includes(page))) {
            link.addEventListener("click", function (e) {
                if (!localStorage.getItem("userRole")) {
                    e.preventDefault();
                    alert("⚠️ Restricted Area! Please log in with your credentials to view this section.");
                    window.location.href = "login.html";
                }
            });
        }
    });
});