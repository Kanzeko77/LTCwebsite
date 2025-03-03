'use strict';

/**
 * Módulo principal de la aplicación
 */
const App = (() => {
    // Configuración global
    const config = {
        headerScrollThreshold: 100,
        scrollDebounceTime: 100,
        menuTransitionDuration: 300,
        smoothScrollOffset: 80
    };

    // Elementos del DOM
    const dom = {
        menuToggle: document.querySelector('.menu-toggle'),
        navLinks: document.querySelector('.nav-links'),
        header: document.querySelector('.header'),
        contactForm: document.querySelector('.contact-form'),
        mainContent: document.querySelector('main')
    };

    // Estado de la aplicación
    const state = {
        isMenuOpen: false,
        lastScrollPosition: 0
    };

    /**
     * Maneja el menú móvil
     */
    const handleMenu = () => {
        if (!dom.menuToggle || !dom.navLinks) return;

        const toggleMenu = (shouldOpen) => {
            state.isMenuOpen = shouldOpen;
            dom.navLinks.classList.toggle('active', shouldOpen);
            dom.menuToggle.classList.toggle('active', shouldOpen);
            dom.menuToggle.setAttribute('aria-expanded', shouldOpen);
            
            // Manejo de accesibilidad
            if (shouldOpen) {
                dom.navLinks.querySelector('a').focus();
                dom.mainContent.inert = true;
            } else {
                dom.menuToggle.focus();
                dom.mainContent.inert = false;
            }
        };

        // Evento de clic
        dom.menuToggle.addEventListener('click', () => toggleMenu(!state.isMenuOpen));

        // Evento de teclado (ESC)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isMenuOpen) toggleMenu(false);
        });

        // Cierre al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (state.isMenuOpen && !e.target.closest('.navbar')) {
                toggleMenu(false);
            }
        });
    };

    /**
     * Maneja el scroll suave
     */
    const handleSmoothScroll = () => {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;

            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const finalPosition = targetPosition - config.smoothScrollOffset;

            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });

            if (state.isMenuOpen) handleMenu().toggleMenu(false);
        });
    };

    /**
     * Maneja el efecto de scroll en el header
     */
    const handleHeaderScroll = () => {
        if (!dom.header) return;

        const updateHeader = () => {
            const isScrolled = window.scrollY > config.headerScrollThreshold;
            const isScrollingDown = window.scrollY > state.lastScrollPosition;

            dom.header.classList.toggle('scrolled', isScrolled);
            dom.header.classList.toggle('hidden', isScrolled && isScrollingDown && window.scrollY > 200);

            state.lastScrollPosition = window.scrollY;
        };

        // Debounce para optimizar rendimiento
        const debouncedScroll = _.debounce(updateHeader, config.scrollDebounceTime);
        window.addEventListener('scroll', debouncedScroll);
        updateHeader(); // Estado inicial
    };

    /**
     * Maneja la validación de formularios
     */
    const handleFormValidation = () => {
        if (!dom.contactForm) return;

        const showError = (input, message) => {
            const error = input.nextElementSibling || document.createElement('span');
            error.className = 'error-message';
            error.textContent = message;
            input.classList.add('invalid');
            if (!input.nextElementSibling) input.parentNode.appendChild(error);
        };

        const clearError = (input) => {
            input.classList.remove('invalid');
            if (input.nextElementSibling?.classList.contains('error-message')) {
                input.nextElementSibling.remove();
            }
        };

        const validateField = (input) => {
            if (input.validity.valid) {
                clearError(input);
                return true;
            }

            const errorMessage = input.type === 'email' 
                ? 'Ingrese un correo válido' 
                : 'Este campo es obligatorio';
            
            showError(input, errorMessage);
            return false;
        };

        // Validación en tiempo real
        dom.contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => validateField(input));
        });

        // Validación al enviar
        dom.contactForm.addEventListener('submit', (e) => {
            const isValid = [...dom.contactForm.elements].every(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    return validateField(element);
                }
                return true;
            });

            if (!isValid) e.preventDefault();
        });
    };

    /**
     * Inicializa la aplicación
     */
    const init = () => {
        handleMenu();
        handleSmoothScroll();
        handleHeaderScroll();
        handleFormValidation();

        // Mejora de accesibilidad para el menú
        if (dom.navLinks) {
            dom.navLinks.querySelectorAll('a').forEach(link => {
                link.setAttribute('role', 'menuitem');
                link.setAttribute('tabindex', state.isMenuOpen ? '0' : '-1');
            });
        }

        // Carga diferida de imágenes
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
        }
    };

    return { init };
})();

// Inicialización
document.addEventListener('DOMContentLoaded', App.init);
// Actualización del módulo App
const App = (() => {
    // ... (config y state permanecen igual)

    /**
     * Mejoras en la validación de formularios
     */
    const handleFormValidation = () => {
        const forms = document.querySelectorAll('.contact-form');
        if (!forms.length) return;

        forms.forEach(form => {
            const showError = (input, message) => {
                // ... (código anterior)
            };

            const clearError = (input) => {
                // ... (código anterior)
            };

            const validateField = (input) => {
                if (input.validity.valid) {
                    clearError(input);
                    return true;
                }

                let errorMessage;
                switch(input.id) {
                    case 'nombre':
                        errorMessage = 'Por favor ingrese su nombre completo';
                        break;
                    case 'email':
                        errorMessage = 'Ingrese un correo electrónico válido';
                        break;
                    case 'telefono':
                        errorMessage = 'El teléfono debe tener 10 dígitos';
                        break;
                    case 'asunto':
                        errorMessage = 'Seleccione un motivo de contacto';
                        break;
                    case 'mensaje':
                        errorMessage = 'Escriba su mensaje';
                        break;
                    default:
                        errorMessage = 'Campo requerido';
                }
                
                showError(input, errorMessage);
                return false;
            };

            // Validación en tiempo real con debounce
            const debouncedValidation = _.debounce(input => {
                validateField(input);
            }, 300);

            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('input', () => debouncedValidation(input));
                
                // Validación especial para teléfono
                if(input.id === 'telefono') {
                    input.addEventListener('keypress', (e) => {
                        if(isNaN(e.key) || input.value.length >= 10) {
                            e.preventDefault();
                        }
                    });
                }
            });

            // Manejo de envío del formulario
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const isValid = [...form.elements].every(element => {
                    if (element.tagName === 'INPUT' || 
                        element.tagName === 'TEXTAREA' || 
                        element.tagName === 'SELECT') {
                        return validateField(element);
                    }
                    return true;
                });

                if (isValid) {
                    try {
                        const formData = new FormData(form);
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            form.reset();
                            showSuccessMessage();
                        } else {
                            throw new Error('Error en el envío');
                        }
                    } catch (error) {
                        showErrorMessage();
                    }
                }
            });
        });
    };

    /**
     * Mensajes de feedback del formulario
     */
    const showSuccessMessage = () => {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const message = document.createElement('div');
        message.className = 'form-message success';
        message.innerHTML = `
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
        `;
        
        document.querySelector('#contacto').appendChild(message);
        setTimeout(() => message.remove(), 5000);
    };

    const showErrorMessage = () => {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const message = document.createElement('div');
        message.className = 'form-message error';
        message.innerHTML = `
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>Error al enviar el mensaje. Por favor intenta nuevamente.</p>
        `;
        
        document.querySelector('#contacto').appendChild(message);
        setTimeout(() => message.remove(), 5000);
    };

    // ... (resto del código permanece igual)
})();
