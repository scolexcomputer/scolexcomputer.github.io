// =====================================
// Google Apps Script Web App URL
// =====================================
const scriptURL = "https://script.google.com/macros/s/AKfycbw7JUWkLVQbtYc8ZCnikO3hcCk-w55pE6NPv5scpT-czXdnAs4K1y6j2t0gdh7k2R9j/exec";

// =====================================
// Get Form
// =====================================
const form = document.getElementById("applicationForm");

// =====================================
// Submit Event
// =====================================
form.addEventListener("submit", submitForm);

// =====================================
// Submit Function
// =====================================
function submitForm(e) {

    e.preventDefault();

    // Get Image Files
    const photo = document.getElementById("photo").files[0];
    const signature = document.getElementById("signature").files[0];

    // Validation
    if (!photo) {
        alert("Please upload student photo.");
        return;
    }

    if (!signature) {
        alert("Please upload student signature.");
        return;
    }

    // Read Photo
    const photoReader = new FileReader();

    photoReader.onload = function () {

        const photoBase64 = photoReader.result.split(",")[1];

        // Read Signature
        const signReader = new FileReader();

        signReader.onload = function () {

            const signatureBase64 = signReader.result.split(",")[1];

            // Create Data Object
            const data = {

                    fullname: form.fullname.value,
                    fathername: form.fathername.value,

                    mobile: form.mobile.value,
                    email: form.email.value,
                    dob: form.dob.value,
                    gender: form.gender.value,

                    education: form.education.value,
                    college: form.college.value,
                    board: form.board.value,
                    passingyear: form.passingyear.value,
                    percentage: form.percentage.value,

                    courses: form.courses.value,
                    batch: form.batch.value,
                    learningmode: form.learningmode.value,
                    contact: form.contact.value,

                    address: form.address.value,
                    pincode: form.pincode.value,
                    district: form.district.value,
                    state: form.state.value,

                    photo: photoBase64,
                    fileName: photo.name,
                    mimeType: photo.type,

                    signature: signatureBase64,
                    signatureName: signature.name,
                    signatureType: signature.type

                };

            // Disable Submit Button
            const submitBtn = form.querySelector('button[type="submit"]');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = "Submitting...";
            }

            // Send Data
            fetch(scriptURL, {
                method: "POST",
                body: new URLSearchParams(data)
            })
            // 1. Read the response as JSON instead of text
            .then(response => response.json()) 
            .then(result => {
                console.log(result);

                // 2. Check the "success" true/false from your JSON
                if (result.success === true) {
                    
                    alert("✅ Application Submitted Successfully!\n\nApplication ID: " + result.applicationID);
                    
                    // 3. Open the PDF in a new blank window/tab to trigger download
                    if (result.pdfUrl) {
                        window.open(result.pdfUrl, "_blank");
                    }

                    form.reset();

                } else {
                    alert("⚠️ Submission Failed. Please try again.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("❌ Submission Failed.\n\n" + error);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "Submit";
                }
            });
        };

        // Read Signature
        signReader.readAsDataURL(signature);

    };

    // Read Photo
    photoReader.readAsDataURL(photo);

}