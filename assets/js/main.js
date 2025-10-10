$(document).ready(function(){

    const $owl = $('#owl-slider');
    const $navSpans = $('.slider-nav span');

    // --- Owl Carousel Initialization ---
    $owl.owlCarousel({
        loop: true,           // Infinite loop
        margin: 20,           // Gap between slides (20px)
        nav: false,           // Hide default arrows
        dots: false,          // Hide default dots
        autoplay: true,       // Auto slide enabled
        autoplayTimeout: 5000,
        autoplayHoverPause: true, // Pause on hover
        mouseDrag: true,      // Draggable feature enabled
        responsive: {
            0: {              // For screens < 576px (Mobile: 1.5 slides)
                items: 1.5,
            },
            576: {            // For screens >= 576px (Tablet: 2.5 slides)
                items: 2.5,
            },
            992: {            // For screens >= 992px (Desktop: 3.5 slides)
                items: 3.5,
            }
        }
    });

    // --- Custom Navigation Logic ---

    // 1. Click handling for custom number navigation
    $navSpans.on('click', function() {
        // Stop autoplay when a user clicks a number
        $owl.trigger('stop.owl.autoplay'); 
        
        const index = $(this).data('slide-to');
        
        // Go to the corresponding slide index
        $owl.trigger('to.owl.carousel', [index, 500, true]); 

        // Update active class immediately
        $navSpans.removeClass('active');
        $(this).addClass('active');

        // Restart autoplay after a short delay
        setTimeout(function() {
            $owl.trigger('play.owl.autoplay', [3000]);
        }, 1000); 
    });

    // 2. Update custom navigation active state on slide change (drag/autoplay)
    $owl.on('changed.owl.carousel', function(event) {
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
        document.addEventListener('DOMContentLoaded', function() {
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


// ആക്ടീവ് കാർഡ് കണ്ടെത്തി Active Style (large/dark) നൽകാനുള്ള ഫംഗ്ഷൻ.
function updateActiveItem($carousel) {
    // 768px ന് താഴെ autoWidth: false ആയതുകൊണ്ട് ഈ ലോജിക് ഒഴിവാക്കുന്നു
    if ($(window).width() < 768) return; 

    $carousel.find('.item').removeClass("active");

    // .owl-item.active-ൽ ഇടതുവശത്ത് കാണുന്ന ആദ്യത്തെ ഐറ്റം കണ്ടെത്തുന്നു
    const firstVisibleItem = $carousel.find('.owl-item.active').first().find('.item');
    
    if (firstVisibleItem.length) {
        firstVisibleItem.addClass('active');
    }
}


$(document).ready(function () {
    const $carousel = $(".custom-carousel");

    // 1. Carousel Initialization: 
    $carousel.owlCarousel({
        // ഡിസൈനിലെ Fixed width Cards (700px + 320px + ...) കാണിക്കാൻ autoWidth: true ഉപയോഗിക്കുന്നു.
        autoWidth: true,
        loop: true,
        dots: false,
        nav: false,
        autoplay: false,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        margin: 15,
        
        // സ്ലൈഡിംഗ് വേഗത 600ms ആയി സജ്ജീകരിക്കുന്നു
        slideSpeed: 600, 
        dragEndSpeed: 600, 
        
        // മൊബൈൽ റെസ്പോൺസീവ് ഓപ്ഷൻ: 1.5 കാർഡ് കാണിക്കാൻ
        responsive: {
            0: { 
                items: 1.5, 
                autoWidth: false, // മൊബൈലിൽ autoWidth ഒഴിവാക്കുന്നു
                margin: 10,
            },
            768: { 
                autoWidth: true, // ഡെസ്ക്ടോപ്പിൽ autoWidth ഉപയോഗിക്കുന്നു
                items: 3, 
                margin: 15,
            }
        },

        onInitialized: function (event) {
            // കാറൗസൽ ലോഡ് ചെയ്യുമ്പോൾ active ഐറ്റം സെറ്റ് ചെയ്യുന്നു
            if ($(window).width() >= 768) {
                updateActiveItem($carousel);
            } else {
                // മൊബൈലിൽ ആദ്യത്തെ ഐറ്റത്തിനെ active ആക്കുന്നു
                $carousel.find('.item').removeClass("active");
                $carousel.find('.item').first().addClass("active");
            }
        },
        
        onResized: function (event) {
             // സൈസ് മാറുമ്പോൾ active ഐറ്റം ലോജിക് വീണ്ടും വിളിക്കുന്നു
            if ($(window).width() >= 768) {
                updateActiveItem($carousel);
            }
        }
    });

    const owl = $carousel.data('owl.carousel'); 

    // 2. Custom Navigation Buttons: 
    $('.custom-prev-btn').on('click', function() {
        owl.prev();
        // 50ms ഡിലേ നൽകുന്നു (CSS transition-മായി മാച്ച് ചെയ്യാൻ)
        setTimeout(() => { updateActiveItem($carousel); }, 50); 
    });

    $('.custom-next-btn').on('click', function() {
        owl.next();
        // 50ms ഡിലേ നൽകുന്നു
        setTimeout(() => { updateActiveItem($carousel); }, 50); 
    });
    
    // 3. Item Click Handler: ക്ലിക്കിൽ active ആകാനും scroll ചെയ്യാനും
    $carousel.on('click', '.item', function () {
        const $this = $(this);
        
        // 768px ന് മുകളിൽ മാത്രം autoWidth ലോജിക് ഉപയോഗിക്കുക
        if ($(window).width() >= 768) {
            $carousel.find('.item').removeClass("active");
            $this.addClass("active");
        } else {
            // മൊബൈലിൽ, ക്ലിക്ക് ചെയ്യുമ്പോൾ തന്നെ active ആക്കുക
            $carousel.find('.item').removeClass("active");
            $this.addClass("active");
        }
        
        const clickedIndex = $this.closest('.owl-item').index();
        // സ്ലൈഡിംഗ് സമയം 600ms ആയി സജ്ജീകരിക്കുന്നു
        owl.to(clickedIndex, 600); 
    });

    // 4. Slide Transition End: സ്ലൈഡ് ചെയ്ത ശേഷം active ക്ലാസ് മാറ്റുന്നതിന്
    $carousel.on('translated.owl.carousel', function (event) {
        if ($(window).width() >= 768) {
            updateActiveItem($carousel);
        } else {
            // മൊബൈലിൽ (autoWidth: false) നിലവിലെ ഐറ്റത്തിനെ active ആക്കുന്നു
            const current = event.item.index;
            $carousel.find('.item').removeClass("active");
            $carousel.find('.owl-item').eq(current).find('.item').addClass('active');
        }
    });
    
    // നാവിഗേഷൻ ബട്ടണുകൾ active/inactive ആക്കുന്നത്
    $carousel.on('changed.owl.carousel', function(event) {
         $('.custom-carousel-nav button').removeClass('active-btn');
         if (event.direction === 'prev') {
             $('.custom-prev-btn').addClass('active-btn');
         } else {
             $('.custom-next-btn').addClass('active-btn');
         }
    });
    
});