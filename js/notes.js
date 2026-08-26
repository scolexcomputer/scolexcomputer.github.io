// Function to display topics when a course card is clicked
function showNotes(courseId) {
    // 1. Get all notes sections
    const allNotes = document.querySelectorAll('.notes-content');

    // 2. Hide all sections and remove active class
    allNotes.forEach(note => {
        note.classList.remove('active');
        note.style.display = 'none';
    });

    // 3. Find and display the selected course section
    const selectedCourse = document.getElementById(courseId);
    if (selectedCourse) {
        selectedCourse.style.display = 'block'; // Fallback display
        selectedCourse.classList.add('active'); // Applies CSS animation and styling

        // 4. Smooth scroll to the course section header
        selectedCourse.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialization, Admin Controls Display, and Live Search Filter
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem("userRole");

    // If logged in as admin or teacher, reveal upload elements, edit controls, and add topic buttons
    if (userRole === "admin" || userRole === "teacher") {
        document.querySelectorAll(".card-upload-box").forEach(el => el.style.display = "block");
        document.querySelectorAll(".admin-controls").forEach(el => el.style.display = "flex");
        document.querySelectorAll(".add-topic-container").forEach(el => el.style.display = "block");
    }

    // Load any saved custom changes from localStorage
    loadSavedNotesData();

    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.card');

            // If user types something, make sure all course note sections are visible for search results
            if (query.length > 0) {
                document.querySelectorAll('.notes-content').forEach(section => {
                    section.style.display = 'block';
                });
            }

            // Filter individual topic cards
            cards.forEach(card => {
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
                const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';

                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// --- ADMIN / TEACHER CAPABILITIES (ADD, EDIT, DELETE, UPLOAD) ---

// 1. Add New Topic Card
function addNewTopicCard(courseKey) {
    const title = prompt("Enter Topic Title (e.g., Advanced Excel):");
    if (!title) return;
    const desc = prompt("Enter Topic Description / Subpoints:");
    if (!desc) return;
    const fileName = prompt("Enter PDF file name (e.g., advanced-excel.pdf):", "notes.pdf");
    if (!fileName) return;

    const box = document.getElementById('box-' + courseKey);
    const uniqueId = courseKey + '-' + Date.now();

    const cardHTML = `
        <div class="card" data-id="${uniqueId}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <a href="notes/${courseKey}/${fileName}" class="download" target="_blank">Download PDF</a>
            <div class="card-upload-box" style="display: block;">
                <input type="file" class="card-file-input" accept=".pdf" style="font-size: 11px; width: 100%; margin-bottom: 5px;">
                <button type="button" onclick="uploadCardFile(this, 'notes/${courseKey}', '${fileName}')" style="background: #28a745; color: white; border: none; padding: 4px 8px; font-size: 11px; border-radius: 3px; cursor: pointer; font-weight: bold;">Upload / Replace PDF</button>
            </div>
            <div class="admin-controls" style="display: flex;">
                <button class="btn-edit" onclick="enableEditCard(this)">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteCard(this)">🗑️ Delete</button>
            </div>
        </div>
    `;

    box.insertAdjacentHTML('beforeend', cardHTML);
    saveAllNotesToStorage();
    alert("✅ New topic added successfully!");
}

// 2. Enable Inline Editing for Title and Subpoints
function enableEditCard(btn) {
    const card = btn.closest('.card');
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');

    if (btn.textContent.includes("Edit")) {
        h3.innerHTML = `<input type="text" class="edit-title" value="${h3.textContent}" style="width:100%; padding:4px;">`;
        p.innerHTML = `<textarea class="edit-desc" style="width:100%; padding:4px; height:60px;">${p.textContent}</textarea>`;
        btn.innerHTML = "💾 Save";
        btn.style.background = "#28a745";
        btn.style.color = "#fff";
    } else {
        const newTitle = card.querySelector('.edit-title').value;
        const newDesc = card.querySelector('.edit-desc').value;

        h3.textContent = newTitle;
        p.textContent = newDesc;
        btn.innerHTML = "✏️ Edit";
        btn.style.background = "#ffc107";
        btn.style.color = "#000";

        saveAllNotesToStorage();
        alert("✅ Changes saved successfully!");
    }
}

// 3. Delete Topic Card
function deleteCard(btn) {
    if (confirm("⚠️ Are you sure you want to delete this topic card?")) {
        const card = btn.closest('.card');
        card.remove();
        saveAllNotesToStorage();
        alert("🗑️ Topic deleted successfully!");
    }
}

// 4. LocalStorage Persistence Functions
function saveAllNotesToStorage() {
    const data = {};
    const courses = ['dca', 'dcat', 'adca', 'dtp', 'programming'];

    courses.forEach(course => {
        const box = document.getElementById('box-' + course);
        if (box) {
            data[course] = box.innerHTML;
        }
    });

    localStorage.setItem("scolex_notes_data", JSON.stringify(data));
}

function loadSavedNotesData() {
    const saved = localStorage.getItem("scolex_notes_data");
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(course => {
                const box = document.getElementById('box-' + course);
                if (box && data[course]) {
                    box.innerHTML = data[course];
                }
            });
        } catch (e) {
            console.error("Error loading saved notes data", e);
        }
    }
}

// 5. Individual Card File Uploader Handler
async function uploadCardFile(btn, folder, targetFilename) {
    const card = btn.closest('.card');
    const fileInput = card.querySelector('.card-file-input');
    
    if (!fileInput || fileInput.files.length === 0) {
        alert("⚠️ Please select a PDF file first!");
        return;
    }
    
    const file = fileInput.files[0];
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwmXoG-dn-AV1kxcQWgBjXkdzRLAGrbzFasnlBB3yrXO9qHjc0_afwh636Qzk_ybD3n/exec"; // Replace with your deployment URL
    
    const originalText = btn.innerText;
    btn.innerText = "Uploading...";
    btn.disabled = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
        const base64Content = reader.result.split(",")[1];

        const payload = {
            filename: targetFilename,
            content: base64Content,
            folder: folder
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.status === "success") {
                alert(`✅ Successfully updated "${targetFilename}" in ${folder}!`);
                fileInput.value = "";
            } else {
                alert("❌ Error: " + (result.message || "Upload failed"));
            }
        } catch (error) {
            console.error(error);
            alert("❌ Network connection error with Apps Script backend.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}