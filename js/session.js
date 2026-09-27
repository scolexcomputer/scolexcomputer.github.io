//================================
// SCOLEX AUTO LOGOUT (Inactivity)
// Logs out after 10 minutes of no activity
// Session remains if user closes tab and reopens within 10 minutes
// Include this file on ALL protected pages
// <script src="js/session.js"></script>
//================================

(function () {
  // ---- Settings ----
  var INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
  var WARNING_MS    =  8 * 60 * 1000; // warning at 8 minutes (2 min before logout)
  var CHECK_EVERY   = 15 * 1000;      // check every 15 seconds
  var LOGIN_PAGE    = "login.html";
  var STORAGE_KEY   = "scolex_last_activity";

  var warningShown = false;
  var timerId = null;

  // Only run if user is logged in
  function isLoggedIn() {
    return !!(localStorage.getItem("userRole") && localStorage.getItem("student"));
  }

  function updateActivity() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    warningShown = false;
  }

  function clearSession() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("student");
    localStorage.removeItem("ScolexStudentSavedData");
    localStorage.removeItem(STORAGE_KEY);
  }

  function doLogout(reason) {
    clearSession();
    alert(reason || "You have been logged out due to 10 minutes of inactivity.\nPlease login again.");
    window.location.href = LOGIN_PAGE;
  }

  function checkInactivity() {
    if (!isLoggedIn()) return;

    var last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (!last) {
      updateActivity();
      return;
    }

    var idle = Date.now() - last;

    // Soft warning 2 minutes before logout
    if (idle >= WARNING_MS && idle < INACTIVITY_MS && !warningShown) {
      warningShown = true;
      console.log("Session will expire in about 2 minutes due to inactivity.");
    }

    // Logout after 10 minutes of inactivity
    if (idle >= INACTIVITY_MS) {
      doLogout("⏱ Session expired!\n\nYou were inactive for 10 minutes.\nPlease login again.");
    }
  }

  function startWatching() {
    if (!isLoggedIn()) return;

    // Check if already expired (important when reopening closed tab)
    checkInactivity();

    // If still logged in, record activity
    if (isLoggedIn()) {
      updateActivity();
    }

    // Reset timer on any user interaction
    var events = [
      "mousemove", "mousedown", "mouseup", "keydown", "keypress",
      "scroll", "touchstart", "touchmove", "click", "wheel"
    ];
    events.forEach(function (evt) {
      document.addEventListener(evt, updateActivity, { passive: true, capture: true });
    });

    // When user comes back to the tab
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        checkInactivity();          // check if expired while away
        if (isLoggedIn()) {
          updateActivity();         // reset timer if still valid
        }
      }
    });

    // Periodic check
    timerId = setInterval(checkInactivity, CHECK_EVERY);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWatching);
  } else {
    startWatching();
  }

  // Manual logout helper
  window.scolexLogout = function () {
    clearSession();
    window.location.href = LOGIN_PAGE;
  };

  window.scolexResetSession = updateActivity;
})();