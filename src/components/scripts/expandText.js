export function initExpandText() {
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const text = button.parentElement.querySelector('.text');
            if (text) {
                text.classList.toggle('truncated');
                button.textContent = text.classList.contains('truncated') ? 'Lire plus' : 'Lire moins';
            }
        });
    });
}