/**
 * Notes & Project Page Script - Fixed Version
 * - Admin controls only visible for admin/teacher
 * - Cards synced to GitHub
 * - Fixed emoji & visibility issues
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxf0pp2PMdd4F5Nyz3Ct01WTs4fIeZW9mmt_dawKR8gWh_7Z0va2IQrZjVtz8zCl0H_/exec";
const CARDS_JSON_URL = "https://scolexcomputer.github.io/data/cards-data.json";

const ALL_COURSES = [
  'dca', 'dcat', 'adca', 'dtp', 'programming',
  'dca-projects', 'dcat-projects', 'adca-projects', 'dtp-projects', 'programming-projects'
];

// ========== SHOW / HIDE COURSES ==========
function showNotes(courseId) {
  const courseList = document.querySelector('.course-list');
  if (courseList) courseList.style.display = 'none';

  document.querySelectorAll('.notes-content').forEach(note => {
    note.classList.remove('active');
    note.style.display = 'none';
  });

  const selectedCourse = document.getElementById(courseId);
  if (selectedCourse) {
    selectedCourse.style.display = 'block';
    selectedCourse.classList.add('active');

    let backBtn = document.getElementById('back-to-courses-btn');
    if (!backBtn) {
      backBtn = document.createElement('div');
      backBtn.id = 'back-to-courses-btn';
      backBtn.style.cssText = 'margin: 0 0 20px 0; text-align: left;';
      backBtn.innerHTML = `
        <button onclick="showCourseList()" style="
          background: var(--cyan, #00e5ff); color: #0a0f1c; border: none;
          padding: 10px 18px; font-weight: bold; font-size: 0.95rem;
          border-radius: 8px; cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,229,255,0.3);">
          ← Back to Courses
        </button>`;
    }
    selectedCourse.prepend(backBtn);
    backBtn.style.display = 'block';

    setTimeout(() => {
      const elementPosition = selectedCourse.getBoundingClientRect().top + window.pageYOffset;
      const navElement = document.querySelector('nav') || document.querySelector('header');
      const navHeight = navElement ? navElement.offsetHeight : 70;
      window.scrollTo({ top: elementPosition - navHeight - 15, behavior: 'smooth' });
    }, 50);
  }
}

function showCourseList() {
  const courseList = document.querySelector('.course-list');
  if (courseList) courseList.style.display = 'grid';

  document.querySelectorAll('.notes-content').forEach(note => {
    note.classList.remove('active');
    note.style.display = 'none';
  });

  const backBtn = document.getElementById('back-to-courses-btn');
  if (backBtn) backBtn.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== FORCE CORRECT VISIBILITY (MOST IMPORTANT FIX) ==========
function applyAdminVisibility() {
  const userRole = localStorage.getItem("userRole");
  const isAdmin = (userRole === "admin" || userRole === "teacher");

  // Upload boxes
  document.querySelectorAll(".card-upload-box").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });

  // Edit / Delete buttons
  document.querySelectorAll(".admin-controls").forEach(el => {
    el.style.display = isAdmin ? "flex" : "none";
  });

  // Add New Topic buttons
  document.querySelectorAll(".add-topic-container").forEach(el => {
    el.style.display = isAdmin ? "block" : "none";
  });
}

// ========== PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load cards from GitHub (shared)
  await loadCardsFromGitHub();

  // 2. Fallback to localStorage
  loadSavedNotesData();

  // 3. CRITICAL: Force correct visibility based on current user
  applyAdminVisibility();

  // Search
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.card');

      if (query.length > 0) {
        document.querySelectorAll('.notes-content').forEach(s => s.style.display = 'block');
      }

      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(query) || desc.includes(query)) ? 'flex' : 'none';
      });
    });
  }
});

// ========== LOAD FROM GITHUB ==========
async function loadCardsFromGitHub() {
  try {
    const res = await fetch(CARDS_JSON_URL + "?t=" + Date.now());
    if (!res.ok) return;

    const data = await res.json();
    ALL_COURSES.forEach(course => {
      const box = document.getElementById('box-' + course);
      if (box && data[course]) {
        box.innerHTML = data[course];
      }
    });

    localStorage.setItem("scolex_notes_data", JSON.stringify(data));
  } catch (err) {
    console.warn("Could not load from GitHub:", err);
  }
}

// ========== SAVE TO GITHUB + localStorage ==========
async function saveAllNotesToStorage() {
  const data = {};
  ALL_COURSES.forEach(course => {
    const box = document.getElementById('box-' + course);
    if (box) data[course] = box.innerHTML;
  });

  localStorage.setItem("scolex_notes_data", JSON.stringify(data));

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "saveCards",
        cardsData: data
      })
    });
    const result = await response.json();
    if (result.status !== "success") {
      console.error("GitHub save failed:", result.message);
    }
  } catch (err) {
    console.error(err);
  }

  // Always re-apply visibility after save
  applyAdminVisibility();
}

function loadSavedNotesData() {
  const saved = localStorage.getItem("scolex_notes_data");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    ALL_COURSES.forEach(course => {
      const box = document.getElementById('box-' + course);
      if (box && data[course]) box.innerHTML = data[course];
    });
  } catch (e) {
    console.error(e);
  }
}

// ========== ADMIN ACTIONS ==========
function addNewTopicCard(courseKey) {
  const title = prompt("Enter Topic Title:");
  if (!title) return;
  const desc = prompt("Enter Topic Description:");
  if (!desc) return;
  const fileName = prompt("Enter file name (e.g. advanced-excel.pdf):", "notes.pdf");
  if (!fileName) return;

  const isProject = courseKey.includes("projects");
  const folder = isProject
    ? "projects/" + courseKey.replace("-projects", "")
    : "notes/" + courseKey;

  const box = document.getElementById('box-' + courseKey);
  const uniqueId = courseKey + '-' + Date.now();

  const cardHTML = `
    <div class="card" data-id="${uniqueId}">
      <h3>${title}</h3>
      <p>${desc}</p>
      <a href="${folder}/${fileName}" class="download" target="_blank">Download PDF</a>
      <div class="card-upload-box">
        <input type="file" class="card-file-input" accept=".pdf,.zip" style="font-size: 11px; width: 100%; margin-bottom: 5px;">
        <button type="button" onclick="uploadCardFile(this, '${folder}', '${fileName}')"
          style="background: #28a745; color: white; border: none; padding: 4px 8px; font-size: 11px; border-radius: 3px; cursor: pointer; font-weight: bold;">
          Upload / Replace File
        </button>
      </div>
      <div class="admin-controls">
        <button class="btn-edit" onclick="enableEditCard(this)">Edit</button>
        <button class="btn-delete" onclick="deleteCard(this)">Delete</button>
      </div>
    </div>`;

  box.insertAdjacentHTML('beforeend', cardHTML);
  saveAllNotesToStorage();
  alert("✅ New topic added & saved!");
}

function enableEditCard(btn) {
  const card = btn.closest('.card');
  const h3 = card.querySelector('h3');
  const p = card.querySelector('p');

  if (btn.textContent.trim() === "Edit") {
    h3.innerHTML = `<input type="text" class="edit-title" value="${h3.textContent}" style="width:100%; padding:4px;">`;
    p.innerHTML = `<textarea class="edit-desc" style="width:100%; padding:4px; height:60px;">${p.textContent}</textarea>`;
    btn.textContent = "Save";
    btn.style.background = "#28a745";
    btn.style.color = "#fff";
  } else {
    h3.textContent = card.querySelector('.edit-title').value;
    p.textContent = card.querySelector('.edit-desc').value;
    btn.textContent = "Edit";
    btn.style.background = "#ffc107";
    btn.style.color = "#000";
    saveAllNotesToStorage();
    alert("✅ Changes saved!");
  }
}

function deleteCard(btn) {
  if (confirm("⚠️ Are you sure you want to delete this topic?")) {
    btn.closest('.card').remove();
    saveAllNotesToStorage();
    alert("🗑️ Topic deleted!");
  }
}

// ========== FILE UPLOADER ==========
async function uploadCardFile(btn, folder, targetFilename) {
  const card = btn.closest('.card');
  const fileInput = card.querySelector('.card-file-input');

  if (!fileInput || fileInput.files.length === 0) {
    alert("⚠️ Please select a file first!");
    return;
  }

  const file = fileInput.files[0];
  const originalText = btn.innerText;
  btn.innerText = "Uploading...";
  btn.disabled = true;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function () {
    const base64Content = reader.result.split(",")[1];

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          filename: targetFilename,
          content: base64Content,
          folder: folder
        })
      });
      const result = await response.json();

      if (result.status === "success") {
        alert(`✅ Successfully updated "${targetFilename}"!`);
        fileInput.value = "";
      } else {
        alert("❌ Error: " + (result.message || "Upload failed"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Network error with Apps Script.");
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  };
}