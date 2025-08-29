// EmailJS initialization removed as it's no longer used for investment form

// Global variables
let selectedPackageType = '';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounters();
    initializeScrollEffects();
    initializeModal();
    initializeForms();
    initializeNavigation();
});

// Initialize animations
function initializeAnimations() {
    // Fade in animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                
                // Animate progress bar
                const progressBar = counter.parentElement.querySelector('.progress-bar');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 500);
                }
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        const formattedNumber = Math.floor(current).toLocaleString('ar-SA');
        element.textContent = formattedNumber;
    }, stepTime);
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('bg-white/95');
            navbar.classList.remove('bg-white/90');
        } else {
            navbar.classList.add('bg-white/90');
            navbar.classList.remove('bg-white/95');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize modal
function initializeModal() {
    const modal = document.getElementById('investmentModal');
    const closeBtn = document.querySelector('.close');

    // Close modal when clicking the X
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Initialize forms
function initializeForms() {
    // Investment form
    const investmentForm = document.getElementById('investmentForm');
    if (investmentForm) {
        investmentForm.addEventListener('submit', handleInvestmentSubmit);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Initialize navigation
function initializeNavigation() {
    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Show investment form
function showInvestmentForm() {
    const modal = document.getElementById('investmentModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('investmentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    // Reset form
    const form = document.getElementById('investmentForm');
    if (form) {
        form.reset();
    }
}

// Select package
function selectPackage(packageType) {
    selectedPackageType = packageType;
    
    // Update the select dropdown in the modal
    const packageSelect = document.getElementById('selectedPackage');
    if (packageSelect) {
        packageSelect.value = packageType;
    }
    
    // Show the investment form
    showInvestmentForm();
    
    // Add visual feedback
    const packageCards = document.querySelectorAll('.card-shadow');
    packageCards.forEach(card => {
        card.classList.remove('ring-4', 'ring-green-500');
    });
    
    // Highlight selected package (optional visual feedback)
    const selectedCard = event.target.closest('.card-shadow');
    if (selectedCard) {
        selectedCard.classList.add('ring-4', 'ring-green-500');
        setTimeout(() => {
            selectedCard.classList.remove('ring-4', 'ring-green-500');
        }, 2000);
    }
}

// Handle investment form submission
async function handleInvestmentSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector("button[type=\"submit\"]");
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الإرسال...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('investorEmail').value,
            package: document.getElementById('selectedPackage').value,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toLocaleString('ar-SA')
        };
        
        // Validate required fields
        if (!formData.fullName || !formData.phone || !formData.email || !formData.package) {
            throw new Error('يرجى ملء جميع الحقول المطلوبة');
        }
        
        // Prepare WhatsApp message
        const phoneNumber = '967738685477';
        const whatsappMessage = `مرحباً، لقد قمت بتقديم طلب استثمار في ${getPackageName(formData.package)}. اسمي ${formData.fullName} ورقم هاتفي ${formData.phone}. البريد الإلكتروني: ${formData.email}. ملاحظات: ${formData.notes || 'لا توجد ملاحظات إضافية'}.`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
         // Redirect to WhatsApp Web in the same window
        window.location.href = whatsappUrl;       
        // Close modal and reset form
        closeModal();
        
    } catch (error) {
        console.error('Error submitting investment form:', error);
        showNotification(`حدث خطأ أثناء إرسال الطلب: ${error.message}. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.`, 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الإرسال...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('ar-SA')
        };
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.message) {
            throw new Error('يرجى ملء جميع الحقول المطلوبة');
        }
        
        // Send email using EmailJS
        const result = await emailjs.send(
            'service_2tda47k', // Replace with your EmailJS service ID
            'YOUR_CONTACT_TEMPLATE_ID', // Replace with your EmailJS contact template ID
            {
                to_email: 'abdulmaleksalah2021@gmail.com',
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                timestamp: formData.timestamp
            }
        );
        
        // Show success message
        showNotification('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
        
        // Reset form
        event.target.reset();
        
    } ca        console.error("EmailJS Error:", error);
        showNotification(`حدث خطأ أثناء إرسال الطلب: ${error.text || error.message}. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.`, "error");ally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Get package name in Arabic
function getPackageName(packageType) {
    const packages = {
        'basic': 'الباقة الأساسية - 10,000 ريال',
        'advanced': 'الباقة المتقدمة - 50,000 ريال',
        'premium': 'الباقة المميزة - 100,000 ريال'
    };
    return packages[packageType] || packageType;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } ml-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toLocaleString('ar-SA');
}

// Utility function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function to validate phone number
function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Add loading animation to buttons
function addLoadingToButton(button, text = 'جاري التحميل...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin ml-2"></i>${text}`;
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Enhanced WhatsApp integration with better error handling
function openWhatsApp(message = '') {
    const phoneNumber = '967738685477';
    const defaultMessage = 'مرحباً، أريد الاستفسار عن فرص الاستثمار في شركة النقل السريع';
    const finalMessage = message || defaultMessage;
    
    try {
        // Check if WhatsApp is available
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
        
        // Open in new tab with proper security attributes
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Check if popup was blocked
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Fallback: try to navigate in same window
            window.location.href = whatsappUrl;
        }
        
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        
        // Fallback: show phone number
        showNotification(`يمكنك التواصل معنا على الرقم: +${phoneNumber}`, 'info');
    }
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add keyboard navigation support
document.addEventListener('keydown', (event) => {
    // Close modal with Escape key
    if (event.key === 'Escape') {
        const modal = document.getElementById('investmentModal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
    
    // Navigate with arrow keys (optional enhancement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const sections = ['home', 'features', 'packages', 'contact'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        if (currentIndex !== -1) {
            let nextIndex;
            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % sections.length;
            } else {
                nextIndex = (currentIndex - 1 + sections.length) % sections.length;
            }
            
            scrollToSection(sections[nextIndex]);
            event.preventDefault();
        }
    }
});

// Get current section based on scroll position
function getCurrentSection() {
    const sections = ['home', 'features', 'packages', 'contact'];
    const scrollPosition = window.scrollY + 100; // Offset for navbar
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            return sections[i];
        }
    }
    
    return sections[0];
}

// Add smooth reveal animations for better UX
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.card-shadow, .fade-in');
    
    revealElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', addRevealAnimations);

// Add error boundary for better error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Don't show error notifications for minor issues
    if (event.error && event.error.message && !event.error.message.includes('Script error')) {
        showNotification('حدث خطأ غير متوقع. يرجى تحديث الصفحة والمحاولة مرة أخرى.', 'error');
    }
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent the default browser behavior
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showInvestmentForm,
        selectPackage,
        closeModal,
        scrollToSection,
        validateEmail,
        validatePhone,
        formatNumber
    };
}

