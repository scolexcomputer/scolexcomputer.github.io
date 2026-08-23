// ===========================
// DYNAMIC CINEMATIC SPLASH SCREEN LOGIC (10 SECONDS)
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
                <div class="splash-progress-bar"></div>
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

        // Extended timing to exactly 10 seconds (10000ms) for the full cinematic experience
        setTimeout(dismissSplash, 10000);
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

    // Auto-hide menu when clicking final menu options (items that don't have sub-menus)
    const allNavLinks = document.querySelectorAll("nav ul li a");
    allNavLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            const parentLi = this.parentElement;
            const hasSubmenu = parentLi.classList.contains("dropdown-parent") || parentLi.classList.contains("dropdown-parent-nested");

            // Only auto-hide if it's a final option (no submenu attached)
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