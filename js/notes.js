// Function to display topics when a course card is clicked
function showNotes(courseId) {
    // 1. Get all notes sections
    const allNotes = document.querySelectorAll('.notes-content');

    // 2. Hide all sections and remove active class
    allNotes.forEach(note => {
        note.classList.remove('active');
        note.style.display = 'none';
    });

    // 3. Find and display the selected course section
    const selectedCourse = document.getElementById(courseId);
    if (selectedCourse) {
        selectedCourse.style.display = 'block'; // Fallback display
        selectedCourse.classList.add('active'); // Applies CSS animation and styling

        // 4. Smooth scroll to the course section header
        selectedCourse.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Live Search Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.card');

            // If user types something, make sure all course note sections are visible for search results
            if (query.length > 0) {
                document.querySelectorAll('.notes-content').forEach(section => {
                    section.style.display = 'block';
                });
            }

            // Filter individual topic cards
            cards.forEach(card => {
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
                const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';

                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});