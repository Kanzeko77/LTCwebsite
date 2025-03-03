document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const contactForm = document.querySelector('.contact-form');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if (header) {
        window.addEventListener('scroll', function() {
            const isScrolled = window.scrollY > 100;
            header.style.background = isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.classList.add('invalid');
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const error = document.createElement('span');
                        error.classList.add('error-message');
                        error.textContent = 'Este campo es obligatorio';
                        input.parentNode.appendChild(error);
                    }
                } else {
                    input.classList.remove('invalid');
                    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                        input.nextElementSibling.remove();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
