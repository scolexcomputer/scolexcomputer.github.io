let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.gallery-dots');
let slideInterval;
let isAnimating = false;

// Create dots
if (dotsContainer && slides.length) {
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            if (i !== currentSlideIndex && !isAnimating) {
                goToSlide(i);
            }
        });
        dotsContainer.appendChild(dot);
    });
}

const dots = document.querySelectorAll('.gallery-dots .dot');

// Initialize first slide
showSlide(currentSlideIndex, true);
startAutoSlide();

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

function showSlide(index, instant = false) {
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    if (instant) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'flip-out', 'flip-from-right', 'flip-to-left');
            slide.style.display = i === currentSlideIndex ? 'block' : 'none';
            slide.style.transformOrigin = '';
            if (i === currentSlideIndex) {
                slide.classList.add('active');
            }
        });
        updateDots();
        return;
    }
}

function goToSlide(newIndex) {
    if (isAnimating) return;

    // Normalize target index with looping
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;

    if (newIndex === currentSlideIndex) return;

    isAnimating = true;

    const oldIndex = currentSlideIndex;
    // Determine direction: positive = next (flip from left), negative = prev (flip from right)
    let direction = 1;
    if (newIndex < oldIndex) {
        // Special case for loop: from last to first is still "next"
        if (oldIndex === slides.length - 1 && newIndex === 0) {
            direction = 1;
        } else {
            direction = -1;
        }
    } else if (newIndex > oldIndex) {
        // Special case for loop: from first to last is "prev"
        if (oldIndex === 0 && newIndex === slides.length - 1) {
            direction = -1;
        } else {
            direction = 1;
        }
    }

    const oldSlide = slides[oldIndex];
    const newSlide = slides[newIndex];

    // Reset classes
    oldSlide.classList.remove('active', 'flip-from-right', 'flip-to-left');
    newSlide.classList.remove('flip-out', 'flip-from-right', 'flip-to-left');

    // Prepare new slide under the old one
    newSlide.style.display = 'block';
    newSlide.classList.add('active');

    // Apply direction-specific classes for realistic book page turn
    if (direction > 0) {
        // Next → page turns from left (classic book)
        oldSlide.style.transformOrigin = 'left center';
        newSlide.style.transformOrigin = 'left center';
        oldSlide.classList.add('flip-out');
    } else {
        // Previous → page turns from right
        oldSlide.style.transformOrigin = 'right center';
        newSlide.style.transformOrigin = 'right center';
        oldSlide.classList.add('flip-out', 'flip-to-left');
        newSlide.classList.add('flip-from-right');
    }

    currentSlideIndex = newIndex;
    updateDots();

    // Clean up after animation finishes
    setTimeout(() => {
        oldSlide.classList.remove('flip-out', 'flip-to-left');
        oldSlide.style.display = 'none';
        oldSlide.style.transformOrigin = '';
        newSlide.classList.remove('flip-from-right');
        newSlide.style.transformOrigin = '';
        isAnimating = false;
    }, 750);
}

function changeSlide(step) {
    if (isAnimating) return;
    clearInterval(slideInterval);
    goToSlide(currentSlideIndex + step);
    startAutoSlide();
}

function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        if (!isAnimating) {
            goToSlide(currentSlideIndex + 1);
        }
    }, 4500);
}