/**
 * app.js
 * Governs horizontal sliding carousel navigation, keyboard navigation,
 * active link updates, arrow button states, and the touch-supported cue card carousel.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliderTrack = document.querySelector('.slider-track');
  const slideLinks = document.querySelectorAll('.slide-link');
  const cueCards = document.querySelectorAll('.cue-card');
  const arrowLeft = document.querySelector('.slide-arrow-left');
  const arrowRight = document.querySelector('.slide-arrow-right');
  
  let currentSlide = 0;
  const totalSlides = 7;

  // Horizontal slide translation function
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlide = index;

    // Translate the track horizontally using viewport width (vw)
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}vw)`;

    // Update active slide class
    document.querySelectorAll('.slide').forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Update slide-out nav links active class
    slideLinks.forEach(link => {
      const slideIndex = parseInt(link.getAttribute('data-slide'), 10);
      if (slideIndex === currentSlide) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle disabled state on navigation arrows
    if (arrowLeft) {
      arrowLeft.disabled = (currentSlide === 0);
    }
    if (arrowRight) {
      arrowRight.disabled = (currentSlide === totalSlides - 1);
    }
  }

  // Track mouseStartX on mousedown/touchstart
  let mouseStartX = 0;
  document.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
  }, { passive: true });
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      mouseStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  // Nav links event bindings are handled at the bottom

  // Cue card navigation and interaction
  cueCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Prevent navigation if dragging
      if (Math.abs(e.clientX - mouseStartX) > 10) return;
      
      const cardNumber = this.querySelector('.cue-number').textContent;
      const slideIndex = parseInt(cardNumber, 10);
      
      // Navigate to corresponding slide
      if (typeof goToSlide === 'function' && !isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
    });
    
    // Add cursor pointer
    card.style.cursor = 'pointer';
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });

    // Keyboard navigation
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Bind Left Slide Arrow click event
  if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    });
  }

  // Bind Right Slide Arrow click event
  if (arrowRight) {
    arrowRight.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    });
  }

  // --- Cue Card Carousel with Touch & Drag Support ---
  (function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentCarousel = 0;

    // Expose hooks for external keyboard navigation
    window.prevCarouselSlide = function() {
      goToCarouselSlide(currentCarousel - 1);
    };
    window.nextCarouselSlide = function() {
      goToCarouselSlide(currentCarousel + 1);
    };
    window.getCarouselCurrentSlide = function() {
      return currentCarousel;
    };
    window.getCarouselTotalSlides = function() {
      return totalSlides;
    };

    function goToCarouselSlide(index) {
      // Prevent out-of-bounds navigation
      if (index < 0 || index >= totalSlides) return;
      
      currentCarousel = index;
      
      // Slide the track
      track.style.transform = 'translateX(-' + (currentCarousel * 100) + '%)';
      
      // Update dots
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === currentCarousel);
      });
      
      // AUTOMATIC ARROW LOGIC:
      // Disable prev button on first slide
      if (prevBtn) {
        prevBtn.disabled = (currentCarousel === 0);
      }
      
      // Disable next button on last slide
      if (nextBtn) {
        nextBtn.disabled = (currentCarousel === totalSlides - 1);
      }
      
      // If only 1 slide exists, hide both arrows
      if (totalSlides <= 1) {
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      }
    }

    // Dot clicks (using data-index from index.html)
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goToCarouselSlide(parseInt(dot.dataset.index, 10));
      });
    });

    // Arrow clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goToCarouselSlide(currentCarousel - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goToCarouselSlide(currentCarousel + 1);
      });
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startX = 0;

    track.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      var currentX = e.touches[0].clientX;
      var diff = currentX - startX;
      var baseTranslate = -(currentCarousel * 100);
      var pxToPercent = (diff / track.parentElement.offsetWidth) * 100;
      track.style.transform = 'translateX(' + (baseTranslate + pxToPercent) + '%)';
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
      isDragging = false;
      track.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      touchEndX = e.changedTouches[0].clientX;
      var swipeDistance = touchStartX - touchEndX;
      
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0 && currentCarousel < totalSlides - 1) {
          goToCarouselSlide(currentCarousel + 1);
        } else if (swipeDistance < 0 && currentCarousel > 0) {
          goToCarouselSlide(currentCarousel - 1);
        } else {
          goToCarouselSlide(currentCarousel);
        }
      } else {
        goToCarouselSlide(currentCarousel);
      }
    });

    // Mouse drag support
    var mouseStartX = 0;
    var mouseIsDragging = false;

    track.addEventListener('mousedown', function(e) {
      mouseStartX = e.clientX;
      mouseIsDragging = true;
      track.style.transition = 'none';
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });

    track.addEventListener('mousemove', function(e) {
      if (!mouseIsDragging) return;
      var diff = e.clientX - mouseStartX;
      var baseTranslate = -(currentCarousel * 100);
      var pxToPercent = (diff / track.parentElement.offsetWidth) * 100;
      track.style.transform = 'translateX(' + (baseTranslate + pxToPercent) + '%)';
    });

    track.addEventListener('mouseup', function(e) {
      if (!mouseIsDragging) return;
      mouseIsDragging = false;
      track.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      track.style.cursor = 'grab';
      var swipeDistance = mouseStartX - e.clientX;
      
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0 && currentCarousel < totalSlides - 1) {
          goToCarouselSlide(currentCarousel + 1);
        } else if (swipeDistance < 0 && currentCarousel > 0) {
          goToCarouselSlide(currentCarousel - 1);
        } else {
          goToCarouselSlide(currentCarousel);
        }
      } else {
        goToCarouselSlide(currentCarousel);
      }
    });

    track.addEventListener('mouseleave', function() {
      if (mouseIsDragging) {
        mouseIsDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        track.style.cursor = 'grab';
        goToCarouselSlide(currentCarousel);
      }
    });

    // Cue card clicks
    document.querySelectorAll('.cue-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (Math.abs(e.clientX - mouseStartX) > 10) return;
        var pageId = card.dataset.slide;
        if (pageId && typeof goToSlide === 'function') {
          goToSlide(parseInt(pageId, 10));
        }
      });
    });

    // Initialize with automatic arrow logic
    goToCarouselSlide(0);
    track.style.cursor = 'grab';
  })();

  // Bind keyboard Left/Right arrow keys for navigation
  document.addEventListener('keydown', (e) => {
    // Ignore keystrokes when user is typing in form inputs
    const activeTag = document.activeElement.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      if (currentSlide === 0 && typeof window.prevCarouselSlide === 'function' && window.getCarouselCurrentSlide() > 0) {
        window.prevCarouselSlide();
      } else if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    } else if (e.key === 'ArrowRight') {
      if (currentSlide === 0 && typeof window.nextCarouselSlide === 'function' && window.getCarouselCurrentSlide() < window.getCarouselTotalSlides() - 1) {
        window.nextCarouselSlide();
      } else if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    }
  });

  // Slide-out Menu Toggle
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const slideOutMenu = document.getElementById('slideOutMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    slideOutMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    slideOutMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked and navigate
  slideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const slideIndex = parseInt(link.dataset.slide, 10);
      if (typeof goToSlide === 'function' && !isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
      closeMenu();
      
      // Update active state
      slideLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Initialize the main page slider to Slide 0
  goToSlide(0);
});
