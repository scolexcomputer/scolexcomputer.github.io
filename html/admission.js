// =====================================
// Google Apps Script Web App URL
// =====================================
const scriptURL = "https://script.google.com/macros/s/AKfycbyTJ5hPgzqJg6FqI7pJHEjyIIMSHQ1UaNX6NNnvwXjb2YmvWsTz8Zjhzsyhak4V7BUW/exec";

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
    if (stepIndicatorText) {
        stepIndicatorText.innerText = stepTitles[step - 1];
    }
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
    const d = document.getElementById("dob-day")?.value || "";
    const m = document.getElementById("dob-month")?.value || "";
    const y = document.getElementById("dob-year")?.value || "";
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

    // Photo Preview
    const photoImg = document.getElementById("pv-photo");
    const photoPlaceholder = document.getElementById("pv-photo-placeholder");
    if (photoInput && photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (photoImg) { photoImg.src = e.target.result; photoImg.style.display = "block"; }
            if (photoPlaceholder) photoPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(photoInput.files[0]);
        document.getElementById("pv-photo-status").textContent = "✅ " + photoInput.files[0].name;
    } else {
        if (photoImg) photoImg.style.display = "none";
        if (photoPlaceholder) photoPlaceholder.style.display = "flex";
        document.getElementById("pv-photo-status").textContent = "❌ Not uploaded";
    }

    // Signature Preview
    const sigImg = document.getElementById("pv-signature");
    const sigPlaceholder = document.getElementById("pv-signature-placeholder");
    if (signatureInput && signatureInput.files && signatureInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (sigImg) { sigImg.src = e.target.result; sigImg.style.display = "block"; }
            if (sigPlaceholder) sigPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(signatureInput.files[0]);
        document.getElementById("pv-signature-status").textContent = "✅ " + signatureInput.files[0].name;
    } else {
        if (sigImg) sigImg.style.display = "none";
        if (sigPlaceholder) sigPlaceholder.style.display = "flex";
        document.getElementById("pv-signature-status").textContent = "❌ Not uploaded";
    }

    // Marksheet Preview
    const marksheetImg = document.getElementById("pv-marksheet-img");
    const marksheetText = document.getElementById("pv-marksheet-text");
    if (marksheetInput && marksheetInput.files && marksheetInput.files[0]) {
        const file = marksheetInput.files[0];
        if (file.type === "application/pdf") {
            if (marksheetImg) marksheetImg.style.display = "none";
            if (marksheetText) { marksheetText.textContent = "📄 PDF Attached: " + file.name; marksheetText.style.display = "block"; }
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (marksheetImg) { marksheetImg.src = e.target.result; marksheetImg.style.display = "block"; }
                if (marksheetText) marksheetText.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
        document.getElementById("pv-marksheet-status").textContent = "✅ Uploaded (" + file.name + ")";
    } else {
        if (marksheetImg) marksheetImg.style.display = "none";
        if (marksheetText) { marksheetText.textContent = "No Marksheet Uploaded"; marksheetText.style.display = "block"; }
        document.getElementById("pv-marksheet-status").textContent = "Optional (Not uploaded)";
    }

    // Aadhaar Document Preview
    const aadhaarImg = document.getElementById("pv-aadhaar-img");
    const aadhaarText = document.getElementById("pv-aadhaar-text");
    if (certificateInput && certificateInput.files && certificateInput.files[0]) {
        const file = certificateInput.files[0];
        if (file.type === "application/pdf") {
            if (aadhaarImg) aadhaarImg.style.display = "none";
            if (aadhaarText) { aadhaarText.textContent = "📄 PDF Attached: " + file.name; aadhaarText.style.display = "block"; }
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (aadhaarImg) { aadhaarImg.src = e.target.result; aadhaarImg.style.display = "block"; }
                if (aadhaarText) aadhaarText.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
        document.getElementById("pv-aadhaar-status").textContent = "✅ Uploaded (" + file.name + ")";
    } else {
        if (aadhaarImg) aadhaarImg.style.display = "none";
        if (aadhaarText) { aadhaarText.textContent = "No Aadhaar Uploaded"; aadhaarText.style.display = "block"; }
        document.getElementById("pv-aadhaar-status").textContent = "Optional (Not uploaded)";
    }
}

// =====================================
// Hide Subjects/Stream when Highest Education = 10th
// =====================================
function toggleSubjectsField() {
    const educationSelect = document.getElementById("education");
    const subjectsGroup = document.getElementById("subjects")?.closest(".input-group");
    const subjectsInput = document.getElementById("subjects");
    if (!educationSelect || !subjectsGroup) return;

    if (educationSelect.value === "10th") {
        subjectsGroup.classList.add("hidden");
        if (subjectsInput) subjectsInput.value = "";
    } else {
        subjectsGroup.classList.remove("hidden");
    }
}

const educationSelectEl = document.getElementById("education");
if (educationSelectEl) {
    educationSelectEl.addEventListener("change", toggleSubjectsField);
    toggleSubjectsField();
}

// =====================================
// Aadhaar Duplicate Check (Google Sheet Only)
// =====================================
let sheetAadhaarSet = new Set();

async function fetchSheetAadhaars() {
    try {
        const response = await fetch(scriptURL + "?action=read");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            result.data.forEach(row => {
                const clean = normalizeAadhaar(row.aadharnumber);
                if (clean.length === 12) {
                    sheetAadhaarSet.add(clean);
                }
            });
        }
    } catch (e) {
        console.error("Could not fetch sheet records for duplicate check:", e);
    }
}
fetchSheetAadhaars();

function normalizeAadhaar(val) {
    return String(val || "").replace(/\D/g, "").slice(0, 12);
}

function isAadhaarAlreadyRegistered(aadhaar) {
    const clean = normalizeAadhaar(aadhaar);
    if (clean.length !== 12) return false;
    return sheetAadhaarSet.has(clean);
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
            document.getElementById("aadhaar-error")?.classList.add("hidden");
            this.classList.remove("input-error");
        } else {
            checkAadhaarDuplicate();
        }
    });
}

// Next button validation and movement (Consolidated)
document.querySelectorAll(".next-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        if (!currentStepElement) return;
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
            alert("⚠️ This number is already registered in the Google Sheet database. Please use a different number.");
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
            if (imgPreviewId) document.getElementById(imgPreviewId)?.classList.add("hidden");
            if (pdfPreviewId) document.getElementById(pdfPreviewId)?.classList.remove("hidden");
        } else {
            reader.onload = function (e) {
                if (imgPreviewId) {
                    const imgElement = document.getElementById(imgPreviewId);
                    if (imgElement) {
                        imgElement.src = e.target.result;
                        imgElement.classList.remove("hidden");
                    }
                }
                if (pdfPreviewId) document.getElementById(pdfPreviewId)?.classList.add("hidden");
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
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!checkAadhaarDuplicate()) {
            alert("⚠️ Aadhaar number is already registered. Please go back and use a different Aadhaar number.");
            currentStep = 1;
            showStep(currentStep);
            return;
        }

        const d = document.getElementById("dob-day")?.value || "";
        const m = document.getElementById("dob-month")?.value || "";
        const y = document.getElementById("dob-year")?.value || "";
        const dobHidden = document.getElementById("dob");
        if (dobHidden) dobHidden.value = `${y}-${m}-${d}`;

        const photoFile = document.getElementById("photo")?.files[0];
        const signatureFile = document.getElementById("signature")?.files[0];
        const marksheetFile = document.getElementById("marksheet")?.files[0];
        const certificateFile = document.getElementById("certificate")?.files[0];

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
                fullname: form.fullname?.value || "",
                fathername: form.fathername?.value || "",
                mobile: form.mobile?.value || "",
                email: form.email?.value || "",
                dob: dobHidden ? dobHidden.value : "",
                gender: form.gender?.value || "",
                nationality: form.nationality?.value || "",
                category: form.category?.value || "",
                aadharnumber: form.aadharnumber?.value || "",
                education: form.education?.value || "",
                college: form.college?.value || "",
                board: form.board?.value || "",
                passingyear: form.passingyear?.value || "",
                percentage: form.percentage?.value || "",
                division: form.division?.value || "",
                subjects: form.subjects?.value || "",
                courses: form.courses?.value || "",
                batch: form.batch?.value || "",
                learningmode: form.learningmode?.value || "",
                admissionMode: computedAdmissionMode,
                role: currentUserRole,
                submittedBy: currentUserName,
                source:
                    currentUserRole === "admin" || currentUserRole === "teacher" || currentUserRole === "staff"
                        ? "Staff Entry"
                        : "Online Form",
                contact: form.contact?.value || "",
                address: form.address?.value || "",
                pincode: form.pincode?.value || "",
                district: form.district?.value || "",
                state: form.state?.value || "",
                city: form.city?.value || "",
                referral: form.referral?.value || "",
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

            const response = await fetch(scriptURL, {
                method: "POST",
                body: new URLSearchParams(data),
            });
            const result = await response.json();

            if (result.success === true) {
                alert("✅ Application Submitted Successfully!\n\nApplication ID: " + result.applicationID);
                if (result.pdfUrl) window.open(result.pdfUrl, "_blank");
                form.reset();
                document.getElementById("photo-preview")?.classList.add("hidden");
                document.getElementById("signature-preview")?.classList.add("hidden");
                document.getElementById("marksheet-img-preview")?.classList.add("hidden");
                document.getElementById("marksheet-pdf-preview")?.classList.add("hidden");
                document.getElementById("aadhaar-img-preview")?.classList.add("hidden");
                document.getElementById("aadhaar-pdf-preview")?.classList.add("hidden");
                document.getElementById("aadhaar-error")?.classList.add("hidden");
                document.getElementById("aadharnumber")?.classList.remove("input-error");
                toggleSubjectsField();
                currentStep = 1;
                showStep(currentStep);
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
}