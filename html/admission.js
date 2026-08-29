// =====================================
// Google Apps Script Web App URL
// =====================================
const scriptURL = "https://script.google.com/macros/s/AKfycbzK1ngZb-H6GtaS4fpcXAQFuT23faj2-bcvOAb5x6nnlinZw3Qdwvyuylylwi06FcP2/exec";

let currentStep = 1;
const totalSteps = 5;

const stepIndicatorText = document.getElementById("stepIndicatorText");
const stepTitles = [
    "Step 1 of 5: Personal Information",
    "Step 2 of 5: Educational Details",
    "Step 3 of 5: Course Details",
    "Step 4 of 5: Address Details",
    "Step 5 of 5: Upload Documents & Info"
];

// Populate Date Dropdowns for Mobile Friendly Input
function populateDateDropdowns() {
    const daySelect = document.getElementById("dob-day");
    const monthSelect = document.getElementById("dob-month");
    const yearSelect = document.getElementById("dob-year");

    if(!daySelect) return;

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Next button validation and movement
document.querySelectorAll(".next-btn").forEach(button => {
    button.addEventListener("click", () => {
        const currentStepElement = document.getElementById(`step-${currentStep}`);
        const inputs = currentStepElement.querySelectorAll("input, select, textarea");
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        if (isValid && currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

// Back button movement
document.querySelectorAll(".prev-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// File Previews
function setupFilePreview(inputId, imgPreviewId, pdfPreviewId = null) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        if (file.type === "application/pdf") {
            if (imgPreviewId) document.getElementById(imgPreviewId).classList.add("hidden");
            if (pdfPreviewId) document.getElementById(pdfPreviewId).classList.remove("hidden");
        } else {
            reader.onload = function(e) {
                if (imgPreviewId) {
                    const imgElement = document.getElementById(imgPreviewId);
                    imgElement.src = e.target.result;
                    imgElement.classList.remove("hidden");
                }
                if (pdfPreviewId) document.getElementById(pdfPreviewId).classList.add("hidden");
            }
            reader.readAsDataURL(file);
        }
    });
}

setupFilePreview("photo", "photo-preview");
setupFilePreview("signature", "signature-preview");
setupFilePreview("marksheet", "marksheet-img-preview", "marksheet-pdf-preview");
setupFilePreview("certificate", "aadhaar-img-preview", "aadhaar-pdf-preview");

// Form Submission & Local Storage Data Saving
const form = document.getElementById("applicationForm");
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Combine Day, Month, Year into DOB hidden field
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
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";
    }

    try {
        const readFile = file => new Promise((resolve) => {
            if (!file) return resolve({ base64: "", name: "", type: "" });
            const reader = new FileReader();
            reader.onload = () => resolve({ base64: reader.result.split(",")[1], name: file.name, type: file.type });
            reader.readAsDataURL(file);
        });

        const [photoData, signatureData, marksheetData, certificateData] = await Promise.all([
            readFile(photoFile), readFile(signatureFile), readFile(marksheetFile), readFile(certificateFile)
        ]);

        // Dynamic Role & Admission Mode Detection
        const currentUserRole = (localStorage.getItem("userRole") || "student").toLowerCase();
        const currentUserName = localStorage.getItem("userName") || "Public Student";
        const computedAdmissionMode = (currentUserRole === "admin" || currentUserRole === "teacher" || currentUserRole === "staff")
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
            
            // Admission origin tracking
            admissionMode: computedAdmissionMode,
            role: currentUserRole,
            submittedBy: currentUserName,
            source: (currentUserRole === "admin" || currentUserRole === "teacher" || currentUserRole === "staff") ? "Staff Entry" : "Online Form",

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
            aadhaarType: certificateData.type
        };

        // Save submitted data locally to browser storage
        localStorage.setItem("ScolexStudentSavedData", JSON.stringify(data));

        // Sync with existing ERP storage list
        const existingErpData = JSON.parse(localStorage.getItem("scolexAdmissions") || "[]");
        existingErpData.push(data);
        localStorage.setItem("scolexAdmissions", JSON.stringify(existingErpData));

        const response = await fetch(scriptURL, { method: "POST", body: new URLSearchParams(data) });
        const result = await response.json();

        if (result.success === true) {
            alert("✅ Application Submitted Successfully & Saved Locally!\n\nApplication ID: " + result.applicationID);
            if (result.pdfUrl) window.open(result.pdfUrl, "_blank");
            form.reset();
            currentStep = 1;
            showStep(currentStep);
        } else {
            alert("⚠️ Submission Failed. Please try again.");
        }
    } catch (error) {
        alert("❌ Error: " + error);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit Application";
        }
    }
});