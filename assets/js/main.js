$(document).ready(function () {

    const $owl = $('#owl-slider');
    const $navSpans = $('.slider-nav span');

    // --- Owl Carousel Initialization ---
    $owl.owlCarousel({
        loop: true, // Infinite loop
        margin: 20, // Gap between slides (20px)
        nav: false, // Hide default arrows
        dots: false, // Hide default dots
        autoplay: true, // Auto slide enabled
        autoplayTimeout: 5000,
        autoplayHoverPause: true, // Pause on hover
        mouseDrag: true, // Draggable feature enabled
        responsive: {
            0: { // For screens < 576px (Mobile: 1.5 slides)
                items: 1.5,
            },
            576: { // For screens >= 576px (Tablet: 2.5 slides)
                items: 2.5,
            },
            992: { // For screens >= 992px (Desktop: 3.5 slides)
                items: 3.5,
            }
        }
    });

    // --- Custom Navigation Logic ---

    // 1. Click handling for custom number navigation
    $navSpans.on('click', function () {
        // Stop autoplay when a user clicks a number
        $owl.trigger('stop.owl.autoplay');

        const index = $(this).data('slide-to');

        // Go to the corresponding slide index
        $owl.trigger('to.owl.carousel', [index, 500, true]);

        // Update active class immediately
        $navSpans.removeClass('active');
        $(this).addClass('active');

        // Restart autoplay after a short delay
        setTimeout(function () {
            $owl.trigger('play.owl.autoplay', [3000]);
        }, 1000);
    });

    // 2. Update custom navigation active state on slide change (drag/autoplay)
    $owl.on('changed.owl.carousel', function (event) {
        // Find the index of the current active slide (0 to totalSlides-1)
        const currentItemIndex = event.item.index;
        const totalItems = event.item.count;
        const totalOriginalItems = $navSpans.length;

        // Owl Carousel uses cloning, so we need to map the cloned index back to the original index
        let originalIndex = (currentItemIndex % totalOriginalItems);

        // Sometimes Owl's logic results in index mapping to the last clone before 0. This normalizes it.
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

    // Desktop: remove previous active and add to first visible
    $carousel.find(".item").removeClass("active");
    // Owl Carousel 'active' ക്ലാസ് ഉള്ള ആദ്യത്തെ ഐറ്റം കണ്ടെത്തുന്നു
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
            // Owl Carousel-ന്റെ resize ഇവന്റ്. updateActiveItem മാത്രം വിളിക്കുന്നു.
            if ($(window).width() >= 768) {
                updateActiveItem($carousel);
            }
        },
    });

    // Custom Navigation-ന് വേണ്ടി owl object തിരികെ നൽകുന്നു
    return $carousel.data("owl.carousel");
}

// 💡 Function to handle Maximize/Restore events via window resize
let previousWidth = $(window).width();
let resizeTimer;

function handleWindowResize($carousel, initializationFunction) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        const currentWidth = $(window).width();
        
        // Breakpoint മാറുകയാണോ എന്ന് പരിശോധിക്കുന്നു
        const isBreakpointChange = 
            (previousWidth < 768 && currentWidth >= 768) ||
            (previousWidth >= 768 && currentWidth < 768);

        // വലുപ്പത്തിൽ വലിയ മാറ്റം (Maximize/Restore) ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു (ഒരു വലിയ ജമ്പ്).
        const isMajorResize = Math.abs(currentWidth - previousWidth) > 50; 

        if (isBreakpointChange || isMajorResize) { 
            
            // നിലവിലുള്ള കാറൗസൽ destroy ചെയ്യുക (ഉള്ളടക്കം നഷ്ടപ്പെടാതെ)
            if ($carousel.data("owl.carousel")) {
                $carousel.data("owl.carousel").destroy();
                // ⚠️ പ്രധാന മാറ്റം: $carousel.empty() ഇവിടെ ഒഴിവാക്കിയിരിക്കുന്നു 
                // ഉള്ളടക്കം (കാർഡുകൾ) നിലനിർത്താൻ വേണ്ടിയാണിത്.
            }
            
            // കാറൗസൽ re-initialize ചെയ്യുക
            const owl = initializationFunction($carousel);

            // Custom Navigation വീണ്ടും സെറ്റ് ചെയ്യുക (Re-bind Custom Navigation)
            $(".custom-prev-btn").off("click").on("click", function () {
                owl.prev();
            });
            $(".custom-next-btn").off("click").on("click", function () {
                owl.next();
            });

        } else {
            // ചെറിയ resize-കൾക്ക് refresh മാത്രം മതി
            $carousel.trigger("refresh.owl.carousel");
        }

        updateActiveItem($carousel); // active item അപ്‌ഡേറ്റ് ചെയ്യുക
        previousWidth = currentWidth; // അടുത്ത താരതമ്യത്തിനായി നിലവിലെ വലുപ്പം സംഭരിക്കുക

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

    // 4️⃣ Handle Maximize/Restore/Resize gracefully
    $(window).on("resize", function () {
        // resize ഇവന്റിൽ destroy & re-initialize ലോജിക് വിളിക്കുന്നു.
        handleWindowResize($carousel, initializeCarousel);
    });
});

/* ✅ GSAP Animation */
window.addEventListener("load", () => {
    // Split the heading into characters and the paragraph into words
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