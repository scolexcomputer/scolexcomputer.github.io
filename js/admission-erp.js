// ==========================================
// Google Apps Script Web App Deployment URL
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzK1ngZb-H6GtaS4fpcXAQFuT23faj2-bcvOAb5x6nnlinZw3Qdwvyuylylwi06FcP2/exec"; 

let admissionsList = [];

document.addEventListener("DOMContentLoaded", function () {
    checkRolePermissions();
    initializeProfileBar();
    fetchAdmissionData();
});

// ==========================================
// 1. Session & Role-Based Permissions
// ==========================================
function checkRolePermissions() {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || (userRole !== "admin" && userRole !== "teacher" && userRole !== "staff")) {
        alert("⚠️ Access Restricted! Authorized login required for Admission ERP.");
        window.location.href = "login.html";
    }
}

function initializeProfileBar() {
    const userName = localStorage.getItem("userName") || "ERP User";
    const userRole = localStorage.getItem("userRole") || "Staff";
    
    const profileBar = document.getElementById("homeProfileBar");
    const nameEl = document.getElementById("profileName");
    const detailsEl = document.getElementById("profileDetails");

    if (profileBar && nameEl) {
        nameEl.innerText = userName;
        if (detailsEl) detailsEl.innerText = `[ Role: ${userRole.toUpperCase()} ]`;
        profileBar.style.display = "flex";
    }
}

function scolexLogout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
}

// ==========================================
// 2. Fetch Data (Google Sheets + LocalStorage Fallback)
// ==========================================
async function fetchAdmissionData() {
    showTableLoading("⌛ Fetching live admission records from Google Sheets...");

    if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=read`);
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                admissionsList = result.data.map(item => normalizeAdmissionRecord(item));
                localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));
                renderTable(admissionsList);
                updateStats();
                return;
            }
        } catch (error) {
            console.warn("Google Sheet API fetch failed. Loading offline storage...", error);
        }
    }

    loadLocalFallbackData();
}

function fetchSheetAdmissions() {
    fetchAdmissionData();
}

// Normalize record: Determines Admission Mode based on entry origin/role rules
// - Public / Student Portal / No Login = "Online"
// - Admin / Teacher Login Entry = "Offline"
function normalizeAdmissionRecord(item) {
    let computedAdmissionMode = item.admissionMode;

    // Clear admissionMode if it accidentally received application status strings
    if (computedAdmissionMode === "Approved" || computedAdmissionMode === "Pending" || computedAdmissionMode === "Rejected") {
        computedAdmissionMode = null;
    }

    const role = (item.role || "").toLowerCase();
    const source = (item.source || "").toLowerCase();

    // Check if entry was created by Admin or Teacher session
    if (
        role === "admin" || 
        role === "teacher" || 
        role === "staff" ||
        source.includes("admin") || 
        source.includes("teacher") || 
        source.includes("staff") ||
        source.includes("offline")
    ) {
        computedAdmissionMode = "Offline";
    } else if (!computedAdmissionMode) {
        // Default public / student submissions count as Online admission
        computedAdmissionMode = "Online";
    }

    return {
        ...item,
        learningmode: item.learningmode || "Offline",
        admissionMode: computedAdmissionMode,
        status: item.status || "Pending" // Keep approval status strictly in the status field
    };
}

function loadLocalFallbackData() {
    const storedData = localStorage.getItem("scolexAdmissions");
    
    if (storedData) {
        admissionsList = JSON.parse(storedData).map(item => normalizeAdmissionRecord(item));
    } else {
        admissionsList = [
            normalizeAdmissionRecord({
                rowId: 2,
                timestamp: "2026-08-25T10:50:52.034Z",
                appId: "SCC20260825162044",
                fullname: "MD SHAHNAWAZ",
                fathername: "MD MERAJUDDIN",
                mobile: "8298952044",
                email: "shahnawaz.taz@gmail.com",
                dob: "1999-01-19T18:30:00.000Z",
                gender: "Male",
                nationality: "Indian",
                category: "General",
                aadharnumber: "********678",
                education: "12th",
                college: "NITISHWAR COLLEGE MUZAFFARPUR",
                board: "BSEB, PATNA",
                passingyear: "2018",
                percentage: "53.4",
                division: "Second Division",
                subjects: "SCIENCE",
                courses: "ADCA",
                batch: "Morning (7 AM - 9 AM)",
                learningmode: "Offline", // Study mode preference
                admissionMode: "Online", // Submitted via public online portal
                preferredcontact: "Phone",
                address: "PREMI CHHARPA, BISHUNPUR MAHANAND, KANTI",
                pincode: "843109",
                district: "MUZAFFARPUR",
                state: "BIHAR",
                city: "MUZAFFARPUR",
                referral: "Friend / Family",
                photoURL: "https://drive.google.com/file/d/1WSQh3hZTpxPNjg8gC_Gi1lZmozanpgfp/view?usp=drivesdk",
                signURL: "https://drive.google.com/file/d/1ItRVOVD1CxU1MLTVywwF0UbGV8uPZWG5/view?usp=drivesdk",
                marksheetURL: "https://drive.google.com/file/d/1dQS_xSYrmdrwl7nwZl_QHCUtASGSNojk/view?usp=drivesdk",
                aadhaarURL: "https://drive.google.com/file/d/1vJVSC7_7rGTIyMvzvAj3Oe0Slk8ettqd/view?usp=drivesdk",
                status: "Pending"
            })
        ];
        localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));
    }

    renderTable(admissionsList);
    updateStats();
}

// ==========================================
// 3. Update Dashboard Stats
// ==========================================
function updateStats() {
    const totalEl = document.getElementById("totalStudentsCount");
    const approvedEl = document.getElementById("approvedCount");
    const pendingEl = document.getElementById("pendingCount");
    const rejectedEl = document.getElementById("rejectedCount");

    if (totalEl) totalEl.innerText = admissionsList.length;
    if (approvedEl) approvedEl.innerText = admissionsList.filter(a => a.status === 'Approved').length;
    if (pendingEl) pendingEl.innerText = admissionsList.filter(a => (!a.status || a.status === 'Pending')).length;
    if (rejectedEl) rejectedEl.innerText = admissionsList.filter(a => a.status === 'Rejected').length;
}

// ==========================================
// 4. ERP Tab Switching Functionality
// ==========================================
function switchErpTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetPane = document.getElementById(`tab-${tabName}`);
    if (targetPane) targetPane.classList.add('active');

    event.currentTarget.classList.add('active');
}

// ==========================================
// 5. Render Table UI
// ==========================================
function renderTable(data) {
    const tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const userRole = localStorage.getItem("userRole");

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">No student admission records found.</td></tr>`;
        return;
    }

    data.forEach((student, index) => {
        const tr = document.createElement("tr");
        const appId = student.appId || student.studentId || `SCC-${index + 1}`;
        
        // Strict mapping: display only "Offline" or "Online" in the Mode column
        const displayMode = (student.admissionMode === "Offline") ? "Offline" : "Online";

        tr.innerHTML = `
            <td><strong>${appId}</strong></td>
            <td>${student.fullname || ''}</td>
            <td>${student.courses || ''}</td>
            <td>${student.mobile || ''}</td>
            <td><span class="badge">${displayMode}</span></td>
            <td>${student.batch || ''}</td>
            <td>
                <button class="action-btn btn-view" onclick="viewStudentDetails(${index})">👁️ View</button>
                ${userRole === "admin" ? `
                    <button class="action-btn btn-edit" onclick="editStudentDetails(${index})">✏️ Edit</button>
                ` : ''}
                <select class="action-select" style="margin-left:5px; padding:4px;" onchange="updateApplicationStatus(${index}, this.value)">
                    <option value="Pending" ${(student.status || 'Pending') === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Approved" ${student.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    <option value="Rejected" ${student.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showTableLoading(message) {
    const tbody = document.getElementById("studentTableBody");
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">${message}</td></tr>`;
    }
}

// ==========================================
// 6. Dynamic Search and Filtering (Mode Filter checks Admission Mode)
// ==========================================
function filterRecords() {
    const searchVal = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
    const courseVal = document.getElementById("courseFilter")?.value || "";
    const modeVal = document.getElementById("modeFilter")?.value || "";

    const filtered = admissionsList.filter(item => {
        const idStr = (item.appId || item.studentId || "").toLowerCase();
        const nameStr = (item.fullname || "").toLowerCase();
        const mobileStr = (item.mobile || "").toString();

        const matchesSearch = searchVal === "" || 
            nameStr.includes(searchVal) || 
            idStr.includes(searchVal) || 
            mobileStr.includes(searchVal);

        const matchesCourse = courseVal === "" || item.courses === courseVal;
        
        // Mode filter works strictly on Admission Mode as requested
        const matchesMode = modeVal === "" || (item.admissionMode || "").toLowerCase() === modeVal.toLowerCase();

        return matchesSearch && matchesCourse && matchesMode;
    });

    renderTable(filtered);
}

// ==========================================
// 7. View & Edit Student Details Panel
// ==========================================
function setFieldValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
}

function getDriveDirectUrl(url) {
    if (!url) return "";
    let fileId = "";
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
        fileId = matchD[1];
    } else {
        const matchId = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (matchId && matchId[1]) {
            fileId = matchId[1];
        }
    }
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=s1000`;
    }
    return url;
}

function formatReadableDate(dateStr) {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    } catch(e) {
        return dateStr;
    }
}

function populateForm(student, index) {
    setFieldValue("recordIndex", index);
    renderRightSideMedia(student);

    setFieldValue("timestamp", student.timestamp);
    setFieldValue("studentId", student.appId || student.studentId);
    setFieldValue("fullname", student.fullname);
    setFieldValue("fathername", student.fathername);
    setFieldValue("mobile", student.mobile);
    setFieldValue("email", student.email);
    setFieldValue("dob", formatReadableDate(student.dob));
    setFieldValue("gender", student.gender || "Male");
    setFieldValue("nationality", student.nationality || "Indian");
    setFieldValue("category", student.category || "General");
    
    setFieldValue("education", student.education);
    setFieldValue("college", student.college);
    setFieldValue("board", student.board);
    setFieldValue("passingyear", student.passingyear);
    setFieldValue("percentage", student.percentage);
    setFieldValue("division", student.division);
    setFieldValue("subjects", student.subjects);

    setFieldValue("courses", student.courses || "ADCA");
    setFieldValue("batch", student.batch || "Morning (7 AM - 9 AM)");
    setFieldValue("learningmode", student.learningmode || "Offline");
    setFieldValue("admissionMode", student.admissionMode || "Online");
    setFieldValue("preferredcontact", student.preferredcontact || "Phone");
    setFieldValue("referral", student.referral);

    setFieldValue("address", student.address);
    setFieldValue("pincode", student.pincode);
    setFieldValue("city", student.city);
    setFieldValue("district", student.district);
    setFieldValue("state", student.state);

    renderBottomDocuments(student);
}

function renderRightSideMedia(student) {
    const photoImg = document.getElementById("studentPhotoImg");
    const signImg = document.getElementById("studentSignImg");
    const photoLinkBox = document.getElementById("photoLinkBox");
    const signLinkBox = document.getElementById("signLinkBox");

    const photoSrc = getDriveDirectUrl(student.photoURL);
    const signSrc = getDriveDirectUrl(student.signURL);

    if (photoImg) photoImg.src = photoSrc || "https://via.placeholder.com/150?text=No+Photo";
    if (photoLinkBox) {
        photoLinkBox.innerHTML = student.photoURL 
            ? `<a href="${student.photoURL}" target="_blank" class="btn-doc-link" style="display:inline-block; font-size:11px; padding:4px 8px;">Open Full Photo</a>` 
            : '<span style="color:#94a3b8; font-size:11px;">Not Uploaded</span>';
    }

    if (signImg) signImg.src = signSrc || "https://via.placeholder.com/150?text=No+Signature";
    if (signLinkBox) {
        signLinkBox.innerHTML = student.signURL 
            ? `<a href="${student.signURL}" target="_blank" class="btn-doc-link" style="display:inline-block; font-size:11px; padding:4px 8px;">Open Full Sign</a>` 
            : '<span style="color:#94a3b8; font-size:11px;">Not Uploaded</span>';
    }
}

function renderBottomDocuments(student) {
    const marksheetBox = document.getElementById("marksheetActionBox");
    const aadhaarBox = document.getElementById("aadhaarActionBox");

    if (marksheetBox) {
        marksheetBox.innerHTML = student.marksheetURL 
            ? `<a href="${student.marksheetURL}" target="_blank" class="btn-doc-link">👁️ View Marksheet</a>` 
            : '<span style="color:#94a3b8; font-size:12px;">Not Uploaded</span>';
    }

    if (aadhaarBox) {
        const docUrl = student.aadhaarURL || student.aadharnumber;
        aadhaarBox.innerHTML = (docUrl && docUrl.startsWith("http")) 
            ? `<a href="${docUrl}" target="_blank" class="btn-doc-link">👁️ View ID Document</a>` 
            : '<span style="color:#94a3b8; font-size:12px;">Not Uploaded</span>';
    }
}

function viewStudentDetails(index) {
    const student = admissionsList[index];
    if (!student) return;

    populateForm(student, index);
    switchErpTab('admission');
    
    document.querySelectorAll('.tab-btn').forEach((b, idx) => {
        if(idx === 0) b.classList.add('active');
        else b.classList.remove('active');
    });

    const panelTitle = document.getElementById("panelTitle");
    if (panelTitle) {
        panelTitle.innerText = `📋 Viewing ERP Record: ${student.fullname || ''} (${student.appId || student.studentId || ''})`;
    }
    
    toggleFormInputs(true);
    
    const saveActions = document.getElementById("saveActions");
    if (saveActions) saveActions.style.display = "none";
    
    const userRole = localStorage.getItem("userRole");
    const editBtn = document.getElementById("editToggleBtn");
    if (editBtn) editBtn.style.display = userRole === "admin" ? "inline-block" : "none";

    const detailPanel = document.getElementById("detailPanel");
    if (detailPanel) {
        detailPanel.style.display = "block";
        detailPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

function editStudentDetails(index) {
    viewStudentDetails(index);
    enableEditMode();
}

function enableEditMode() {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
        alert("⚠️ Only Admins are permitted to edit student admission records.");
        return;
    }
    toggleFormInputs(false);
    
    const saveActions = document.getElementById("saveActions");
    if (saveActions) saveActions.style.display = "block";
}

function cancelEditMode() {
    const index = document.getElementById("recordIndex")?.value;
    if (index !== undefined && index !== "") {
        viewStudentDetails(index);
    }
}

function toggleFormInputs(readOnlyState) {
    const inputs = document.querySelectorAll("#erpRecordForm input");
    const selects = document.querySelectorAll("#erpRecordForm select");

    inputs.forEach(input => {
        if (input.id !== "studentId" && input.id !== "timestamp") {
            input.readOnly = readOnlyState;
        }
    });
    selects.forEach(select => select.disabled = readOnlyState);
}

function closeDetailPanel() {
    const detailPanel = document.getElementById("detailPanel");
    if (detailPanel) detailPanel.style.display = "none";
}

// ==========================================
// 8. Save Record Updates
// ==========================================
function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

async function saveAdmissionRecord() {
    const index = getFieldValue("recordIndex");
    if (index === "" || index === undefined) return;

    admissionsList[index] = {
        ...admissionsList[index],
        fullname: getFieldValue("fullname"),
        fathername: getFieldValue("fathername"),
        mobile: getFieldValue("mobile"),
        email: getFieldValue("email"),
        dob: getFieldValue("dob"),
        gender: getFieldValue("gender"),
        nationality: getFieldValue("nationality"),
        category: getFieldValue("category"),
        education: getFieldValue("education"),
        college: getFieldValue("college"),
        board: getFieldValue("board"),
        passingyear: getFieldValue("passingyear"),
        percentage: getFieldValue("percentage"),
        division: getFieldValue("division"),
        subjects: getFieldValue("subjects"),
        courses: getFieldValue("courses"),
        batch: getFieldValue("batch"),
        learningmode: getFieldValue("learningmode"),
        admissionMode: getFieldValue("admissionMode"),
        preferredcontact: getFieldValue("preferredcontact"),
        referral: getFieldValue("referral"),
        address: getFieldValue("address"),
        pincode: getFieldValue("pincode"),
        city: getFieldValue("city"),
        district: getFieldValue("district"),
        state: getFieldValue("state")
    };

    localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));
    alert("✅ ERP Student Record updated successfully!");

    renderTable(admissionsList);
    updateStats();
    viewStudentDetails(index);
}

async function updateApplicationStatus(index, newStatus) {
    const student = admissionsList[index];
    if (!student) return;

    student.status = newStatus;
    localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));
    updateStats();

    if (student.rowId && GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        try {
            await fetch(`${GOOGLE_SCRIPT_URL}?action=update&rowId=${student.rowId}&status=${encodeURIComponent(newStatus)}`);
        } catch (err) {
            console.error("Failed to sync status update with Google Sheet:", err);
        }
    }
}