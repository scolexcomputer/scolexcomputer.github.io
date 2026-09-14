let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
let slideInterval;

// Initialize slideshow
showSlide(currentSlideIndex);
startAutoSlide();

function showSlide(index) {
    // Loop around if out of bounds
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    // Show current slide
    slides[currentSlideIndex].style.display = 'block';
}

function changeSlide(step) {
    // Reset timer on manual click
    clearInterval(slideInterval);
    showSlide(currentSlideIndex + step);
    startAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 4000); // Transitions every 4 seconds
}