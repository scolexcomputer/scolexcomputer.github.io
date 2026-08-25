// =====================================
// Google Apps Script Web App URL
// =====================================
const scriptURL = "https://script.google.com/macros/s/AKfycbw1zcxamrxV2Hj5eYONbabP9CmsVGhbaQkVVU7reIJTYRYcS9bpNcem6ekDIZqzDcMQ/exec";

// =====================================
// Multi-Step Navigation Logic
// =====================================
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

function showStep(step) {
    document.querySelectorAll(".form-step").forEach((el, index) => {
        if (index + 1 === step) {
            el.classList.remove("d-none");
        } else {
            el.classList.add("d-none");
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

// =====================================
// Form Submission & File Handlers
// =====================================
const form = document.getElementById("applicationForm");
form.addEventListener("submit", submitForm);

// Helper function to read files as Base64 strings
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve({ base64: "", name: "", type: "" });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            resolve({
                base64: base64String,
                name: file.name,
                type: file.type
            });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function submitForm(e) {
    e.preventDefault();

    // Get File Inputs
    const photoFile = document.getElementById("photo").files[0];
    const signatureFile = document.getElementById("signature").files[0];
    const marksheetFile = document.getElementById("marksheet").files[0];
    const certificateFile = document.getElementById("certificate").files[0]; // Aadhaar upload

    // Mandatory validations
    if (!photoFile) {
        alert("Please upload passport size photo.");
        return;
    }
    if (!signatureFile) {
        alert("Please upload signature.");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting Application...";
    }

    try {
        // Read all files concurrently
        const photoData = await readFileAsBase64(photoFile);
        const signatureData = await readFileAsBase64(signatureFile);
        const marksheetData = await readFileAsBase64(marksheetFile);
        const certificateData = await readFileAsBase64(certificateFile);

        // Map all fields together (Including Division / Grade)
        const data = {
            fullname: form.fullname.value,
            fathername: form.fathername.value,
            mobile: form.mobile.value,
            email: form.email.value,
            dob: form.dob.value,
            gender: form.gender.value,
            nationality: form.nationality.value,
            category: form.category.value,
            aadharnumber: form.aadharnumber.value,

            education: form.education.value,
            college: form.college.value,
            board: form.board.value,
            passingyear: form.passingyear.value,
            percentage: form.percentage.value,
            division: form.division.value, // Captured Division / Grade
            subjects: form.subjects.value,

            courses: form.courses.value,
            batch: form.batch.value,
            learningmode: form.learningmode.value,
            contact: form.contact.value,

            address: form.address.value,
            pincode: form.pincode.value,
            district: form.district.value,
            state: form.state.value,
            city: form.city.value,

            referral: form.referral.value,

            // Photo Details
            photo: photoData.base64,
            fileName: photoData.name,
            mimeType: photoData.type,

            // Signature Details
            signature: signatureData.base64,
            signatureName: signatureData.name,
            signatureType: signatureData.type,

            // Marksheet Details
            marksheet: marksheetData.base64,
            marksheetName: marksheetData.name,
            marksheetType: marksheetData.type,

            // Aadhaar Details
            aadhaar: certificateData.base64,
            aadhaarName: certificateData.name,
            aadhaarType: certificateData.type
        };

        // Send to Google Apps Script Web App
        const response = await fetch(scriptURL, {
            method: "POST",
            body: new URLSearchParams(data)
        });
        
        const result = await response.json();

        if (result.success === true) {
            alert("✅ Application Submitted Successfully!\n\nApplication ID: " + result.applicationID);
            
            if (result.pdfUrl) {
                window.open(result.pdfUrl, "_blank");
            }

            form.reset();
            currentStep = 1;
            showStep(currentStep);
        } else {
            alert("⚠️ Submission Failed. Please try again.");
        }

    } catch (error) {
        console.error(error);
        alert("❌ Submission Failed.\n\n" + error);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit Application";
        }
    }
}