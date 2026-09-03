// =====================================
// Google Apps Script Web App URL
// =====================================
const scriptURL = "https://script.google.com/macros/s/AKfycbySTUe1nxJUiUYCVoBOFkupC2GfZiQRh9kTOh4pKbR_iqa595brY4uRxpgSc4KWA4pW/exec";

let currentStep = 1;
const totalSteps = 6;

const stepIndicatorText = document.getElementById("stepIndicatorText");
const stepTitles = [
    "Step 1 of 6: Personal Information",
    "Step 2 of 6: Educational Details",
    "Step 3 of 6: Course Details",
    "Step 4 of 6: Address Details",
    "Step 5 of 6: Upload Documents & Info",
    "Step 6 of 6: Review Application (Preview)"
];

// Populate Date Dropdowns for Mobile Friendly Input
function populateDateDropdowns() {
    const daySelect = document.getElementById("dob-day");
    const monthSelect = document.getElementById("dob-month");
    const yearSelect = document.getElementById("dob-year");

    if (!daySelect) return;

    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement("option");
        opt.value = i < 10 ? "0" + i : i;
        opt.innerHTML = i < 10 ? "0" + i : i;
        daySelect.appendChild(opt);
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < months.length; i++) {
        let opt = document.createElement("option");
        opt.value = i + 1 < 10 ? "0" + (i + 1) : i + 1;
        opt.innerHTML = months[i];
        monthSelect.appendChild(opt);
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 70; i--) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = i;
        yearSelect.appendChild(opt);
    }
}
populateDateDropdowns();

function showStep(step) {
    document.querySelectorAll(".form-step").forEach((el, index) => {
        if (index + 1 === step) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });
    stepIndicatorText.innerText = stepTitles[step - 1];
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (step === 6) {
        populatePreview();
    }
}

// Helper to safely get form value
function getVal(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? (el.value || "—") : "—";
}

function populatePreview() {
    const d = document.getElementById("dob-day").value;
    const m = document.getElementById("dob-month").value;
    const y = document.getElementById("dob-year").value;
    const dobStr = d && m && y ? `${y}-${m}-${d}` : "—";

    document.getElementById("pv-fullname").textContent = getVal("fullname");
    document.getElementById("pv-fathername").textContent = getVal("fathername");
    document.getElementById("pv-mobile").textContent = getVal("mobile");
    document.getElementById("pv-email").textContent = getVal("email");
    document.getElementById("pv-dob").textContent = dobStr;
    document.getElementById("pv-gender").textContent = getVal("gender");
    document.getElementById("pv-nationality").textContent = getVal("nationality");
    document.getElementById("pv-category").textContent = getVal("category");
    document.getElementById("pv-aadharnumber").textContent = getVal("aadharnumber");

    document.getElementById("pv-education").textContent = getVal("education");
    document.getElementById("pv-college").textContent = getVal("college");
    document.getElementById("pv-board").textContent = getVal("board");
    document.getElementById("pv-passingyear").textContent = getVal("passingyear");
    document.getElementById("pv-percentage").textContent = getVal("percentage");
    document.getElementById("pv-division").textContent = getVal("division");
    document.getElementById("pv-subjects").textContent = getVal("subjects");

    // Hide subjects in preview if 10th
    const edu = getVal("education");
    const subjectsItem = document.getElementById("pv-subjects-item");
    if (subjectsItem) {
        subjectsItem.style.display = edu === "10th" ? "none" : "";
    }

    document.getElementById("pv-courses").textContent = getVal("courses");
    document.getElementById("pv-batch").textContent = getVal("batch");
    document.getElementById("pv-learningmode").textContent = getVal("learningmode");
    document.getElementById("pv-contact").textContent = getVal("contact");
    document.getElementById("pv-referral").textContent = getVal("referral");

    document.getElementById("pv-address").textContent = getVal("address");
    document.getElementById("pv-city").textContent = getVal("city");
    document.getElementById("pv-district").textContent = getVal("district");
    document.getElementById("pv-state").textContent = getVal("state");
    document.getElementById("pv-pincode").textContent = getVal("pincode");

    const photoInput = document.getElementById("photo");
    const signatureInput = document.getElementById("signature");
    const marksheetInput = document.getElementById("marksheet");
    const certificateInput = document.getElementById("certificate");

    const photoImg = document.getElementById("pv-photo");
    const photoPlaceholder = document.getElementById("pv-photo-placeholder");
    const sigImg = document.getElementById("pv-signature");
    const sigPlaceholder = document.getElementById("pv-signature-placeholder");

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoImg.src = e.target.result;
            photoImg.style.display = "block";
            photoPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(photoInput.files[0]);
        document.getElementById("pv-photo-status").textContent = "✅ Photo: Uploaded (" + photoInput.files[0].name + ")";
        document.getElementById("pv-photo-status").classList.add("uploaded");
    } else {
        photoImg.style.display = "none";
        photoPlaceholder.style.display = "flex";
        document.getElementById("pv-photo-status").textContent = "❌ Photo: Not uploaded";
        document.getElementById("pv-photo-status").classList.remove("uploaded");
    }

    if (signatureInput.files && signatureInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            sigImg.src = e.target.result;
            sigImg.style.display = "block";
            sigPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(signatureInput.files[0]);
        document.getElementById("pv-signature-status").textContent = "✅ Signature: Uploaded (" + signatureInput.files[0].name + ")";
        document.getElementById("pv-signature-status").classList.add("uploaded");
    } else {
        sigImg.style.display = "none";
        sigPlaceholder.style.display = "flex";
        document.getElementById("pv-signature-status").textContent = "❌ Signature: Not uploaded";
        document.getElementById("pv-signature-status").classList.remove("uploaded");
    }

    if (marksheetInput.files && marksheetInput.files[0]) {
        document.getElementById("pv-marksheet-status").textContent = "✅ Marksheet: Uploaded (" + marksheetInput.files[0].name + ")";
        document.getElementById("pv-marksheet-status").classList.add("uploaded");
    } else {
        document.getElementById("pv-marksheet-status").textContent = "— Marksheet: Not uploaded (optional)";
        document.getElementById("pv-marksheet-status").classList.remove("uploaded");
    }

    if (certificateInput.files && certificateInput.files[0]) {
        document.getElementById("pv-aadhaar-status").textContent = "✅ Aadhaar: Uploaded (" + certificateInput.files[0].name + ")";
        document.getElementById("pv-aadhaar-status").classList.add("uploaded");
    } else {
        document.getElementById("pv-aadhaar-status").textContent = "— Aadhaar: Not uploaded (optional)";
        document.getElementById("pv-aadhaar-status").classList.remove("uploaded");
    }
}

// =====================================
// Hide Subjects/Stream when Highest Education = 10th
// =====================================
function toggleSubjectsField() {
    const educationSelect = document.getElementById("education");
    const subjectsGroup = document.getElementById("subjects-group");
    const subjectsInput = document.getElementById("subjects");
    if (!educationSelect || !subjectsGroup) return;

    if (educationSelect.value === "10th") {
        subjectsGroup.classList.add("hidden");
        if (subjectsInput) subjectsInput.value = "";
    } else {
        subjectsGroup.classList.remove("hidden");
    }
}

document.getElementById("education").addEventListener("change", toggleSubjectsField);
toggleSubjectsField();

// =====================================
// Aadhaar Duplicate Check (localStorage)
// =====================================
const AADHAAR_KEY = "scolex_registered_aadhaar";

function normalizeAadhaar(val) {
    return String(val || "").replace(/\D/g, "").slice(0, 12);
}

function getRegisteredAadhaarList() {
    const set = new Set();
    try {
        const dedicated = JSON.parse(localStorage.getItem(AADHAAR_KEY) || "[]");
        if (Array.isArray(dedicated)) {
            dedicated.forEach(function (a) {
                const n = normalizeAadhaar(a);
                if (n.length === 12) set.add(n);
            });
        }
    } catch (e) {}
    try {
        const list = JSON.parse(localStorage.getItem("scolexAdmissions") || "[]");
        if (Array.isArray(list)) {
            list.forEach(function (item) {
                const n = normalizeAadhaar(item.aadharnumber || item.aadhaar || "");
                if (n.length === 12) set.add(n);
            });
        }
    } catch (e) {}
    try {
        const last = JSON.parse(localStorage.getItem("ScolexStudentSavedData") || "null");
        if (last) {
            const n = normalizeAadhaar(last.aadharnumber || last.aadhaar || "");
            if (n.length === 12) set.add(n);
        }
    } catch (e) {}
    return set;
}

function rememberAadhaar(aadhaar) {
    const n = normalizeAadhaar(aadhaar);
    if (n.length !== 12) return;
    try {
        const list = JSON.parse(localStorage.getItem(AADHAAR_KEY) || "[]");
        if (list.indexOf(n) === -1) {
            list.push(n);
            localStorage.setItem(AADHAAR_KEY, JSON.stringify(list));
        }
    } catch (e) {
        localStorage.setItem(AADHAAR_KEY, JSON.stringify([n]));
    }
}

function isAadhaarAlreadyRegistered(aadhaar) {
    const clean = normalizeAadhaar(aadhaar);
    if (clean.length !== 12) return false;
    return getRegisteredAadhaarList().has(clean);
}

function checkAadhaarDuplicate() {
    const input = document.getElementById("aadharnumber");
    const errorEl = document.getElementById("aadhaar-error");
    if (!input || !errorEl) return true;

    const value = normalizeAadhaar(input.value);
    if (input.value !== value) input.value = value;

    if (value.length === 12 && isAadhaarAlreadyRegistered(value)) {
        errorEl.classList.remove("hidden");
        input.classList.add("input-error");
        return false;
    } else {
        errorEl.classList.add("hidden");
        input.classList.remove("input-error");
        return true;
    }
}

const aadhaarInput = document.getElementById("aadharnumber");
if (aadhaarInput) {
    aadhaarInput.addEventListener("blur", checkAadhaarDuplicate);
    aadhaarInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 12);
        if (this.value.length < 12) {
            document.getElementById("aadhaar-error").classList.add("hidden");
            this.classList.remove("input-error");
        } else {
            checkAadhaarDuplicate();
        }
    });
}

// Next button validation and movement
document.querySelectorAll(".next-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        const inputs = currentStepElement.querySelectorAll("input, select, textarea");

        let isValid = true;
        inputs.forEach((input) => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        if (currentStep === 1 && !checkAadhaarDuplicate()) {
            isValid = false;
            alert("⚠ Aadhaar number is already registered. Please use a different Aadhaar number.");
        }

        if (isValid && currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

// Back button movement
document.querySelectorAll(".prev-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// File Previews (in step 5)
function setupFilePreview(inputId, imgPreviewId, pdfPreviewId = null) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        if (file.type === "application/pdf") {
            if (imgPreviewId) document.getElementById(imgPreviewId).classList.add("hidden");
            if (pdfPreviewId) document.getElementById(pdfPreviewId).classList.remove("hidden");
        } else {
            reader.onload = function (e) {
                if (imgPreviewId) {
                    const imgElement = document.getElementById(imgPreviewId);
                    imgElement.src = e.target.result;
                    imgElement.classList.remove("hidden");
                }
                if (pdfPreviewId) document.getElementById(pdfPreviewId).classList.add("hidden");
            };
            reader.readAsDataURL(file);
        }
    });
}

setupFilePreview("photo", "photo-preview");
setupFilePreview("signature", "signature-preview");
setupFilePreview("marksheet", "marksheet-img-preview", "marksheet-pdf-preview");
setupFilePreview("certificate", "aadhaar-img-preview", "aadhaar-pdf-preview");

// Form Submission
const form = document.getElementById("applicationForm");
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!checkAadhaarDuplicate()) {
        alert("⚠ Aadhaar number is already registered. Please go back and use a different Aadhaar number.");
        currentStep = 1;
        showStep(currentStep);
        return;
    }

    const d = document.getElementById("dob-day").value;
    const m = document.getElementById("dob-month").value;
    const y = document.getElementById("dob-year").value;
    document.getElementById("dob").value = `${y}-${m}-${d}`;

    const photoFile = document.getElementById("photo").files[0];
    const signatureFile = document.getElementById("signature").files[0];
    const marksheetFile = document.getElementById("marksheet").files[0];
    const certificateFile = document.getElementById("certificate").files[0];

    if (!photoFile || !signatureFile) {
        alert("Please upload passport photo and signature.");
        currentStep = 5;
        showStep(currentStep);
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";
    }

    try {
        const readFile = (file) =>
            new Promise((resolve) => {
                if (!file) return resolve({ base64: "", name: "", type: "" });
                const reader = new FileReader();
                reader.onload = () =>
                    resolve({
                        base64: reader.result.split(",")[1],
                        name: file.name,
                        type: file.type,
                    });
                reader.readAsDataURL(file);
            });

        const [photoData, signatureData, marksheetData, certificateData] = await Promise.all([
            readFile(photoFile),
            readFile(signatureFile),
            readFile(marksheetFile),
            readFile(certificateFile),
        ]);

        const currentUserRole = (localStorage.getItem("userRole") || "student").toLowerCase();
        const currentUserName = localStorage.getItem("userName") || "Public Student";
        const computedAdmissionMode =
            currentUserRole === "admin" || currentUserRole === "teacher" || currentUserRole === "staff"
                ? "Offline"
                : "Online";

        const data = {
            fullname: form.fullname.value,
            fathername: form.fathername.value,
            mobile: form.mobile.value,
            email: form.email.value,
            dob: document.getElementById("dob").value,
            gender: form.gender.value,
            nationality: form.nationality.value,
            category: form.category.value,
            aadharnumber: form.aadharnumber.value,
            education: form.education.value,
            college: form.college.value,
            board: form.board.value,
            passingyear: form.passingyear.value,
            percentage: form.percentage.value,
            division: form.division.value,
            subjects: form.subjects.value,
            courses: form.courses.value,
            batch: form.batch.value,
            learningmode: form.learningmode.value,
            admissionMode: computedAdmissionMode,
            role: currentUserRole,
            submittedBy: currentUserName,
            source:
                currentUserRole === "admin" || currentUserRole === "teacher" || currentUserRole === "staff"
                    ? "Staff Entry"
                    : "Online Form",
            contact: form.contact.value,
            address: form.address.value,
            pincode: form.pincode.value,
            district: form.district.value,
            state: form.state.value,
            city: form.city.value,
            referral: form.referral.value,
            photo: photoData.base64,
            fileName: photoData.name,
            mimeType: photoData.type,
            signature: signatureData.base64,
            signatureName: signatureData.name,
            signatureType: signatureData.type,
            marksheet: marksheetData.base64,
            marksheetName: marksheetData.name,
            marksheetType: marksheetData.type,
            aadhaar: certificateData.base64,
            aadhaarName: certificateData.name,
            aadhaarType: certificateData.type,
        };

        localStorage.setItem("ScolexStudentSavedData", JSON.stringify(data));

        const existingErpData = JSON.parse(localStorage.getItem("scolexAdmissions") || "[]");
        existingErpData.push(data);
        localStorage.setItem("scolexAdmissions", JSON.stringify(existingErpData));

        // Remember Aadhaar for duplicate check next time
        rememberAadhaar(data.aadharnumber);

        const response = await fetch(scriptURL, {
            method: "POST",
            body: new URLSearchParams(data),
        });
        const result = await response.json();

        if (result.success === true) {
            alert("✅ Application Submitted Successfully & Saved Locally!\n\nApplication ID: " + result.applicationID);
            if (result.pdfUrl) window.open(result.pdfUrl, "_blank");
            form.reset();
            document.getElementById("photo-preview").classList.add("hidden");
            document.getElementById("signature-preview").classList.add("hidden");
            document.getElementById("marksheet-img-preview").classList.add("hidden");
            document.getElementById("marksheet-pdf-preview").classList.add("hidden");
            document.getElementById("aadhaar-img-preview").classList.add("hidden");
            document.getElementById("aadhaar-pdf-preview").classList.add("hidden");
            document.getElementById("aadhaar-error").classList.add("hidden");
            document.getElementById("aadharnumber").classList.remove("input-error");
            toggleSubjectsField();
            currentStep = 1;
            showStep(currentStep);
            // index.html is outside the html folder
            window.location.href = "../index.html";
        } else {
            alert("⚠️ Submission Failed. Please try again.");
        }
    } catch (error) {
        alert("❌ Error: " + error);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "✅ Confirm & Submit Application";
        }
    }
});