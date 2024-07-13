document.addEventListener('DOMContentLoaded', function () {
    // AOS Animation Initialization
    AOS.init({
        duration: 1000,
        once: true,
        disable: 'mobile'
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".navbar", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".hero-content", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)"
    });

    gsap.utils.toArray('.section').forEach((section, i) => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });   

    // Swiper Slider Initialization
    const swiper = new Swiper('.swiper', {
        loop: true,
        lazy: {
            loadPrevNext: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                lazyImageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => lazyImageObserver.observe(img));

    // Contact Form Submission Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Hamburger Menu and Curtain Menu
    const hamburger = document.querySelector('.hamburger');
    const curtainMenu = document.querySelector('.curtain-menu');
    const menuLinks = curtainMenu.querySelectorAll('a');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('open');
        curtainMenu.classList.toggle('open');
        console.log("Hamburger clicked!");
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('open');
            curtainMenu.classList.remove('open');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});