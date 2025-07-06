/* ===== MODERN PROFESSIONAL PORTFOLIO JAVASCRIPT ===== */

// ===== INITIALIZATION =====
/**
 * Portfolio Website - Contact Form Configuration
 * 
 * To set up EmailJS for actual email sending:
 * 1. Sign up at https://www.emailjs.com/
 * 2. Create email service and template
 * 3. Replace these values in the initializeContactForm function:
 *    - emailjs.init("YOUR_PUBLIC_KEY")
 *    - const serviceID = 'your_service_id'
 *    - const templateID = 'your_template_id'
 * 
 * See README.md for detailed setup instructions.
 * 
 * Current status: Demo mode (shows success messages but doesn't send emails)
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS (Animate On Scroll) with error handling
  try {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
        delay: 100
      });
    }
  } catch (error) {
    // AOS not available, continue without animation
  }

  // Initialize core functionality with error handling
  try {
    initializeNavbar();
    initializeSkillBars();
    initializeThemeToggle();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeTypewriter();
    initializeScrollToTop();
    initializeProfileCard3D();
    initializeCounters();
    initializeHeroInteractions();

    // Initialize enhanced skills if elements exist
    setTimeout(() => {
      try {
        initializeEnhancedSkills();
      } catch (error) {
        // Enhanced skills not available
      }
    }, 500);
  } catch (error) {
    // Continue without advanced features if there are errors
  }

  // Add loading class removal after page load
  window.addEventListener('load', function () {
    try {
      document.body.classList.add('loaded');
    } catch (error) {
      // Continue without loaded class
    }
  });
});

// ===== NAVBAR FUNCTIONALITY =====
function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) {
    return;
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active link highlighting
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.slice(1) === current) {
        link.classList.add('active');
      }
    });
  }

  // Throttled scroll event
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Event listeners
  window.addEventListener('scroll', onScroll);

  // Mobile menu close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');

      if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}

// ===== OPTIMIZED SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        });
      }
    });
  });

  // Optimize scroll events for better performance
  let scrollTimeout;
  let isScrolling = false;

  window.addEventListener('scroll', function () {
    // If we're not already scrolling, disable pointer events
    if (!isScrolling) {
      document.body.style.pointerEvents = 'none';
      isScrolling = true;
    }

    // Clear the timeout
    clearTimeout(scrollTimeout);

    // Set a timeout to run after scrolling ends
    scrollTimeout = setTimeout(function () {
      // Scroll ended, re-enable pointer events
      document.body.style.pointerEvents = 'auto';
      isScrolling = false;
    }, 150);
  }, { passive: true });
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const level = skillBar.getAttribute('data-level');

        // Animate skill bar
        setTimeout(() => {
          skillBar.style.width = level + '%';
        }, 200);

        // Animate percentage counter
        animateCounter(skillBar, level);

        observer.unobserve(skillBar);
      }
    });
  }, observerOptions);

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target) {
  if (!element || isNaN(target) || target < 0) {
    console.warn('Invalid parameters for animateCounter');
    return;
  }

  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(start + (target - start) * easeOutCubic(progress));

    // Add suffix for certain numbers
    let displayValue = current;
    if (target >= 50) {
      displayValue = current + '+';
    } else if (target === 100) {
      displayValue = current + '%';
    }

    element.textContent = displayValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// ===== COUNTERS ANIMATION =====
function initializeCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.getAttribute('data-count'));

        animateCounter(element, target);
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  statNumbers.forEach(number => {
    observer.observe(number);
  });
}

// ===== EASING FUNCTION =====
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) {
    console.warn('Theme toggle element not found');
    return;
  }

  const body = document.body;
  const icon = themeToggle.querySelector('i');

  if (!icon) {
    console.warn('Theme toggle icon not found');
    return;
  }

  // Check for saved theme preference
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      body.classList.add(savedTheme);
      updateThemeIcon(savedTheme);
    }
  } catch (error) {
    console.warn('LocalStorage not available:', error);
  }

  themeToggle.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-theme');

    if (isDark) {
      body.classList.remove('dark-theme');
      try {
        localStorage.setItem('theme', 'light-theme');
      } catch (error) {
        console.warn('Cannot save theme to localStorage:', error);
      }
      updateThemeIcon('light-theme');
    } else {
      body.classList.add('dark-theme');
      try {
        localStorage.setItem('theme', 'dark-theme');
      } catch (error) {
        console.warn('Cannot save theme to localStorage:', error);
      }
      updateThemeIcon('dark-theme');
    }

    // Add bounce animation
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });

  function updateThemeIcon(theme) {
    if (!icon) return;

    if (theme === 'dark-theme') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

// ===== CONTACT FORM =====
function initializeContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  // Initialize EmailJS with a public key (can be left as demo for now)
  if (typeof emailjs !== 'undefined') {
    emailjs.init("demo_public_key"); // Replace with your actual EmailJS public key
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
      sendEmail();
    } else {
      showNotification('Please fill in all required fields correctly.', 'error');
    }
  });

  function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Clear previous error states
    clearErrorStates();

    let isValid = true;

    // Name validation
    if (!name || name.length < 2) {
      setFieldError('name', 'Name must be at least 2 characters');
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFieldError('email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }

    // Subject validation
    if (!subject || subject.length < 3) {
      setFieldError('subject', 'Subject must be at least 3 characters');
      isValid = false;
    }

    // Message validation
    if (!message || message.length < 10) {
      setFieldError('message', 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');

    field.classList.add('error');

    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  }

  function clearErrorStates() {
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');

    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(msg => msg.remove());
  }

  function sendEmail() {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');

    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'fas fa-spinner fa-spin';

    // Get form data
    const formData = {
      from_name: document.getElementById('name').value.trim(),
      from_email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      to_email: 'kavyaharidas280690@gmail.com'
    };

    // Try to send with EmailJS if available and configured
    if (typeof emailjs !== 'undefined' && emailjs.send) {
      // Replace these with your actual EmailJS service ID and template ID
      const serviceID = 'your_service_id';
      const templateID = 'your_template_id';

      emailjs.send(serviceID, templateID, formData)
        .then(function (response) {
          handleSuccess();
        })
        .catch(function (error) {
          // If EmailJS fails or isn't configured, show demo success
          handleSuccess(true);
        });
    } else {
      // Simulate email sending for demo purposes
      setTimeout(() => {
        handleSuccess(true);
      }, 1500);
    }

    function handleSuccess(isDemo = false) {
      const successMessage = isDemo
        ? `Thank you ${formData.from_name}! Your message has been received. This is a demo - in production, it would be sent to my email.`
        : `Thank you ${formData.from_name}! Your message has been sent successfully. I'll get back to you soon!`;

      showNotification(successMessage, 'success');
      form.reset();
      clearErrorStates();

      // Reset form labels
      const labels = form.querySelectorAll('label');
      labels.forEach(label => {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = 'var(--text-light)';
      });

      // Reset button state
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fas fa-paper-plane';
    }
  }

  // Enhanced form interactions
  const formGroups = document.querySelectorAll('.form-group, .form-group-enhanced');

  formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    const inputGlow = group.querySelector('.input-glow');

    if (input && label) {
      input.addEventListener('focus', () => {
        label.style.transform = 'translateY(-20px) scale(0.8)';
        label.style.color = 'var(--primary)';
        input.classList.remove('error');

        // Add glow effect for enhanced form
        if (inputGlow) {
          inputGlow.style.opacity = '1';
        }

        // Remove error message on focus
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          label.style.transform = 'translateY(0) scale(1)';
          label.style.color = 'var(--text-light)';
        }

        // Remove glow effect for enhanced form
        if (inputGlow) {
          inputGlow.style.opacity = '0';
        }
      });

      input.addEventListener('input', () => {
        // Remove error state while typing
        input.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
      });

      // Check for pre-filled values on load
      if (input.value) {
        label.style.transform = 'translateY(-20px) scale(0.8)';
      }
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Hide notification
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ===== OPTIMIZED PARALLAX EFFECTS =====
function initializeParallaxEffects() {
  // Disable parallax on mobile for better performance
  if (window.innerWidth <= 768) return;

  const parallaxElements = document.querySelectorAll('.hero-particles, .hero-gradient');
  if (parallaxElements.length === 0) {
    console.warn('No parallax elements found');
    return;
  }

  let lastScrollY = 0;
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;

    // Only update if scroll position changed significantly
    if (Math.abs(scrolled - lastScrollY) < 2) {
      ticking = false;
      return;
    }

    const rate = scrolled * -0.2; // Reduced parallax intensity

    parallaxElements.forEach(element => {
      if (element) {
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    });

    lastScrollY = scrolled;
    ticking = false;
  }

  // Highly throttled scroll event
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ===== ENHANCED TYPEWRITER EFFECT =====
function initializeTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) {
    return;
  }

  const roles = [
    'Senior Software Developer',
    'Full Stack Developer',
    'Data Analytics Expert',
    'Python Specialist',
    'React Developer'
  ];

  let currentRoleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function typeEffect() {
    const currentRole = roles[currentRoleIndex];

    if (isWaiting) {
      setTimeout(() => {
        isWaiting = false;
        isDeleting = true;
        typeEffect();
      }, 2000);
      return;
    }

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, currentCharIndex - 1);
      currentCharIndex--;

      if (currentCharIndex === 0) {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      }
    } else {
      typewriterElement.textContent = currentRole.substring(0, currentCharIndex + 1);
      currentCharIndex++;

      if (currentCharIndex === currentRole.length) {
        isWaiting = true;
      }
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
  }

  // Start the effect
  setTimeout(typeEffect, 1000);
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

  document.body.appendChild(scrollToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  // Smooth scroll to top
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== PRELOADER =====
function initializePreloader() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p>Loading...</p>
        </div>
    `;

  document.body.appendChild(preloader);

  // Hide preloader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== PROFILE CARD 3D =====
function initializeProfileCard3D() {
  const profileCard = document.getElementById('profileCard');
  if (!profileCard) {
    return;
  }

  // Simplified hover effect - no 3D transforms during mouse move
  profileCard.addEventListener('mouseenter', function () {
    profileCard.style.transition = 'transform 0.3s ease-out';
    profileCard.style.transform = 'translateY(-3px)';
  });

  profileCard.addEventListener('mouseleave', function () {
    profileCard.style.transition = 'transform 0.4s ease-out';
    profileCard.style.transform = 'translateY(0)';
  });

  // Quick action button ripple effects
  const quickActionBtns = document.querySelectorAll('.quick-action-btn');

  quickActionBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('div');
      ripple.className = 'btn-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Handle actions
      const action = btn.getAttribute('data-action');
      if (action === 'download-cv') {
        showNotification('CV download initiated!', 'success');
      } else if (action === 'schedule-call') {
        showNotification('Redirecting to calendar...', 'success');
      }
    });
  });

  // Tech badge interactions
  const techBadges = document.querySelectorAll('.tech-badge-3d');

  techBadges.forEach(badge => {
    badge.addEventListener('click', function () {
      const tech = this.getAttribute('data-tech');
      showNotification(`Exploring ${tech} projects...`, 'success');
    });
  });
}

// ===== HERO INTERACTIVE ELEMENTS =====
function initializeHeroInteractions() {
  // Floating tech icons interactions
  const techIcons = document.querySelectorAll('.tech-icon');

  techIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function () {
      const tech = this.getAttribute('data-tech');
      if (tech) {
        createTooltip(this, tech);
      }
    });

    icon.addEventListener('mouseleave', function () {
      removeTooltip();
    });
  });

  // Enhanced button interactions
  const enhancedBtns = document.querySelectorAll('.btn-enhanced');

  enhancedBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.05)';
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Achievement badge interactions
  const badges = document.querySelectorAll('.badge-item');

  badges.forEach(badge => {
    badge.addEventListener('click', function () {
      const badgeElement = this.querySelector('span');
      if (badgeElement) {
        const badgeText = badgeElement.textContent;
        showNotification(`🏆 ${badgeText} - Verified Achievement!`, 'success');
      }
    });
  });

  // Social link enhanced interactions
  const socialLinks = document.querySelectorAll('.social-link[data-platform]');

  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function () {
      const platform = this.getAttribute('data-platform');

      // Add platform-specific glow colors
      if (platform === 'linkedin') {
        this.style.boxShadow = '0 15px 30px rgba(72, 117, 180, 0.4)';
      } else if (platform === 'github') {
        this.style.boxShadow = '0 15px 30px rgba(36, 41, 46, 0.4)';
      } else if (platform === 'email') {
        this.style.boxShadow = '0 15px 30px rgba(234, 88, 12, 0.4)';
      }
    });

    link.addEventListener('mouseleave', function () {
      this.style.boxShadow = '';
    });
  });

  // Scroll indicator interaction
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }
}

// ===== TOOLTIP FUNCTIONALITY =====
function createTooltip(element, text) {
  removeTooltip(); // Remove any existing tooltip

  const tooltip = document.createElement('div');
  tooltip.className = 'tech-tooltip';
  tooltip.textContent = text.charAt(0).toUpperCase() + text.slice(1);

  // Style the tooltip
  Object.assign(tooltip.style, {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    pointerEvents: 'none',
    zIndex: '10000',
    transform: 'translateX(-50%)',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });

  document.body.appendChild(tooltip);

  // Position the tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.width / 2) + 'px';
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

  // Fade in
  setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 10);
}

function removeTooltip() {
  const existing = document.querySelector('.tech-tooltip');
  if (existing) {
    existing.remove();
  }
}

// ===== PARTICLES INTERACTION =====
function initializeParticleInteraction() {
  const heroSection = document.querySelector('.hero-section');

  if (!heroSection) {
    console.warn('Hero section not found for particle interaction');
    return;
  }

  // Throttle particle creation for performance
  let lastParticleTime = 0;
  const particleThrottle = 100; // milliseconds

  heroSection.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastParticleTime < particleThrottle) {
      return;
    }
    lastParticleTime = now;

    try {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create interactive particle
      const particle = document.createElement('div');
      particle.className = 'interactive-particle';

      Object.assign(particle.style, {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        width: '4px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'particleFade 1s ease-out forwards',
        zIndex: '1'
      });

      heroSection.appendChild(particle);

      setTimeout(() => {
        if (particle && particle.parentNode) {
          particle.remove();
        }
      }, 1000);
    } catch (error) {
      console.warn('Error creating particle:', error);
    }
  });
}

// ===== DYNAMIC STYLES =====
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 9999;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #10b981;
        }
        
        .notification.error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification.success .notification-content i {
            color: #10b981;
        }
        
        .notification.error .notification-content i {
            color: #ef4444;
        }
        
        /* Scroll to Top Button */
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .scroll-to-top.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Preloader */
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .preloader.fade-out {
            opacity: 0;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-spinner {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
        }
        
        .spinner-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
            width: 60px;
            height: 60px;
            top: 10px;
            left: 10px;
            border-top-color: #764ba2;
            animation-duration: 0.8s;
            animation-direction: reverse;
        }
        
        .spinner-ring:nth-child(3) {
            width: 40px;
            height: 40px;
            top: 20px;
            left: 20px;
            border-top-color: #06b6d4;
            animation-duration: 0.6s;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Button Ripple Effect */
        .btn-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Particle Animation */
        @keyframes particleFade {
            0% {
                opacity: 0.8;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(2);
            }
        }
        
        /* Form Error States */
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Loading State */
        .loaded {
            opacity: 1;
        }
        
        /* Responsive Notifications */
        @media (max-width: 768px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }
            
            .scroll-to-top {
                bottom: 15px;
                right: 15px;
                width: 45px;
                height: 45px;
            }
        }
    `;

  document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// ===== CONSOLE BRANDING =====
console.log(`
%c
██╗  ██╗ █████╗ ██╗   ██╗██╗   ██╗ █████╗ 
██║ ██╔╝██╔══██╗██║   ██║╚██╗ ██╔╝██╔══██╗
█████╔╝ ███████║██║   ██║ ╚████╔╝ ███████║
██╔═██╗ ██╔══██║╚██╗ ██╔╝  ╚██╔╝  ██╔══██║
██║  ██╗██║  ██║ ╚████╔╝    ██║   ██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝     ╚═╝   ╚═╝  ╚═╝

%cSenior Software Developer Portfolio
%cBuilt with ❤️ using modern web technologies
%cConnect with me: kavyaharidas280690@gmail.com
`,
  'color: #667eea; font-weight: bold;',
  'color: #764ba2; font-size: 16px; font-weight: bold;',
  'color: #06b6d4; font-size: 14px;',
  'color: #4a5568; font-size: 12px;'
);

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeNavbar,
    initializeSkillBars,
    initializeThemeToggle,
    initializeContactForm,
    showNotification,
    debounce,
    throttle
  };
}

// ===== ENHANCED TECHNICAL SKILLS SECTION =====

// Initialize Enhanced Skills Section
function initializeEnhancedSkills() {
  try {
    initializeSkillProgressAnimations();
    initializeSkillCardInteractions();
    initializeToolInteractions();
    initializeSkillsIntersectionObserver();
  } catch (error) {
    // Skills section will work without enhanced features
  }
}

// Animate skill progress bars when they come into view
function initializeSkillProgressAnimations() {
  const progressBars = document.querySelectorAll('.progress-bar');

  if (progressBars.length === 0) {
    console.warn('No progress bars found');
    return;
  }

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const level = progressBar.getAttribute('data-level');

        if (level) {
          setTimeout(() => {
            progressBar.style.width = level + '%';
          }, 200);
        }

        progressObserver.unobserve(progressBar);
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });
}

// Initialize skill card interactions
function initializeSkillCardInteractions() {
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillCards.length === 0) {
    return;
  }

  skillCards.forEach(card => {
    // Add click event for mobile devices
    card.addEventListener('click', function () {
      const inner = this.querySelector('.skill-card-inner');
      if (inner) {
        inner.style.transform = inner.style.transform === 'rotateY(180deg)'
          ? 'rotateY(0deg)'
          : 'rotateY(180deg)';
      }
    });

    // Add touch handling for mobile
    let touchStartTime = 0;

    card.addEventListener('touchstart', function (e) {
      touchStartTime = Date.now();
    });

    card.addEventListener('touchend', function (e) {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      // If it's a quick tap (less than 200ms), toggle the card
      if (touchDuration < 200) {
        e.preventDefault();
        const inner = this.querySelector('.skill-card-inner');
        if (inner) {
          inner.style.transform = inner.style.transform === 'rotateY(180deg)'
            ? 'rotateY(0deg)'
            : 'rotateY(180deg)';
        }
      }
    });

    // Add keyboard navigation
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const inner = this.querySelector('.skill-card-inner');
        if (inner) {
          inner.style.transform = inner.style.transform === 'rotateY(180deg)'
            ? 'rotateY(0deg)'
            : 'rotateY(180deg)';
        }
      }
    });

    // Make cards focusable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Click to flip skill card');
  });
}

// Initialize tool item interactions
function initializeToolInteractions() {
  const toolItems = document.querySelectorAll('.tool-item');

  if (toolItems.length === 0) {
    return;
  }

  toolItems.forEach(item => {
    // Add ripple effect on click
    item.addEventListener('click', function (e) {
      createRippleEffect(e, this);
    });

    // Add keyboard navigation
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        createRippleEffect(e, this);
      }
    });

    // Make items focusable
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });
}

// Create ripple effect for interactive elements
function createRippleEffect(event, element) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('div');
  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;

  element.style.position = 'relative';
  element.appendChild(ripple);

  setTimeout(() => {
    if (ripple && ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
}

// Initialize intersection observer for performance optimization
function initializeSkillsIntersectionObserver() {
  const skillsSection = document.querySelector('.skills-section');
  const particles = document.querySelectorAll('.particle');
  const codeElements = document.querySelectorAll('.code-element');

  if (!skillsSection) {
    console.warn('Skills section not found');
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  const skillsSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Enable animations when section is visible
        particles.forEach(particle => {
          particle.style.animationPlayState = 'running';
        });
        codeElements.forEach(element => {
          element.style.animationPlayState = 'running';
        });

        // Animate category icons
        const categoryIcons = entry.target.querySelectorAll('.category-icon');
        categoryIcons.forEach((icon, index) => {
          setTimeout(() => {
            icon.style.transform = 'scale(1.1)';
            setTimeout(() => {
              icon.style.transform = 'scale(1)';
            }, 300);
          }, index * 200);
        });

      } else {
        // Pause animations when section is not visible for performance
        particles.forEach(particle => {
          particle.style.animationPlayState = 'paused';
        });
        codeElements.forEach(element => {
          element.style.animationPlayState = 'paused';
        });
      }
    });
  }, observerOptions);

  skillsSectionObserver.observe(skillsSection);
}

// Initialize skill level displays with counting animation
function initializeSkillLevelDisplays() {
  const levelDisplays = document.querySelectorAll('.skill-level-display');

  if (levelDisplays.length === 0) {
    console.warn('No skill level displays found');
    return;
  }

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const levelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const display = entry.target;
        const targetLevel = parseInt(display.textContent.replace('%', ''));

        if (targetLevel && !isNaN(targetLevel)) {
          animateCountToTarget(display, 0, targetLevel, 1500);
        }

        levelObserver.unobserve(display);
      }
    });
  }, observerOptions);

  levelDisplays.forEach(display => {
    levelObserver.observe(display);
  });
}

// Animate counting to target number
function animateCountToTarget(element, start, end, duration) {
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easeOutQuart for smooth animation
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.round(start + (end - start) * easeProgress);

    element.textContent = currentValue + '%';

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

// Initialize cloud skill cards with enhanced interactions
function initializeCloudSkillCards() {
  const cloudCards = document.querySelectorAll('.cloud-skill-card');

  if (cloudCards.length === 0) {
    console.warn('No cloud skill cards found');
    return;
  }

  cloudCards.forEach(card => {
    // Add hover sound effect (optional)
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });

    // Add click interaction
    card.addEventListener('click', function () {
      const level = this.querySelector('.cloud-level');
      if (level) {
        level.style.transform = 'scale(1.1)';
        setTimeout(() => {
          level.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

// Initialize staggered animation for skill cards
function initializeStaggeredSkillAnimation() {
  const skillCards = document.querySelectorAll('.skill-card');
  const cloudCards = document.querySelectorAll('.cloud-skill-card');
  const toolGroups = document.querySelectorAll('.tool-group');

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const elements = entry.target.querySelectorAll('.skill-card, .cloud-skill-card, .tool-group');

        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, index * 100);
        });

        staggerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Initially hide elements for staggered animation
  [...skillCards, ...cloudCards, ...toolGroups].forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Observe parent containers
  const skillsGrids = document.querySelectorAll('.skills-grid, .cloud-skills-grid, .tools-showcase');
  skillsGrids.forEach(grid => {
    staggerObserver.observe(grid);
  });
}

// Initialize enhanced tooltips for skills
function initializeSkillTooltips() {
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillCards.length === 0) {
    console.warn('No skill cards found for tooltips');
    return;
  }

  skillCards.forEach(card => {
    const skillName = card.querySelector('.skill-name');
    const skillLevel = card.querySelector('.skill-level-display');

    if (skillName && skillLevel) {
      const tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.textContent = `${skillName.textContent}: ${skillLevel.textContent}`;
      tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.9rem;
                z-index: 1000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                white-space: nowrap;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
            `;

      card.style.position = 'relative';
      card.appendChild(tooltip);

      card.addEventListener('mouseenter', function () {
        tooltip.style.opacity = '1';
      });

      card.addEventListener('mouseleave', function () {
        tooltip.style.opacity = '0';
      });
    }
  });
}

// Initialize particle interaction effects
function initializeParticleInteractions() {
  const particles = document.querySelectorAll('.particle');
  const skillsSection = document.querySelector('.skills-section');

  if (!skillsSection || particles.length === 0) {
    console.warn('Particles or skills section not found');
    return;
  }

  // Add mouse interaction with particles
  skillsSection.addEventListener('mousemove', function (e) {
    if (window.innerWidth <= 768) return; // Skip on mobile for performance

    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    particles.forEach((particle, index) => {
      const particleRect = particle.getBoundingClientRect();
      const particleX = particleRect.left + particleRect.width / 2 - rect.left;
      const particleY = particleRect.top + particleRect.height / 2 - rect.top;

      const distance = Math.sqrt(Math.pow(x - particleX, 2) + Math.pow(y - particleY, 2));
      const maxDistance = 100;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const angle = Math.atan2(particleY - y, particleX - x);
        const moveX = Math.cos(angle) * force * 20;
        const moveY = Math.sin(angle) * force * 20;

        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        particle.style.opacity = Math.min(0.5, 0.1 + force * 0.4);
      } else {
        particle.style.transform = 'translate(0, 0)';
        particle.style.opacity = '0.1';
      }
    });
  });

  // Reset particles on mouse leave
  skillsSection.addEventListener('mouseleave', function () {
    particles.forEach(particle => {
      particle.style.transform = 'translate(0, 0)';
      particle.style.opacity = '0.1';
    });
  });
}

// Initialize enhanced skills section with all features
function initializeEnhancedSkillsComplete() {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    initializeEnhancedSkills();
    initializeSkillLevelDisplays();
    initializeCloudSkillCards();
    initializeStaggeredSkillAnimation();
    initializeSkillTooltips();
    initializeParticleInteractions();
  });
}

// ===== ADVANCED TECHNICAL SKILLS SECTION =====

// Initialize Advanced Skills Section
function initializeAdvancedSkills() {
  try {
    initializeSkillsSearch();
    initializeSkillsFiltering();
    initializeCircularProgressAnimations();
    initializeAdvancedSkillInteractions();
    initializeSkillsIntersectionObserver();
    initializeSkillComparison();
    initializeHorizontalProgressBars();
    console.log('Advanced skills section initialized successfully');
  } catch (error) {
    console.warn('Error initializing advanced skills section:', error);
  }
}

// Search functionality
function initializeSkillsSearch() {
  const searchInput = document.getElementById('skillsSearch');
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.toLowerCase().trim();
      filterSkillsBySearch(query);
    }, 300);
  });
}

function filterSkillsBySearch(query) {
  const skillCards = document.querySelectorAll('.skill-card, .cloud-skill-card, .tool-item');
  const categories = document.querySelectorAll('.skill-category');

  skillCards.forEach(card => {
    const skillName = card.querySelector('h4, h5, span')?.textContent.toLowerCase() || '';
    const skillData = card.dataset.skill?.toLowerCase() || '';
    const isVisible = !query || skillName.includes(query) || skillData.includes(query);

    if (isVisible) {
      card.classList.remove('filtered-out');
      card.style.display = '';
    } else {
      card.classList.add('filtered-out');
    }
  });

  // Show/hide categories based on visible skills
  categories.forEach(category => {
    const visibleSkills = category.querySelectorAll('.skill-card:not(.filtered-out), .cloud-skill-card:not(.filtered-out), .tool-item:not(.filtered-out)');
    if (visibleSkills.length > 0) {
      category.style.display = '';
      category.classList.remove('filtered-out');
    } else {
      category.classList.add('filtered-out');
    }
  });
}

// Filtering functionality
function initializeSkillsFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      filterSkillsByCategory(filter);
    });
  });
}

function filterSkillsByCategory(filter) {
  const categories = document.querySelectorAll('.skill-category');
  const skillCards = document.querySelectorAll('.skill-card, .cloud-skill-card, .tool-item');

  categories.forEach(category => {
    const categoryFilter = category.dataset.category;

    if (filter === 'all' || categoryFilter === filter) {
      category.style.display = '';
      category.classList.remove('filtered-out');

      // Show all skills in this category
      const categorySkills = category.querySelectorAll('.skill-card, .cloud-skill-card, .tool-item');
      categorySkills.forEach(skill => {
        skill.classList.remove('filtered-out');
        skill.style.display = '';
      });
    } else {
      category.classList.add('filtered-out');
    }
  });

  // Add smooth animation
  setTimeout(() => {
    categories.forEach(category => {
      if (category.classList.contains('filtered-out')) {
        category.style.display = 'none';
      }
    });
  }, 500);
}

// Circular progress animations
function initializeCircularProgressAnimations() {
  const progressElements = document.querySelectorAll('.circular-progress');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressElement = entry.target;
        const percentage = progressElement.dataset.percentage;
        animateCircularProgress(progressElement, percentage);
      }
    });
  }, { threshold: 0.5 });

  progressElements.forEach(element => {
    observer.observe(element);
  });
}

function animateCircularProgress(element, percentage) {
  const progressCircle = element.querySelector('.progress-circle');
  const progressText = element.querySelector('.progress-text');

  if (!progressCircle || !progressText) return;

  // Set CSS custom property for conic-gradient
  progressCircle.style.setProperty('--percentage', `${percentage}%`);

  // Animate the text
  let current = 0;
  const increment = percentage / 50; // 50 frames for smooth animation

  function updateText() {
    if (current < percentage) {
      current += increment;
      progressText.textContent = `${Math.round(current)}%`;
      requestAnimationFrame(updateText);
    } else {
      progressText.textContent = `${percentage}%`;
    }
  }

  updateText();
}

// Horizontal progress bars
function initializeHorizontalProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-horizontal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.dataset.width;

        setTimeout(() => {
          progressBar.style.width = `${width}%`;
        }, 200);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Advanced skill interactions
function initializeAdvancedSkillInteractions() {
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach(card => {
    // Add hover effect for highlighting
    card.addEventListener('mouseenter', function () {
      this.classList.add('highlighted');
    });

    card.addEventListener('mouseleave', function () {
      this.classList.remove('highlighted');
    });

    // Add click event for detailed view
    card.addEventListener('click', function () {
      showSkillDetails(this);
    });
  });

  // Tool item interactions
  const toolItems = document.querySelectorAll('.tool-item');
  toolItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.05)';
    });

    item.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
}

function showSkillDetails(skillCard) {
  const skillName = skillCard.querySelector('.skill-name')?.textContent || skillCard.querySelector('h4')?.textContent;
  const skillLevel = skillCard.dataset.level || '90';
  const skillCategory = skillCard.dataset.category || 'General';

  // Create modal or expanded view
  const modal = document.createElement('div');
  modal.className = 'skill-details-modal';
  modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${skillName}</h3>
            <p>Proficiency: ${skillLevel}%</p>
            <p>Category: ${skillCategory}</p>
            <div class="skill-progress-detail">
                <div class="progress-bar-detail" style="width: ${skillLevel}%"></div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Close modal functionality
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });

  // Animate in
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Skill comparison feature
function initializeSkillComparison() {
  const skillCards = document.querySelectorAll('.skill-card');
  let selectedSkills = [];

  skillCards.forEach(card => {
    card.addEventListener('dblclick', function () {
      const skillName = this.querySelector('.skill-name')?.textContent;
      const skillLevel = this.dataset.level;

      if (selectedSkills.length < 2) {
        selectedSkills.push({ name: skillName, level: skillLevel });
        this.classList.add('selected-for-comparison');

        if (selectedSkills.length === 2) {
          showSkillComparison(selectedSkills);
          // Reset selection
          selectedSkills = [];
          document.querySelectorAll('.selected-for-comparison').forEach(el => {
            el.classList.remove('selected-for-comparison');
          });
        }
      }
    });
  });
}

function showSkillComparison(skills) {
  const comparison = document.createElement('div');
  comparison.className = 'skill-comparison active';
  comparison.innerHTML = `
        <button class="comparison-close">&times;</button>
        <div class="comparison-header">
            <h3>Skill Comparison</h3>
        </div>
        <div class="comparison-skills">
            ${skills.map(skill => `
                <div class="comparison-skill">
                    <h4>${skill.name}</h4>
                    <div class="comparison-level">${skill.level}%</div>
                    <div class="comparison-bar">
                        <div class="comparison-fill" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

  document.body.appendChild(comparison);

  // Close functionality
  const closeBtn = comparison.querySelector('.comparison-close');
  closeBtn.addEventListener('click', () => {
    comparison.remove();
  });
}

// Skills intersection observer for performance
function initializeSkillsIntersectionObserver() {
  const skillElements = document.querySelectorAll('.skill-card, .cloud-skill-card, .tool-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px 0px'
  });

  skillElements.forEach(element => {
    observer.observe(element);
  });
}

// Floating skill icons animation
function initializeFloatingSkillIcons() {
  const floatingIcons = document.querySelectorAll('.floating-icon');

  floatingIcons.forEach((icon, index) => {
    // Add random movement
    icon.addEventListener('mouseenter', function () {
      this.style.transform = `scale(1.2) rotate(${Math.random() * 360}deg)`;
      this.style.opacity = '0.8';
    });

    icon.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.opacity = '0.3';
    });
  });
}

// Skill level indicators
function initializeSkillLevelIndicators() {
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach(card => {
    const level = parseInt(card.dataset.level);
    const levelDisplay = card.querySelector('.skill-level-display');

    if (levelDisplay) {
      // Add color coding based on level
      if (level >= 90) {
        levelDisplay.style.color = '#10b981'; // Green for expert
      } else if (level >= 75) {
        levelDisplay.style.color = '#f59e0b'; // Orange for advanced
      } else if (level >= 60) {
        levelDisplay.style.color = '#3b82f6'; // Blue for intermediate
      } else {
        levelDisplay.style.color = '#6b7280'; // Gray for beginner
      }
    }
  });
}

// Skill tooltips
function initializeSkillTooltips() {
  const skillElements = document.querySelectorAll('[data-skill]');

  skillElements.forEach(element => {
    const skillName = element.dataset.skill;
    const skillLevel = element.dataset.level;

    element.addEventListener('mouseenter', function (e) {
      const tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.innerHTML = `
                <div class="tooltip-content">
                    <h4>${skillName}</h4>
                    <p>Proficiency: ${skillLevel}%</p>
                </div>
            `;

      document.body.appendChild(tooltip);

      // Position tooltip
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

      // Store tooltip reference
      element._tooltip = tooltip;
    });

    element.addEventListener('mouseleave', function () {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });
}

// Skill statistics
function calculateSkillStatistics() {
  const skillCards = document.querySelectorAll('.skill-card');
  const stats = {
    frontend: [],
    backend: [],
    cloud: [],
    tools: []
  };

  skillCards.forEach(card => {
    const category = card.dataset.category;
    const level = parseInt(card.dataset.level);

    if (stats[category]) {
      stats[category].push(level);
    }
  });

  // Calculate averages
  const averages = {};
  Object.keys(stats).forEach(category => {
    if (stats[category].length > 0) {
      averages[category] = Math.round(
        stats[category].reduce((sum, level) => sum + level, 0) / stats[category].length
      );
    }
  });

  return averages;
}

// Update skill overview with calculated statistics
function updateSkillOverview() {
  const stats = calculateSkillStatistics();
  const overviewStats = document.querySelectorAll('.overview-stats .stat-item');

  overviewStats.forEach(statItem => {
    const category = statItem.textContent.toLowerCase();
    const progressElement = statItem.querySelector('.circular-progress');

    if (progressElement && stats[category]) {
      progressElement.dataset.percentage = stats[category];
    }
  });
}

// Enhanced skill card animations
function initializeSkillCardAnimations() {
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'skill-ripple';
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });
}

// Skill achievements system
function initializeSkillAchievements() {
  const achievements = [
    { id: 'expert', threshold: 90, name: 'Expert Level', icon: '🏆' },
    { id: 'advanced', threshold: 75, name: 'Advanced', icon: '⭐' },
    { id: 'intermediate', threshold: 60, name: 'Intermediate', icon: '💪' }
  ];

  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach(card => {
    const level = parseInt(card.dataset.level);
    const badgeContainer = card.querySelector('.skill-badges');

    if (badgeContainer) {
      achievements.forEach(achievement => {
        if (level >= achievement.threshold) {
          const badge = document.createElement('span');
          badge.className = `badge ${achievement.id}`;
          badge.textContent = achievement.name;
          badge.title = `${achievement.name} (${achievement.threshold}%+)`;

          // Only add if not already exists
          if (!badgeContainer.querySelector(`.badge.${achievement.id}`)) {
            badgeContainer.appendChild(badge);
          }
        }
      });
    }
  });
}

// Performance monitoring
function monitorSkillsSectionPerformance() {
  const startTime = performance.now();

  // Monitor animation performance
  const animationElements = document.querySelectorAll('.skill-card, .floating-icon, .constellation-line');

  let frameCount = 0;
  function countFrames() {
    frameCount++;
    if (frameCount % 60 === 0) { // Check every 60 frames
      const currentTime = performance.now();
      const fps = 60000 / (currentTime - startTime);

      if (fps < 30) {
        // Reduce animations if performance is poor
        document.documentElement.style.setProperty('--reduce-animations', '1');
        console.warn('Reduced animations due to performance concerns');
      }
    }
    requestAnimationFrame(countFrames);
  }

  requestAnimationFrame(countFrames);
}

// Initialize all advanced features
function initializeAllAdvancedFeatures() {
  try {
    initializeAdvancedSkills();
    initializeFloatingSkillIcons();
    initializeSkillLevelIndicators();
    initializeSkillTooltips();
    initializeSkillCardAnimations();
    initializeSkillAchievements();
    updateSkillOverview();
    monitorSkillsSectionPerformance();

    console.log('All advanced skills features initialized successfully');
  } catch (error) {
    console.warn('Error initializing advanced features:', error);
  }
}

/* ===== NEW SKILLS SECTION FUNCTIONALITY ===== */

function initializeNewSkillsSection() {
  initializeSkillsNavigation();
  initializeSkillsProgressBars();
  initializeSkillsIntersectionObserver();
  initializeSkillsOverview();
  initializeSkillsHoverEffects();
}

function initializeSkillsNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const skillsCategories = document.querySelectorAll('.skills-category');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update active button
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide categories
      skillsCategories.forEach(cat => {
        if (category === 'all') {
          cat.style.display = 'block';
          cat.style.animation = 'fadeInUp 0.6s ease forwards';
        } else if (cat.classList.contains(category)) {
          cat.style.display = 'block';
          cat.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
          cat.style.display = 'none';
        }
      });
    });
  });
}

function initializeSkillsProgressBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const levelFill = entry.target.querySelector('.level-fill');
        const width = levelFill.dataset.width;

        setTimeout(() => {
          levelFill.style.width = width + '%';
        }, 200);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
  });
}

function initializeSkillsIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      }
    });
  }, { threshold: 0.2 });

  // Observe all skills categories
  document.querySelectorAll('.skills-category').forEach(category => {
    observer.observe(category);
  });

  // Observe overview cards
  document.querySelectorAll('.overview-card').forEach(card => {
    observer.observe(card);
  });
}

function initializeSkillsOverview() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target.querySelector('.stat-circle');
        const percentage = circle.dataset.percentage;
        const percentageText = entry.target.querySelector('.percentage');

        animateCircularProgress(circle, percentage, percentageText);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.overview-card').forEach(card => {
    observer.observe(card);
  });
}

function animateCircularProgress(circle, targetPercentage, textElement) {
  const circumference = 2 * Math.PI * 56; // radius of 56px
  const duration = 2000;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentPercentage = Math.round(targetPercentage * progress);
    const offset = circumference - (circumference * progress * targetPercentage / 100);

    // Update text
    textElement.textContent = currentPercentage + '%';

    // Update circle background
    const angle = (360 * currentPercentage / 100);
    circle.style.background = `conic-gradient(#6366f1 0deg, #8b5cf6 ${angle}deg, rgba(255, 255, 255, 0.1) ${angle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    }
  }

  requestAnimationFrame(updateProgress);
}

function initializeSkillsHoverEffects() {
  // Add enhanced hover effects for skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-8px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add enhanced hover effects for tool cards
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add ripple effect to navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('div');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(${x}px, ${y}px) scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
            `;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Initialize the new skills section when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Add to existing initialization
  if (typeof initializeNewSkillsSection === 'function') {
    initializeNewSkillsSection();
  }
});

// Add ripple animation to CSS via JavaScript
function addSkillsAnimations() {
  const style = document.createElement('style');
  style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .skill-item, .tool-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-btn {
            position: relative;
            overflow: hidden;
        }
    `;
  document.head.appendChild(style);
}

// Call this when the page loads
addSkillsAnimations();

// Add smooth scrolling to skills section
function scrollToSkillsSection() {
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Enhanced level bar animation with easing
function animateSkillLevel(levelFill, targetWidth) {
  const duration = 1500;
  const startTime = performance.now();
  const startWidth = 0;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateWidth(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentWidth = startWidth + (targetWidth - startWidth) * easedProgress;

    levelFill.style.width = currentWidth + '%';

    if (progress < 1) {
      requestAnimationFrame(updateWidth);
    }
  }

  requestAnimationFrame(updateWidth);
}

// Add keyboard navigation support
function initializeSkillsKeyboardNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  let currentIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (document.activeElement.closest('.skills-section')) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          currentIndex = Math.max(0, currentIndex - 1);
          navBtns[currentIndex].focus();
          break;
        case 'ArrowRight':
          e.preventDefault();
          currentIndex = Math.min(navBtns.length - 1, currentIndex + 1);
          navBtns[currentIndex].focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          document.activeElement.click();
          break;
      }
    }
  });

  navBtns.forEach((btn, index) => {
    btn.addEventListener('focus', () => {
      currentIndex = index;
    });
  });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', function () {
  initializeSkillsKeyboardNavigation();
}); 