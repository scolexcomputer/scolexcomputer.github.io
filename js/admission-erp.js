// ==========================================
// Google Apps Script Web App Deployment URL
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySTUe1nxJUiUYCVoBOFkupC2GfZiQRh9kTOh4pKbR_iqa595brY4uRxpgSc4KWA4pW/exec"; 

let admissionsList = [];
let currentSelectedInstallment = 0;
let selectedPaymentMethod = "Cash";

// Default Fee Matrix per Course
const COURSE_FEE_STRUCTURE = {
    "DCA": 3500,
    "ADCA": 5500,
    "DTP": 4000,
    "TALLY WITH GST": 4500,
    "Python": 6000,
    "HTML & CSS": 3000
};

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

function normalizeAdmissionRecord(item) {
    let computedAdmissionMode = item.admissionMode;

    if (computedAdmissionMode === "Approved" || computedAdmissionMode === "Pending" || computedAdmissionMode === "Rejected") {
        computedAdmissionMode = null;
    }

    const role = (item.role || "").toLowerCase();
    const source = (item.source || "").toLowerCase();

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
        computedAdmissionMode = "Online";
    }

    return {
        ...item,
        learningmode: item.learningmode || "Offline",
        admissionMode: computedAdmissionMode,
        status: item.status || "Pending",
        feePaid: item.feePaid || "",
        totalFee: item.totalFee || "",
        dueFee: item.dueFee || "",
        paymentStatus: item.paymentStatus || "Pending"
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
                learningmode: "Offline",
                admissionMode: "Online",
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
                status: "Pending",
                feePaid: "2000",
                totalFee: "5000",
                dueFee: "3000",
                paymentStatus: "Part Paid"
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

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
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
// 6. Dynamic Search and Filtering
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

function setElementText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val !== undefined ? val : "-";
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

    setFieldValue("feePaid", student.feePaid);
    setFieldValue("totalFee", student.totalFee);
    setFieldValue("dueFee", student.dueFee);
    setFieldValue("paymentStatus", student.paymentStatus);

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
        const docUrl = student.aadhaarURL;
        aadhaarBox.innerHTML = (docUrl && docUrl.startsWith("http")) 
            ? `<a href="${docUrl}" target="_blank" class="btn-doc-link">👁️ View ID Document</a>` 
            : '<span style="color:#94a3b8; font-size:12px;">Not Uploaded</span>';
    }
}

function viewStudentDetails(index) {
    const student = admissionsList[index];
    if (!student) return;

    const listSection = document.getElementById("studentListSection");
    if (listSection) listSection.style.display = "none";

    populateForm(student, index);
    populateFeeDetails(student);
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

function closeDetailPanel() {
    const detailPanel = document.getElementById("detailPanel");
    if (detailPanel) detailPanel.style.display = "none";

    const listSection = document.getElementById("studentListSection");
    if (listSection) {
        listSection.style.display = "block";
        listSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// Dynamic Fee & Payment Engine Integration
// ==========================================
function getOrdinalSuffix(i) {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
}

function populateFeeDetails(student) {
    if (!student) return;

    const baseFee = COURSE_FEE_STRUCTURE[student.courses] || Number(student.totalFee) || 5500;
    student.totalFee = student.totalFee || baseFee;
    student.discount = student.discount || 0;

    if (!student.installments || student.installments.length === 0) {
        const instCount = 5;
        const netFee = student.totalFee - student.discount;
        const perInstAmount = Math.round(netFee / instCount);
        student.installments = [];
        
        const baseDueDate = new Date(2026, 7, 30);

        for (let i = 1; i <= instCount; i++) {
            const dueDate = new Date(baseDueDate);
            dueDate.setMonth(dueDate.getMonth() + (i - 1));

            student.installments.push({
                no: i,
                name: `${i}${getOrdinalSuffix(i)} Installment`,
                scheduledAmount: (i === instCount) ? (netFee - (perInstAmount * (instCount - 1))) : perInstAmount,
                paidAmount: 0,
                status: "Pending",
                dueDate: dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            });
        }
    }

    if (!student.paymentHistory) student.paymentHistory = [];

    setElementText("feeStudentName", student.fullname || "");
    setElementText("feeStudentIdDisplay", student.appId || student.studentId || "");
    setElementText("feeCourseDisplay", student.courses || "");
    setElementText("feeInstallmentsCount", student.installments.length);

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById("payDateInput");
    if (dateInput) dateInput.value = today;

    refreshScolexUI(student);
}

function refreshScolexUI(student) {
    const totalFee = Number(student.totalFee) || 5500;
    let totalPaid = 0;
    student.paymentHistory.forEach(p => totalPaid += Number(p.amount || 0));

    const pendingAmount = Math.max(0, totalFee - totalPaid);
    const activeInst = student.installments[currentSelectedInstallment] || student.installments[0];

    setElementText("feeTotalAmount", `₹ ${totalFee.toLocaleString('en-IN')}`);
    setElementText("feeTotalWords", `(${numberToWords(totalFee)} Rupees Only)`);
    setElementText("feePaidAmount", `₹ ${totalPaid.toLocaleString('en-IN')}`);
    setElementText("feeDueAmount", `₹ ${pendingAmount.toLocaleString('en-IN')}`);
    setElementText("feeNextDue", `₹ ${Math.max(0, activeInst.scheduledAmount - activeInst.paidAmount).toLocaleString('en-IN')}`);
    setElementText("feeLastDate", student.installments[student.installments.length - 1].dueDate);

    renderInstallmentOverviewList(student);
    renderStepperTabs(student);
    renderPaymentHistoryTable(student);
    selectStepperStep(currentSelectedInstallment, student);
}

function renderInstallmentOverviewList(student) {
    const container = document.getElementById("installmentOverviewList");
    if (!container) return;

    container.innerHTML = "";
    student.installments.forEach(inst => {
        const item = document.createElement("div");
        item.className = "overview-item";
        item.innerHTML = `
            <div>
                <span class="ov-title">${inst.name}</span>
                <span class="ov-date">${inst.dueDate}</span>
            </div>
            <strong style="font-size:0.8rem;">₹ ${inst.scheduledAmount.toLocaleString('en-IN')}</strong>
            <span class="badge-pill ${inst.status.toLowerCase()}">${inst.status.toUpperCase()}</span>
        `;
        container.appendChild(item);
    });
}

// ==========================================
// Google Sheet Synced Payment History Renderer
// ==========================================
function renderPaymentHistoryTable(student) {
    const tbody = document.getElementById("paymentHistoryTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const history = student.paymentHistory || [];

    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="16" style="text-align:center; padding: 15px; color: #64748b;">No transaction history recorded yet.</td></tr>`;
        return;
    }

    let cumulativePaid = 0;
    const totalFee = Number(student.totalFee) || 5500;

    history.forEach((tx, idx) => {
        const amountPaid = Number(tx.amount || 0);
        cumulativePaid += amountPaid;
        const remainingBalance = Math.max(0, totalFee - cumulativePaid);

        tbody.innerHTML += `
            <tr>
                <td>${tx.timestamp || student.timestamp || '-'}</td>
                <td><strong>${tx.receiptNo || '-'}</strong></td>
                <td>${student.appId || student.studentId || '-'}</td>
                <td>${student.fullname || '-'}</td>
                <td>${student.courses || '-'}</td>
                <td>₹ ${amountPaid.toLocaleString('en-IN')}</td>
                <td>${tx.method || 'Cash'}</td>
                <td>${tx.date || '-'}</td>
                <td><span class="badge-pill paid">Paid</span></td>
                <td>${tx.installmentName || `Installment ${idx + 1}`}</td>
                <td>₹ ${totalFee.toLocaleString('en-IN')}</td>
                <td>₹ ${cumulativePaid.toLocaleString('en-IN')}</td>
                <td>₹ ${remainingBalance.toLocaleString('en-IN')}</td>
                <td>${tx.txnId || '-'}</td>
                <td>${localStorage.getItem("userName") || 'ERP User'}</td>
                <td>${tx.remarks || 'Installment Payment'}</td>
            </tr>
        `;
    });
}

function renderStepperTabs(student) {
    const container = document.getElementById("stepperTabsContainer");
    if (!container) return;

    container.innerHTML = "";
    student.installments.forEach((inst, idx) => {
        const step = document.createElement("div");
        step.className = `stepper-step ${inst.status.toLowerCase()} ${idx === currentSelectedInstallment ? 'active' : ''}`;
        step.onclick = () => {
            currentSelectedInstallment = idx;
            refreshScolexUI(student);
        };
        step.innerHTML = `
            <div class="step-circle">${inst.no}</div>
            <span class="step-name">${inst.name}</span>
            <span class="step-amount">₹ ${inst.scheduledAmount.toLocaleString('en-IN')}</span>
            <span class="badge-pill ${inst.status.toLowerCase()}" style="margin-top:3px;">${inst.status.toUpperCase()}</span>
        `;
        container.appendChild(step);
    });
}

function selectStepperStep(index, student) {
    const inst = student.installments[index];
    if (!inst) return;

    setElementText("activeInstallmentTitle", `INSTALLMENT ${inst.no} OF ${student.installments.length}`);
    setElementText("instDueDate", inst.dueDate);

    setElementText("curInstNo", inst.name);
    setElementText("curInstAmount", `₹ ${inst.scheduledAmount.toLocaleString('en-IN')}`);
    setElementText("curInstDueDate", inst.dueDate);
    
    const statusBadge = document.getElementById("curInstStatusBadge");
    if (statusBadge) {
        statusBadge.innerText = inst.status.toUpperCase();
        statusBadge.className = `badge-pill ${inst.status.toLowerCase()}`;
    }

    const dueAmount = Math.max(0, inst.scheduledAmount - inst.paidAmount);
    setElementText("curInstToPay", `₹ ${dueAmount.toLocaleString('en-IN')}`);

    const payInput = document.getElementById("payAmountInput");
    if (payInput) payInput.value = dueAmount;

    const prevTbody = document.getElementById("prevPaymentTableBody");
    let totalPrev = 0;
    if (prevTbody) {
        prevTbody.innerHTML = "";
        student.installments.slice(0, index).forEach(prevInst => {
            if (prevInst.paidAmount > 0) {
                totalPrev += prevInst.paidAmount;
                prevTbody.innerHTML += `
                    <tr>
                        <td>${prevInst.name}</td>
                        <td>${prevInst.paidDate || '-'}</td>
                        <td>${prevInst.paidAmount.toLocaleString('en-IN')}</td>
                        <td><span class="badge-pill paid">Paid</span></td>
                    </tr>
                `;
            }
        });
        if (prevTbody.innerHTML === "") {
            prevTbody.innerHTML = `<tr><td colspan="4" style="color:#64748b; text-align:center;">No previous payment</td></tr>`;
        }
    }
    setElementText("totalPrevPaidText", `₹ ${totalPrev.toLocaleString('en-IN')}`);

    updateReceiptPreview(student, inst, totalPrev);
}

function selectPaymentMethod(btn, method) {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPaymentMethod = method;
}

async function processInstallmentPayment() {
    const index = document.getElementById("recordIndex")?.value;
    if (index === "" || index === undefined) return;

    const student = admissionsList[index];
    const inst = student.installments[currentSelectedInstallment];

    const inputAmount = Number(document.getElementById("payAmountInput").value);
    const dateVal = document.getElementById("payDateInput").value;
    const txnId = document.getElementById("payTxnIdInput").value.trim() || `CASH/${Math.floor(100 + Math.random() * 900)}`;

    if (isNaN(inputAmount) || inputAmount <= 0) {
        alert("⚠️ Please enter a valid payment amount.");
        return;
    }

    const previousDueForThisInst = inst.scheduledAmount - inst.paidAmount;
    const difference = inputAmount - previousDueForThisInst;

    inst.paidAmount += inputAmount;
    inst.status = inst.paidAmount >= inst.scheduledAmount ? "Paid" : "Partial";
    inst.paidDate = dateVal ? new Date(dateVal).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : inst.dueDate;
    inst.txnId = txnId;

    if (difference !== 0 && currentSelectedInstallment + 1 < student.installments.length) {
        const nextInst = student.installments[currentSelectedInstallment + 1];
        nextInst.scheduledAmount -= difference;
        if (nextInst.scheduledAmount < 0) nextInst.scheduledAmount = 0;
    }

    const receiptNo = `SCC/REC/2026-27/${String(student.paymentHistory.length + 25).padStart(5, '0')}`;
    const totalCourseFee = Number(student.totalFee) || 5500;
    
    let cumulativePaid = 0;
    student.paymentHistory.forEach(p => cumulativePaid += Number(p.amount || 0));
    cumulativePaid += inputAmount;
    const remainingBalance = Math.max(0, totalCourseFee - cumulativePaid);

    const paymentPayload = {
        action: "addFee",
        ReceiptNo: receiptNo,
        AppID: student.appId || student.studentId || "",
        StudentName: student.fullname || "",
        Course: student.courses || "",
        AmountPaid: inputAmount,
        PaymentMode: selectedPaymentMethod || "Cash",
        PaymentDate: dateVal || new Date().toISOString().split('T')[0],
        Status: "Paid",
        InstallmentNo: inst.no,
        TotalCourseFee: totalCourseFee,
        TotalPaidToDate: cumulativePaid,
        RemainingBalance: remainingBalance,
        TransactionID_Ref: txnId,
        EntryBy: localStorage.getItem("userName") || "Admin",
        Remarks: "ERP Fee Collection"
    };

    student.paymentHistory.push({
        timestamp: new Date().toISOString(),
        receiptNo: receiptNo,
        installmentName: inst.name,
        amount: inputAmount,
        method: selectedPaymentMethod,
        txnId: txnId,
        date: inst.paidDate,
        remarks: "Installment Cleared"
    });

    localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));

    // Sync payment data to Google Sheets fees sheet backend
    if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentPayload)
            });
        } catch (err) {
            console.error("Failed to sync fee data with Google Sheets:", err);
        }
    }

    alert(`✅ Success! Marked ${inst.name} as Paid and synced to Google Sheets.`);
    refreshScolexUI(student);
}

function updateReceiptPreview(student, activeInst, totalPrev) {
    const lastPayment = student.paymentHistory[student.paymentHistory.length - 1] || {};
    const amountPaidNow = lastPayment.amount || Math.max(0, activeInst.scheduledAmount - (activeInst.paidAmount - (lastPayment.amount || 0)));

    setElementText("recReceiptNo", lastPayment.receiptNo || "SCC/REC/2026-27/00025");
    setElementText("recDate", lastPayment.date || "29 Aug 2026");
    setElementText("recStudentName", student.fullname || "");
    setElementText("recStudentId", student.appId || student.studentId || "");
    setElementText("recFatherName", student.fathername || "");
    setElementText("recCourse", student.courses || "");
    setElementText("recMobile", student.mobile || "");
    setElementText("recAddress", [student.address, student.city].filter(Boolean).join(", ") || "");

    setElementText("recInstNo", `${activeInst.name} (of ${student.installments.length})`);
    setElementText("recInstAmount", `₹ ${activeInst.scheduledAmount.toLocaleString('en-IN')}`);
    setElementText("recPrevPayment", `₹ ${totalPrev.toLocaleString('en-IN')}`);
    setElementText("recTotalPaidNow", `₹ ${(totalPrev + amountPaidNow).toLocaleString('en-IN')}`);
    setElementText("recPayDate", lastPayment.date || "29 Aug 2026");
    setElementText("recPayMode", (selectedPaymentMethod || "CASH").toUpperCase());
    setElementText("recTxnNo", lastPayment.txnId || "CASH/025");

    setElementText("recAmountPaidBox", `₹ ${amountPaidNow.toLocaleString('en-IN')}`);
    setElementText("recAmountWords", `(Rupees ${numberToWords(amountPaidNow)} Only)`);
}

function numberToWords(num) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim();
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
        state: getFieldValue("state"),
        feePaid: getFieldValue("feePaid"),
        totalFee: getFieldValue("totalFee"),
        dueFee: getFieldValue("dueFee"),
        paymentStatus: getFieldValue("paymentStatus")
    };

    localStorage.setItem("scolexAdmissions", JSON.stringify(admissionsList));
    alert("✅ ERP Student Record & Fee details updated successfully!");

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