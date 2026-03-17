/* ====================================
   CLÍNICA DENTAL SONRISA - SCRIPT
   ==================================== */

(function() {
  'use strict';

  // === VARIABLES GLOBALES ===
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');

  // === NAVEGACIÓN MÓVIL ===
  function initMobileNav() {
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('show');
        navToggle.setAttribute('aria-expanded', isOpen);
        
        // Animación del hamburger
        const hamburger = navToggle.querySelector('.hamburger');
        if (hamburger) {
          if (isOpen) {
            hamburger.style.background = 'transparent';
          } else {
            hamburger.style.background = '';
          }
        }
      });

      // Cerrar menú al hacer click en un link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Cerrar menú al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          navMenu.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // === HEADER SCROLL ===
  function initHeaderScroll() {
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Ejecutar al cargar
  }

  // === SCROLL TO TOP BUTTON ===
  function initScrollTop() {
    if (!scrollTopBtn) return;

    function updateScrollTopBtn() {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', updateScrollTopBtn);
    updateScrollTopBtn(); // Ejecutar al cargar
  }

  // === SMOOTH SCROLL PARA ENLACES INTERNOS ===
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignorar enlaces a "#" solamente
        if (href === '#') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // === ANIMACIÓN DE ELEMENTOS AL HACER SCROLL ===
  function initScrollAnimation() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Elementos a animar
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .value-card, .team-member');
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  // === VALIDACIÓN DE FORMULARIO ===
  function initFormValidation() {
    if (!contactForm) return;

    // Expresiones regulares
    const patterns = {
      name: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,50}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\d\s\-\+\(\)]{8,20}$/,
      message: /^.{10,500}$/
    };

    // Mensajes de error
    const errorMessages = {
      name: 'Por favor ingresa un nombre válido (mínimo 3 caracteres)',
      email: 'Por favor ingresa un email válido',
      phone: 'Por favor ingresa un teléfono válido',
      message: 'El mensaje debe tener entre 10 y 500 caracteres',
      privacy: 'Debes aceptar la política de privacidad'
    };

    // Función para mostrar error
    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.form-error');
      
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    }

    // Función para limpiar error
    function clearError(input) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.form-error');
      
      input.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    // Función para validar un campo
    function validateField(input) {
      const value = input.value.trim();
      const name = input.name;

      // Campo vacío
      if (!value && input.required) {
        showError(input, 'Este campo es obligatorio');
        return false;
      }

      // Validar con patrón si existe
      if (patterns[name] && !patterns[name].test(value)) {
        showError(input, errorMessages[name]);
        return false;
      }

      // Checkbox de privacidad
      if (input.type === 'checkbox' && input.required && !input.checked) {
        showError(input, errorMessages[name]);
        return false;
      }

      clearError(input);
      return true;
    }

    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Validar al salir del campo
      input.addEventListener('blur', () => {
        if (input.value || input.required) {
          validateField(input);
        }
      });

      // Limpiar error al escribir
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          clearError(input);
        }
      });
    });

    // Validación al enviar
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const formData = {};

      // Validar todos los campos
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        } else {
          formData[input.name] = input.value;
        }
      });

      // Si el formulario es válido
      if (isValid) {
        // Aquí normalmente enviarías los datos a un servidor
        console.log('Formulario válido. Datos:', formData);
        
        // Simular envío exitoso
        setTimeout(() => {
          showSuccessMessage();
          contactForm.reset();
        }, 500);
      } else {
        // Scroll al primer error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          const headerHeight = header ? header.offsetHeight : 80;
          const errorPosition = firstError.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: errorPosition,
            behavior: 'smooth'
          });
        }
      }
    });

    // Mostrar mensaje de éxito
    function showSuccessMessage() {
      const successDiv = document.getElementById('formSuccess');
      if (successDiv) {
        successDiv.style.display = 'block';
        
        // Scroll al mensaje
        setTimeout(() => {
          successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Ocultar después de 5 segundos
        setTimeout(() => {
          successDiv.style.display = 'none';
        }, 5000);
      }
    }
  }

  // === LAZY LOADING DE IMÁGENES ===
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Forzar carga
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores antiguos
      images.forEach(img => {
        img.src = img.src;
      });
    }
  }

  // === GESTIÓN DE LINKS EXTERNOS ===
  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      // Asegurar que tengan rel="noopener noreferrer"
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // === DETECCIÓN DE NAVEGADOR Y DISPOSITIVO ===
  function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    
    if (isMobile) {
      document.body.classList.add('is-mobile');
    }
    if (isTablet) {
      document.body.classList.add('is-tablet');
    }
  }

  // === PRELOADER (OPCIONAL) ===
  function initPreloader() {
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }
    });
  }

  // === ACCESSIBILITY: SKIP TO CONTENT ===
  function initSkipToContent() {
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
          main.removeAttribute('tabindex');
        }
      });
    }
  }

  // === MODO OSCURO (OPCIONAL) ===
  function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // === ANIMACIÓN DEL CONTADOR (PARA ESTADÍSTICAS) ===
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+$/.test(target);
    
    if (!isNumber) return;

    const number = parseInt(target);
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, duration / steps);
  }

  // === CARRUSEL SIMPLE (SI EXISTE) ===
  function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }

    showSlide(0);
  }

  // === MANEJO DE ERRORES GLOBAL ===
  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Error capturado:', e.error);
      // Aquí podrías enviar el error a un servicio de logging
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Promise rechazada:', e.reason);
    });
  }

  // === PREVENCIÓN DE DOBLE SUBMIT ===
  function preventDoubleSubmit() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
          
          // Reactivar después de 3 segundos por si falla el envío
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Mensaje';
          }, 3000);
        }
      });
    });
  }

  // === GOOGLE ANALYTICS (SI SE USA) ===
  function initAnalytics() {
    // Tracking de clicks en botones importantes
    const trackButtons = document.querySelectorAll('[data-track]');
    
    trackButtons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-track');
        console.log('Tracking:', action);
        
        // Si tienes Google Analytics:
        // gtag('event', 'click', { event_category: 'button', event_label: action });
      });
    });
  }

  // === INICIALIZACIÓN ===
  function init() {
    // Funciones principales
    initMobileNav();
    initHeaderScroll();
    initScrollTop();
    initSmoothScroll();
    initFormValidation();
    
    // Funciones secundarias
    initLazyLoading();
    initExternalLinks();
    initScrollAnimation();
    initCounterAnimation();
    detectDevice();
    initPreloader();
    initSkipToContent();
    initCarousel();
    preventDoubleSubmit();
    initAnalytics();
    initErrorHandling();

    // Log de inicialización
    console.log('✅ Clínica Dental Sonrisa - Script cargado correctamente');
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
