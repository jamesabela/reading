document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nav = document.querySelector('.carousel-nav');
    const dots = Array.from(nav.children);
    const nextBtn = document.querySelector('.arrow-next');
    const prevBtn = document.querySelector('.arrow-prev');

    let currentSlideIndex = 0;
    let autoPlayTimer;

    const updateSlide = (index) => {
        // Correct index if out of bounds
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Move track
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active classes
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlideIndex = index;
    };

    const startAutoPlay = () => {
        autoPlayTimer = setInterval(() => {
            updateSlide(currentSlideIndex + 1);
        }, 6000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    };

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        updateSlide(currentSlideIndex + 1);
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        updateSlide(currentSlideIndex - 1);
        resetAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlide(index);
            resetAutoPlay();
        });
    });

    // Initialize
    updateSlide(0);
    startAutoPlay();

    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carousel.addEventListener('mouseleave', startAutoPlay);
});
