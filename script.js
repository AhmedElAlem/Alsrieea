// --- 1. قائمة الموبايل ---
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');
const navLinks = document.querySelectorAll('.nav-list a');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// --- 2. السلايدر الرئيسي التفاعلي (Hero Slider) ---
const slides = document.querySelectorAll('.slide');
const heroPrev = document.querySelector('.hero-prev');
const heroNext = document.querySelector('.hero-next');
const dots = document.querySelectorAll('.dot');
const heroSlider = document.querySelector('.hero-slider');

let currentSlide = 0;
let slideInterval;

// دالة للانتقال لصورة معينة
function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // حساب الاندكس عشان يلف في دائرة (Loop)
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

// تشغيل وإعادة ضبط المؤقت (عشان لو العميل ضغط، المؤقت يبدأ من الصفر)
function startSlideTimer() {
    slideInterval = setInterval(nextSlide, 5000); // 5 ثواني
}
function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
}

// أ) التقليب بالأسهم
heroNext.addEventListener('click', (e) => {
    e.stopPropagation(); // منع تداخل الضغط مع السلايدر نفسه
    nextSlide();
    resetSlideTimer();
});

heroPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevSlide();
    resetSlideTimer();
});

// ب) التقليب بالنقاط
dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(index);
        resetSlideTimer();
    });
});

// ج) التقليب بالضغط على الشاشة (السلايدر نفسه)
heroSlider.addEventListener('click', () => {
    nextSlide();
    resetSlideTimer();
});

// تشغيل المؤقت عند فتح الموقع
startSlideTimer();

// --- 3. معرض الأعمال (Lightbox) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const galleryImages = document.querySelectorAll('.gallery-grid img');

let currentImageIndex = 0;
let imagesArray = [];

galleryImages.forEach((img, index) => {
    imagesArray.push(img.src);
    img.addEventListener('click', () => {
        openLightbox(index);
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = imagesArray[currentImageIndex];
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex >= imagesArray.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = imagesArray.length - 1;
    }
    lightboxImg.src = imagesArray[currentImageIndex];
}

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', () => changeImage(1)); 
prevBtn.addEventListener('click', () => changeImage(-1)); 

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'ArrowRight') changeImage(-1); 
        else if (e.key === 'ArrowLeft') changeImage(1); 
        else if (e.key === 'Escape') closeLightbox();
    }
});

// --- 4. ربط نموذج الاتصال بالواتساب ---
const whatsappForm = document.getElementById('whatsapp-form');

whatsappForm.addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    
    // سحب البيانات من الحقول
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // تنسيق الرسالة
    const whatsappText = `مرحباً، لدي استفسار من الموقع:%0A%0Aالاسم: ${name}%0Aرقم الجوال: ${phone}%0A%0Aالرسالة:%0A${message}`;
    
    // رقم الواتساب الذي سيتم الإرسال إليه
    const targetPhone = "971508312681"; 
    
    // فتح رابط الواتساب
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
});

// --- 5. كاروسيل الشركاء (تفاعلي ولانهائي) ---
const carousel = document.getElementById('partner-carousel');
const track = document.getElementById('partner-track');

// استنساخ اللوجوهات برمجياً عشان نحقق اللوب اللانهائي
track.innerHTML += track.innerHTML;

let isDragging = false;
let startX;
let scrollLeft;
let animationId;
let scrollSpeed = 1; // سرعة الحركة التلقائية (تقدر تزودها لو حابب أسرع)

// دالة الحركة التلقائية
function autoScroll() {
    if (!isDragging) {
        carousel.scrollLeft += scrollSpeed;
        
        // لما يوصل لنص المسافة (نهاية النسخة الأولى)، يرجع للبداية بدون ما المستخدم يلاحظ
        if (carousel.scrollLeft >= track.scrollWidth / 2) {
            carousel.scrollLeft = 0;
        } else if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft = track.scrollWidth / 2;
        }
    }
    animationId = requestAnimationFrame(autoScroll);
}

// تشغيل الحركة التلقائية أول ما الموقع يفتح
autoScroll();

// --- أحداث الماوس (لأجهزة الكمبيوتر) ---
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    cancelAnimationFrame(animationId); // إيقاف الحركة التلقائية أثناء السحب
});

carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        autoScroll(); // إعادة التشغيل
    }
});

carousel.addEventListener('mouseup', () => {
    isDragging = false;
    autoScroll(); // إعادة التشغيل
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // رقم 2 ده بيحدد سرعة السحب بالماوس
    carousel.scrollLeft = scrollLeft - walk;
    
    // التعامل مع السحب اللانهائي يمين ويسار
    if (carousel.scrollLeft >= track.scrollWidth / 2) {
        carousel.scrollLeft = 0;
        startX = e.pageX - carousel.offsetLeft; 
        scrollLeft = carousel.scrollLeft;
    } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = track.scrollWidth / 2;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    }
});

// --- أحداث اللمس (للموبايل والتابلت) ---
carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    cancelAnimationFrame(animationId);
}, {passive: true});

carousel.addEventListener('touchend', () => {
    isDragging = false;
    autoScroll();
});

carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
    
    if (carousel.scrollLeft >= track.scrollWidth / 2) {
        carousel.scrollLeft = 0;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = track.scrollWidth / 2;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    }
}, {passive: true});



// --- 6. التمرير الناعم بدون إظهار اسم القسم في الرابط ---
const smoothLinks = document.querySelectorAll('.nav-list a, .logo a, .hero-content a');

smoothLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // التأكد إن الرابط بيشير لقسم في نفس الصفحة (بيبدأ بـ #)
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#') && targetId !== '#') {
            e.preventDefault(); // منع المتصفح من تغيير الرابط في شريط العنوان

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // التمرير بسلاسة للقسم المطلوب
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- 7. تحسينات إضافية للـ Lightbox (التنقل بالضغط والسكرول) ---

// أ) التنقل للصور التالية عند الضغط على الصورة نفسها
lightboxImg.addEventListener('click', (e) => {
    // منع انتشار الحدث للخلفية عشان النافذة متقفلش
    e.stopPropagation(); 
    // الذهاب للصورة التالية
    changeImage(1); 
});

// ب) التنقل بين الصور باستخدام عجلة الماوس (Scroll)
let isScrolling = false; // متغير للتحكم في سرعة التقليب (Debounce)

lightbox.addEventListener('wheel', (e) => {
    // لو النافذة مش مفتوحة، متعملش حاجة
    if (lightbox.style.display !== 'flex') return;
    
    // منع الصفحة الأساسية من السكرول
    e.preventDefault();

    // لو بيقلب حالياً، استنى لحد ما يخلص
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0) {
        // سكرول لتحت -> الصورة التالية
        changeImage(1);
    } else {
        // سكرول لفوق -> الصورة السابقة
        changeImage(-1);
    }

    // إعادة تفعيل التقليب بعد جزء من الثانية (عشان الصور متجريش بسرعة)
    setTimeout(() => {
        isScrolling = false;
    }, 300); // 300 ميلي ثانية تأخير مناسب
}, { passive: false }); // passive: false عشان نقدر نستخدم preventDefault



// --- 8. تأثيرات الأنيميشن التفاعلية (Frontend Only) ---

// أ) تغيير شكل الهيدر مع السكرول (Navbar Morph)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    // لو نزلنا أكتر من 50 بيكسل، الهيدر يتحول لأبيض
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ب) الظهور التدريجي للعناصر (Fade-Up on Scroll)
// بنستخدم IntersectionObserver ودي أداة مدمجة في المتصفح مش محتاجة سيرفر
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // العنصر يظهر لما 15% منه يبان في الشاشة
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // عشان يظهر مرة واحدة بس وميستهلكش رامات
        }
    });
}, observerOptions);

// بنطبق الكلاس على الأقسام اللي عاوزينها تظهر بتدرج
document.querySelectorAll('.service-card, .gallery-grid img, .section h2, .about-content, .contact-wrapper').forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
});

// ج) تأثير العمق للسلايدر (Hero Parallax)
const parallaxSlides = document.querySelectorAll('.slide');
window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY;
    // التأثير يشتغل بس لو احنا لسه في أول صفحة
    if(scrollPosition < window.innerHeight) {
        parallaxSlides.forEach(slide => {
            // تحريك الصورة أبطأ من نزول الصفحة
            slide.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.4}px)`;
        });
    }
});