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

    // ഡെസ്ക്ടോപ്പ് വ്യൂ ലോജിക്
    // നിലവിലുള്ള എല്ലാ active ക്ലാസ്സുകളും നീക്കം ചെയ്യുന്നു
    $carousel.find('.item').removeClass("active");

    // .owl-item.active-ൽ ഇടതുവശത്ത് കാണുന്ന ആദ്യത്തെ ഐറ്റം കണ്ടെത്തുന്നു
    const firstVisibleItem = $carousel.find('.owl-item.active').first().find('.item');
    
    if (firstVisibleItem.length) {
        // കാറൗസലിലെ ആദ്യത്തെ വിസിബിൾ ഐറ്റത്തിന് active ക്ലാസ് നൽകുന്നു
        firstVisibleItem.addClass('active');
    }
}

// നാവിഗേഷൻ ബട്ടണുകൾ active/inactive ആക്കുന്ന ഫംഗ്ഷൻ ( ആവശ്യമെങ്കിൽ ഉപയോഗിക്കാം)
/*
function updateNavButtons(event) {
     if ($(window).width() >= 768) {
         // ഇവിടെ നാവിഗേഷൻ ബട്ടൺ സ്റ്റൈലിനായുള്ള ലോജിക് ചേർക്കുക
     }
}
*/


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
        
        slideSpeed: 600, // സ്മൂത്ത് സ്ലൈഡിംഗ്
        dragEndSpeed: 600, 
        
        // മൊബൈൽ റെസ്പോൺസീവ് ഓപ്ഷൻ
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
            // 1200px-ൽ AutoWidth തിരികെ വരുന്നു
             1200: { 
                autoWidth: true, 
                items: 2.5, 
                margin: 15,
            },
             1400: { 
                autoWidth: true, 
                items: 3.2, 
                margin: 15,
            }
        },

        onInitialized: function (event) {
            // കാറൗസൽ ലോഡ് ചെയ്യുമ്പോൾ active ഐറ്റം സെറ്റ് ചെയ്യുന്നു
            updateActiveItem($carousel); 
        },
        
        onResized: function (event) {
             // സ്ക്രീൻ സൈസ് മാറുമ്പോൾ: കാറൗസൽ ഡാറ്റ അപ്ഡേറ്റ് ചെയ്യുകയും active item സെറ്റ് ചെയ്യുകയും വേണം
            
            // കാറൗസൽ ഡാറ്റ റീകാൽക്കുലേറ്റ് ചെയ്ത് റിഫ്രഷ് ചെയ്യുക
            $carousel.trigger('refresh.owl.carousel');
            
            // active ഐറ്റം ലോജിക് വീണ്ടും വിളിക്കുന്നു
            updateActiveItem($carousel); 
        }
    });

    const owl = $carousel.data('owl.carousel'); 

    // 2. Custom Navigation Buttons: (setTimeout ഒഴിവാക്കി സ്മൂത്ത് ട്രാൻസിഷൻ ഉറപ്പാക്കുന്നു)
    $('.custom-prev-btn').on('click', function() {
        owl.prev();
    });

    $('.custom-next-btn').on('click', function() {
        owl.next();
    });
    
    // 3. Item Click Handler:
    $carousel.on('click', '.item', function () {
        const $this = $(this);
        
        // ഡെസ്ക്ടോപ്പിൽ മാത്രം active ക്ലാസ് മാറ്റുക
        if ($(window).width() >= 768) {
            $carousel.find('.item').removeClass("active");
            $this.addClass("active");
            
            const clickedIndex = $this.closest('.owl-item').index();
            owl.to(clickedIndex, 600); // സ്മൂത്ത് ട്രാൻസിഷൻ
        } 
    });

    // 4. Slide Transition End:
    // സ്ലൈഡിംഗ് പൂർത്തിയാകുമ്പോൾ active ഐറ്റം കൃത്യമായി സെറ്റ് ചെയ്യുന്നു.
    $carousel.on('translated.owl.carousel', function (event) {
        if ($(window).width() >= 768) {
            updateActiveItem($carousel);
        } 
    });
    
    // 5. Window Resize Debounce Logic: 
    // വലിയ സ്ക്രീനിലേക്ക് മാറുമ്പോൾ ഉണ്ടാകുന്ന ലേഔട്ട് പ്രശ്നം പരിഹരിക്കാൻ.
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // owl carousel-നെ റീകാൽക്കുലേറ്റ് ചെയ്ത് റിഫ്രഷ് ചെയ്യുന്നു
            $carousel.trigger('refresh.owl.carousel');
            
            // active item-നെ അപ്ഡേറ്റ് ചെയ്യുന്നു
            updateActiveItem($carousel);
        }, 300); // 300ms ഡിലേ നൽകുന്നത് കാൽക്കുലേഷൻ പിശകുകൾ ഒഴിവാക്കാൻ സഹായിക്കും
    });
    
    // 6. Navigation Button Style Logic (നിലവിലെ ലോജിക്):
    $carousel.on('changed.owl.carousel', function(event) {
         if ($(window).width() >= 768) {
              $('.custom-carousel-nav button').removeClass('active-btn');
              // changed ഇവൻ്റിൽ event.direction ലഭ്യമല്ലാത്തതിനാൽ
              // ഈ ലോജിക് കൃത്യമായി പ്രവർത്തിച്ചേക്കില്ല. 
              // എങ്കിലും, നിങ്ങളുടെ പഴയ ലോജിക് നിലനിർത്തുന്നു.
              if (event.direction === 'prev') {
                  $('.custom-prev-btn').addClass('active-btn');
              } else {
                  $('.custom-next-btn').addClass('active-btn');
              }
         }
    });
    
});