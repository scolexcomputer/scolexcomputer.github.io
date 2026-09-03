//================================
// SCOLEX AUTO LOGOUT (Inactivity)
// Logs out after 30 minutes of no activity
// Include this file on ALL protected pages (index, dashboard, etc.)
// <script src="js/session.js"></script>
//================================

(function () {
  // ---- Settings ----
  var INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
  var WARNING_MS    = 28 * 60 * 1000; // optional warning at 28 min (2 min before)
  var CHECK_EVERY   = 30 * 1000;      // check every 30 seconds
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
    // keep other non-auth data (admissions list etc.) if needed
  }

  function doLogout(reason) {
    clearSession();
    alert(reason || "You have been logged out due to 30 minutes of inactivity.\nPlease login again.");
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

    // Warning 2 minutes before logout
    if (idle >= WARNING_MS && idle < INACTIVITY_MS && !warningShown) {
      warningShown = true;
      // Non-blocking soft warning (optional)
      console.log("Session will expire in about 2 minutes due to inactivity.");
    }

    if (idle >= INACTIVITY_MS) {
      doLogout("⏱ Session expired!\n\nYou were inactive for 30 minutes.\nPlease login again.");
    }
  }

  function startWatching() {
    if (!isLoggedIn()) return;

    // Record activity now
    updateActivity();

    // Reset timer on any user interaction
    var events = ["mousemove", "mousedown", "mouseup", "keydown", "keypress", "scroll", "touchstart", "touchmove", "click", "wheel"];
    events.forEach(function (evt) {
      document.addEventListener(evt, updateActivity, { passive: true, capture: true });
    });

    // Also when tab becomes visible again
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        checkInactivity();
        updateActivity();
      }
    });

    // Periodic check (handles case when user leaves tab open without events)
    timerId = setInterval(checkInactivity, CHECK_EVERY);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWatching);
  } else {
    startWatching();
  }

  // Expose manual logout helper if needed elsewhere
  window.scolexLogout = function () {
    clearSession();
    window.location.href = LOGIN_PAGE;
  };

  window.scolexResetSession = updateActivity;
})();