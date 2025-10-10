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
    // 768px-ന് താഴെ ഈ ലോജിക് ഒഴിവാക്കുന്നു (കാരണം മൊബൈലിൽ എല്ലാം active ആകണം)
    if ($(window).width() < 768) {
        // മൊബൈൽ/ടാബ്ലെറ്റ് വ്യൂവിൽ: എല്ലാ ഐറ്റത്തിനും active ക്ലാസ് ചേർക്കുന്നു
        $carousel.find('.item').addClass('active');
        return;
    }

    // ഡെസ്ക്ടോപ്പ് വ്യൂ ലോജിക് (AutoWidth-ന് വേണ്ടി)
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
        autoWidth: true,
        loop: true,
        dots: false,
        nav: false,
        autoplay: false,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        margin: 15,
        
        slideSpeed: 600, 
        dragEndSpeed: 600, 
        
        // മൊബൈൽ റെസ്പോൺസീവ് ഓപ്ഷൻ
        responsive: {
            0: { 
                // മൊബൈലിൽ 1.1 ഐറ്റം കാണിക്കുന്നു, പക്ഷെ എല്ലാം active ആയിരിക്കും
                items: 1.1, 
                autoWidth: false, 
                margin: 10,
            },
            768: { 
                autoWidth: false, 
                items: 2, 
                margin: 15,
            },
            991: { 
                autoWidth: false, 
                items: 2, 
                margin: 15,
            },
             1024: { 
                autoWidth: true, 
                items: 3.2, 
                margin: 15,
            }
        },

        onInitialized: function (event) {
            // കാറൗസൽ ലോഡ് ചെയ്യുമ്പോൾ active ഐറ്റം സെറ്റ് ചെയ്യുന്നു
            // മൊബൈലിൽ എല്ലാ ഐറ്റവും active ആകും
            updateActiveItem($carousel); 
        },
        
        onResized: function (event) {
             // സൈസ് മാറുമ്പോൾ active ഐറ്റം ലോജിക് വീണ്ടും വിളിക്കുന്നു
            updateActiveItem($carousel); 
        }
    });

    const owl = $carousel.data('owl.carousel'); 

    // 2. Custom Navigation Buttons: 
    $('.custom-prev-btn').on('click', function() {
        owl.prev();
        // ഡെസ്ക്ടോപ്പിൽ ചെറിയ ഡിലേ നൽകുന്നു
        if ($(window).width() >= 768) {
            setTimeout(() => { updateActiveItem($carousel); }, 50); 
        }
    });

    $('.custom-next-btn').on('click', function() {
        owl.next();
        // ഡെസ്ക്ടോപ്പിൽ ചെറിയ ഡിലേ നൽകുന്നു
        if ($(window).width() >= 768) {
            setTimeout(() => { updateActiveItem($carousel); }, 50); 
        }
    });
    
    // 3. Item Click Handler:
    $carousel.on('click', '.item', function () {
        const $this = $(this);
        
        // ഡെസ്ക്ടോപ്പിൽ മാത്രം active ക്ലാസ് മാറ്റുക
        if ($(window).width() >= 768) {
            $carousel.find('.item').removeClass("active");
            $this.addClass("active");
            
            const clickedIndex = $this.closest('.owl-item').index();
            owl.to(clickedIndex, 600); 
        } else {
            // മൊബൈലിൽ ക്ലിക്കിൽ ഒന്നും ചെയ്യേണ്ട, എല്ലാം default ആയി active ആണ്
        }
    });

    // 4. Slide Transition End:
    $carousel.on('translated.owl.carousel', function (event) {
        // ഇവിടെ മൊബൈലിലെ active ക്ലാസ് മാറ്റുന്ന ലോജിക് ആവശ്യമില്ല. 
        // കാരണം, മൊബൈലിൽ എല്ലാ ഐറ്റവും active ആയി നിലനിർത്താനാണ് പുതിയ തീരുമാനം.
        if ($(window).width() >= 768) {
            updateActiveItem($carousel);
        } 
    });
    
    // നാവിഗേഷൻ ബട്ടണുകൾ active/inactive ആക്കുന്നത്
    $carousel.on('changed.owl.carousel', function(event) {
         // ഡെസ്ക്ടോപ്പ് നാവിഗേഷൻ സ്റ്റൈലിനായുള്ള ലോജിക് നിലനിർത്തുന്നു
        if ($(window).width() >= 768) {
             $('.custom-carousel-nav button').removeClass('active-btn');
             if (event.direction === 'prev') {
                 $('.custom-prev-btn').addClass('active-btn');
             } else {
                 $('.custom-next-btn').addClass('active-btn');
             }
        }
    });
    
});