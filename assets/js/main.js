$(document).ready(function () {

    const $owl = $('#owl-slider');
    const $navSpans = $('.slider-nav span');

    $owl.owlCarousel({
        loop: true, 
        margin: 20, 
        nav: false, 
        dots: false, 
        autoplay: true, 
        autoplayTimeout: 5000,
        autoplayHoverPause: true, 
        mouseDrag: true, 
        responsive: {
            0: { 
                items: 1.5,
            },
            576: { 
                items: 2.5,
            },
            992: { 
                items: 3.5,
            }
        }
    });

    // --- Custom Navigation Logic ---

    
    $navSpans.on('click', function () {
        $owl.trigger('stop.owl.autoplay');

        const index = $(this).data('slide-to');

        $owl.trigger('to.owl.carousel', [index, 500, true]);

        $navSpans.removeClass('active');
        $(this).addClass('active');

        setTimeout(function () {
            $owl.trigger('play.owl.autoplay', [3000]);
        }, 1000);
    });

    // 2. Update custom navigation active state on slide change (drag/autoplay)
    $owl.on('changed.owl.carousel', function (event) {
        const currentItemIndex = event.item.index;
        const totalItems = event.item.count;
        const totalOriginalItems = $navSpans.length;

        let originalIndex = (currentItemIndex % totalOriginalItems);

        if (originalIndex >= totalOriginalItems) {
            originalIndex = 0;
        }

        // Update custom navigation
        $navSpans.removeClass('active');
        $navSpans.eq(originalIndex).addClass('active');
    });

    // Initialize the active class on the first slide (if the slider starts at index 0)
    $navSpans.first().addClass('active');
});


// Custom Accordion Functionality
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});


// Active card update function
function updateActiveItem($carousel) {
    // Mobile: all items active (Less than 768px)
    if ($(window).width() < 768) {
        $carousel.find(".item").addClass("active");
        return;
    }

    $carousel.find(".item").removeClass("active");
    const firstVisibleItem = $carousel.find(".owl-item.active").first().find(".item");

    if (firstVisibleItem.length) {
        // Add fade-in animation when new active appears
        firstVisibleItem.addClass("active fade-in");
        setTimeout(() => {
            firstVisibleItem.removeClass("fade-in");
        }, 600); // match with CSS animation duration
    }
}

// 💡 Function to Initialize Owl Carousel with all settings
function initializeCarousel($carousel) {
    // 1️⃣ Initialize Owl Carousel
    $carousel.owlCarousel({
        autoWidth: true,
        loop: true,
        dots: false,
        nav: false,
        autoplay: false,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        margin: 15,

        // Disable dragging manually
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,

        slideSpeed: 600,
        dragEndSpeed: 600,

        responsive: {
            0: {
                items: 1.1,
                autoWidth: false,
                margin: 10,
            },
            768: {
                autoWidth: false,
                items: 1.2,
                margin: 15,
            },
            991: {
                autoWidth: false,
                items: 1.2,
                margin: 15,
            },
            1199: {
                autoWidth: false,
                items: 2.5,
                margin: 15,
            },
            1200: {
                autoWidth: true,
                items: 2.5,
                margin: 15,
            },
            1400: {
                autoWidth: true,
                items: 3.2,
                margin: 15,
            },
        },

        onInitialized: function () {
            updateActiveItem($carousel);
        },
        onResized: function () {
            if ($(window).width() >= 768) {
                updateActiveItem($carousel);
            }
        },
    });

    return $carousel.data("owl.carousel");
}

// 💡 Function to handle Maximize/Restore events via window resize
let previousWidth = $(window).width();
let resizeTimer;

function handleWindowResize($carousel, initializationFunction) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        const currentWidth = $(window).width();
        
        const isBreakpointChange = 
            (previousWidth < 768 && currentWidth >= 768) ||
            (previousWidth >= 768 && currentWidth < 768);

        const isMajorResize = Math.abs(currentWidth - previousWidth) > 50; 

        if (isBreakpointChange || isMajorResize) { 
            
            if ($carousel.data("owl.carousel")) {
                $carousel.data("owl.carousel").destroy();
            }
            
            const owl = initializationFunction($carousel);

            $(".custom-prev-btn").off("click").on("click", function () {
                owl.prev();
            });
            $(".custom-next-btn").off("click").on("click", function () {
                owl.next();
            });

        } else {
            $carousel.trigger("refresh.owl.carousel");
        }

        updateActiveItem($carousel); 
        previousWidth = currentWidth; 

    }, 300); // Debounce time
}

$(document).ready(function () {
    const $carousel = $(".custom-carousel");

    // 1️⃣ Initial initialization
    let owl = initializeCarousel($carousel);

    // 2️⃣ Custom Navigation Buttons (only control allowed)
    $(".custom-prev-btn").on("click", function () {
        owl.prev();
    });

    $(".custom-next-btn").on("click", function () {
        owl.next();
    });

    // 3️⃣ When slide changes — update active item
    $carousel.on("translated.owl.carousel", function () {
        if ($(window).width() >= 768) {
            updateActiveItem($carousel);
        }
    });

    $(window).on("resize", function () {
        handleWindowResize($carousel, initializeCarousel);
    });
});

/* ✅ GSAP Animation */
window.addEventListener("load", () => {
    const headingSplit = new SplitType("#animatedHeading", {
        types: "chars"
    });
    const paragraphSplit = new SplitType("#animatedParagraph", {
        types: "words"
    });

    // Initial hidden position
    gsap.set(headingSplit.chars, {
        y: 80,
        opacity: 0
    });
    gsap.set(paragraphSplit.words, {
        y: 40,
        opacity: 0
    });

    // Timeline
    const tl = gsap.timeline({
        delay: 0.3,
        ease: "power3.out"
    });

    // Animate heading letters
    tl.to(headingSplit.chars, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.035
    });

    // Animate paragraph words
    tl.to(
        paragraphSplit.words, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05
        },
        "-=0.3"
    );
});




window.addEventListener('load', function() {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        });