const scriptURL = "https://script.google.com/macros/s/AKfycbxquEKPFaTf467S_YwRWu2pA1SEgTrdPQr-s66MqjFZm6zr85ASIGsny0cJPuMpeONCkw/exec";

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");

if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        const formData = new FormData(contactForm);

        fetch(scriptURL, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Thank you! Your message has been sent successfully.");
                contactForm.reset();
            } else {
                alert("Message could not be sent. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        });
    });
}