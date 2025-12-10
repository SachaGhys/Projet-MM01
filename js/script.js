/* menu burger */
const burgerMenu = document.getElementById('burger-menu');
const navMenu = document.getElementById('nav-menu');

if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}


/* menu dropdown */
const dropdownLinks = document.querySelectorAll('.dropdown > a');

dropdownLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            
            e.preventDefault(); 

            const parentLi = this.parentElement;
            
            const estDejaOuvert = parentLi.classList.contains('active');

            document.querySelectorAll('.dropdown').forEach(item => {
                item.classList.remove('active');
            });

            if (!estDejaOuvert) {
                parentLi.classList.add('active');
            }
        }
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});



/* slide show */
        let slideIndex = 1;
            showSlides(slideIndex);

            function plusSlides(n) {
                showSlides(slideIndex += n);
            }

            
            function currentSlide(n) {
                showSlides(slideIndex = n);
            }

            function showSlides(n) {
                let i;
                let slides = document.getElementsByClassName("mySlides");
                let dots = document.getElementsByClassName("dot");
                
                if (n > slides.length) {slideIndex = 1}    
                
                if (n < 1) {slideIndex = slides.length}
                
                for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";  
                    slides[i].classList.remove("active-slide"); 
                }
                
                for (i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active-dot", "");
                }
                
                slides[slideIndex-1].style.display = "flex";  
                slides[slideIndex-1].classList.add("active-slide"); 
                dots[slideIndex-1].className += " active-dot";
            }