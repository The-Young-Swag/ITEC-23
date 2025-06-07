/**
 * Utility to debounce functions
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Cache DOM elements
 */
const DOM = {
    navLinks: document.querySelectorAll('.navbar a'),
    navToggle: document.querySelector('.nav-toggle'),
    navLinksContainer: document.querySelector('.nav-links'),
    sections: document.querySelectorAll('.section'),
    backToTop: document.querySelector('.back-to-top'),
    carousel: document.querySelector('.carousel'),
    slides: document.querySelectorAll('.carousel-slide'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    dots: document.querySelectorAll('.carousel-dot'),
    imageFigures: document.querySelectorAll('.image-figure'),
    imageLinks: document.querySelectorAll('.image-grid .image-link')
};

/**
 * Smooth scrolling for navbar links
 */
if (DOM.navLinks.length) {
    DOM.navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                if (window.innerWidth <= 666 && DOM.navLinksContainer) {
                    DOM.navLinksContainer.classList.remove('active');
                    DOM.navToggle.textContent = '☰';
                    DOM.navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        anchor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                anchor.click();
            }
        });
    });
}

/**
 * Mobile navigation toggle
 */
if (DOM.navToggle && DOM.navLinksContainer) {
    DOM.navToggle.addEventListener('click', () => {
        const isActive = DOM.navLinksContainer.classList.toggle('active');
        DOM.navToggle.textContent = isActive ? '✕' : '☰';
        DOM.navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    DOM.navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            DOM.navToggle.click();
        }
    });
}

/**
 * Section hover effects
 */
if (DOM.sections.length) {
    DOM.sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        });
    });
}

/**
 * Back to top button visibility
 */
if (DOM.backToTop) {
    window.addEventListener('scroll', debounce(() => {
        DOM.backToTop.classList.toggle('visible', window.scrollY > 300);
    }, 100), { passive: true });
    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    DOM.backToTop.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            DOM.backToTop.click();
        }
    });
}

/**
 * Close mobile menu on outside click
 */
document.addEventListener('click', (e) => {
    if (
        DOM.navLinksContainer &&
        DOM.navToggle &&
        !DOM.navLinksContainer.contains(e.target) &&
        !DOM.navToggle.contains(e.target) &&
        DOM.navLinksContainer.classList.contains('active')
    ) {
        DOM.navLinksContainer.classList.remove('active');
        DOM.navToggle.textContent = '☰';
        DOM.navToggle.setAttribute('aria-expanded', 'false');
    }
});

/**
 * Image expansion with modal
 */
if (DOM.imageFigures.length) {
    DOM.imageFigures.forEach(figure => {
        const img = figure.querySelector('img');
        figure.addEventListener('click', (e) => {
            if (!e.target.closest('.image-link') && !e.target.closest('.close-btn')) {
                DOM.imageFigures.forEach(expanded => {
                    if (expanded !== figure) {
                        expanded.classList.remove('expanded');
                        expanded.removeAttribute('aria-expanded');
                    }
                });
                figure.classList.toggle('expanded');
                figure.setAttribute('aria-expanded', figure.classList.contains('expanded') ? 'true' : 'false');
                document.body.classList.toggle('modal-open', figure.classList.contains('expanded'));
                if (figure.classList.contains('expanded')) {
                    img.focus();
                }
            }
        });
        figure.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!e.target.closest('.image-link')) {
                    figure.click();
                }
            }
            if (e.key === 'Escape' && figure.classList.contains('expanded')) {
                figure.classList.remove('expanded');
                figure.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Close expanded image on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.image-figure') && !e.target.closest('.image-link')) {
            DOM.imageFigures.forEach(figure => {
                if (figure.classList.contains('expanded')) {
                    figure.classList.remove('expanded');
                    figure.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('modal-open');
                }
            });
        }
    });

    // Swipe to close on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    DOM.imageFigures.forEach(figure => {
        figure.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        figure.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (Math.abs(touchStartX - touchEndX) > 100 && figure.classList.contains('expanded')) {
                figure.classList.remove('expanded');
                figure.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('modal-open');
            }
        }, { passive: true });
    });
}

/**
 * Image grid figcaption click redirection
 */
if (DOM.imageLinks.length) {
    DOM.imageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = link.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
}

/**
 * Carousel functionality with robust mobile and desktop handling
 */
if (DOM.carousel && DOM.slides.length) {
    let currentSlide = 0;
    let autoPlayInterval = null;
    let isMobile = window.innerWidth <= 666;
    let isSwiping = false;

    function updateCarousel() {
        if (!isMobile) {
            // Desktop: Horizontal sliding
            DOM.carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            DOM.carousel.style.transition = 'transform 0.5s ease-in-out';
            DOM.slides.forEach(slide => {
                slide.style.display = 'flex';
                slide.style.opacity = '1';
            });
            if (DOM.dots.length) {
                DOM.dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            if (DOM.prevBtn && DOM.nextBtn) {
                DOM.prevBtn.disabled = false;
                DOM.nextBtn.disabled = false;
            }
        } else {
            // Mobile: Vertical stack, show only current slide
            DOM.carousel.style.transform = 'none';
            DOM.carousel.style.transition = 'none';
            DOM.slides.forEach((slide, index) => {
                slide.style.display = index === currentSlide ? 'flex' : 'none';
                slide.style.opacity = index === currentSlide ? '1' : '0';
                slide.style.transition = 'opacity 0.3s ease';
            });
        }
    }

    function startAutoPlay() {
        if (!isMobile && autoPlayInterval === null) {
            autoPlayInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % DOM.slides.length;
                updateCarousel();
            }, 5000);
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval !== null) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function initializeCarousel() {
        stopAutoPlay();
        isMobile = window.innerWidth <= 666;
        // Reset slide styles
        DOM.slides.forEach(slide => {
            slide.style.display = isMobile ? 'none' : 'flex';
            slide.style.transform = 'none';
            slide.style.opacity = isMobile ? '0' : '1';
        });
        // Ensure valid slide index
        currentSlide = Math.max(0, Math.min(currentSlide, DOM.slides.length - 1));
        updateCarousel();
        if (!isMobile) {
            startAutoPlay();
        }
    }

    // Desktop controls
    if (DOM.prevBtn && DOM.nextBtn && DOM.dots.length) {
        DOM.prevBtn.addEventListener('click', () => {
            if (!isMobile) {
                currentSlide = (currentSlide - 1 + DOM.slides.length) % DOM.slides.length;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay();
            }
        });
        DOM.prevBtn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isMobile) {
                e.preventDefault();
                DOM.prevBtn.click();
            }
        });

        DOM.nextBtn.addEventListener('click', () => {
            if (!isMobile) {
                currentSlide = (currentSlide + 1) % DOM.slides.length;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay();
            }
        });
        DOM.nextBtn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isMobile) {
                e.preventDefault();
                DOM.nextBtn.click();
            }
        });

        DOM.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                if (!isMobile) {
                    currentSlide = parseInt(dot.getAttribute('data-slide'));
                    updateCarousel();
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
            dot.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isMobile) {
                    e.preventDefault();
                    dot.click();
                }
            });
        });

        DOM.carousel.addEventListener('mouseenter', () => {
            if (!isMobile) {
                stopAutoPlay();
            }
        });
        DOM.carousel.addEventListener('mouseleave', () => {
            if (!isMobile) {
                startAutoPlay();
            }
        });
    }

    // Mobile swipe functionality with debouncing
    if (DOM.carousel) {
        let touchStartX = 0;
        let touchEndX = 0;

        const debouncedSwipe = debounce(() => {
            if (isMobile && !isSwiping) {
                isSwiping = true;
                if (touchStartX - touchEndX > 50) {
                    // Swipe left
                    currentSlide = (currentSlide + 1) % DOM.slides.length;
                    updateCarousel();
                } else if (touchEndX - touchStartX > 50) {
                    // Swipe right
                    currentSlide = (currentSlide - 1 + DOM.slides.length) % DOM.slides.length;
                    updateCarousel();
                }
                setTimeout(() => {
                    isSwiping = false;
                }, 300);
            }
        }, 100);

        DOM.carousel.addEventListener('touchstart', (e) => {
            if (isMobile) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        DOM.carousel.addEventListener('touchend', (e) => {
            if (isMobile) {
                touchEndX = e.changedTouches[0].screenX;
                debouncedSwipe();
            }
        }, { passive: true });
    }

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        initializeCarousel();
    }, 150), { passive: true });

    // Initial setup
    initializeCarousel();
}
