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
const slides = document.getElementsByClassName("mySlides");

if (slides.length > 0) {
    // === DÉBUT DU CODE DU DIAPORAMA SÉCURISÉ ===
    
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
        // La variable slides est définie en dehors, mais on la redéfinit ici pour être sûr
        // let slides = document.getElementsByClassName("mySlides"); 
        let dots = document.getElementsByClassName("dot");
        
        if (n > slides.length) { slideIndex = 1 }    
        
        if (n < 1) { slideIndex = slides.length }
        
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].classList.remove("active-slide"); 
        }
        
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active-dot", "");
        }
        
        slides[slideIndex - 1].style.display = "flex";  
        slides[slideIndex - 1].classList.add("active-slide"); 
        
        // Assurez-vous que les points existent avant de les manipuler
        if (dots.length > 0) {
             dots[slideIndex - 1].className += " active-dot";
        }
    }
    // === FIN DU CODE DU DIAPORAMA SÉCURISÉ ===
}

document.addEventListener('DOMContentLoaded', (event) => {
    const audio = document.getElementById('background-audio');
    const btn = document.getElementById('audio-control-btn');
    const icon = document.getElementById('audio-icon'); 
    
    // Définition des classes Font Awesome
    const classMute = 'fa-volume-up';
    const classPlay = 'fa-volume-mute';
    
    let isPlaying = false; 
    
    // --- NOUVELLE INITIALISATION AU DÉBUT ---
    // On s'assure que le bouton affiche l'icône PLAY au chargement (puisque l'autoplay est bloqué)
    icon.classList.remove(classMute); 
    icon.classList.add(classPlay);
    btn.title = "Activer le son"; // Met à jour l'info-bulle

    audio.play().then(() => {
        // Autoplay fonctionne (rare)
        isPlaying = true;
        // On ne peut pas garantir que l'icône actuelle est Play, on utilise donc toggle/add/remove
        icon.classList.remove(classPlay);
        icon.classList.add(classMute);
        btn.title = "Couper le son";
    }).catch(error => {
        // Autoplay bloqué (fréquent), on reste en mode PLAY, isPlaying = false est déjà bon
        // Rien à faire ici, l'icône est déjà bien réglée ci-dessus.
    });

    btn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            icon.classList.remove(classMute);
            icon.classList.add(classPlay);
            btn.title = "Activer le son";
        } else {
            audio.play().catch(e => {
                console.error("Erreur lors de la lecture audio:", e);
            });
            icon.classList.remove(classPlay);
            icon.classList.add(classMute);
            btn.title = "Couper le son";
        }
        isPlaying = !isPlaying;
    });
});


function toggleGalleryState(element) {
    
    // Détection si nous sommes dans une zone considérée comme Mobile/Tablette (<= 1024px)
    // C'est le meilleur compromis pour synchroniser votre CSS responsive et le JS.
    const isMobileOrTabletView = window.matchMedia('(max-width: 1024px)').matches;
    const isSpoiler = element.classList.contains('spoiler-blur');

    // --- CAS 1 : MODE DESKTOP (Écran > 1024px, la vue par défaut) ---
    if (!isMobileOrTabletView) {
        
        // Sur PC, le clic doit UNIQUEMENT gérer l'anti-spoil (flou)
        if (isSpoiler) {
            // Bascule simplement la classe 'revealed' (enlève le flou).
            // Le CSS :hover gère la description (qui doit être active en dehors des media queries).
            element.classList.toggle('revealed');
        }
        return; // Le travail est fait, on quitte la fonction.
    }

    // --- CAS 2 : MODE MOBILE/TABLETTE (Écran <= 1024px, Logique Complexe) ---

    // Récupère l'état actuel de l'élément (initialisé à 0 si non défini)
    let clickCount = parseInt(element.getAttribute('data-click-count')) || 0;
    
    // Incrémente le compteur
    clickCount++; 

    // --- LOGIQUE D'ÉTAT ---

    let maxClicks = isSpoiler ? 3 : 2; // Spoil = 3 étapes, Non-Spoil = 2 étapes
    
    // Réinitialise le compteur si le cycle est terminé
    if (clickCount > maxClicks) {
        clickCount = 1; 
    }
    
    // Définit le nouvel état
    element.setAttribute('data-click-count', clickCount);

    // --- APPLICATION DE L'ÉTAT ACTUEL (Nettoyage et Ajout) ---
    
    // Nettoyage avant application :
    element.classList.remove('revealed'); 
    element.classList.remove('caption-visible'); 

    if (isSpoiler) {
        // --- CAS SPOIL : 1=Flou, 2=Description, 3=Reset ---
        if (clickCount === 1) {
            element.classList.add('revealed'); // Enlève le flou (image visible)
        } else if (clickCount === 2) {
            element.classList.add('revealed'); // Maintient l'image visible
            element.classList.add('caption-visible'); // Affiche la description
        } else if (clickCount === 3) {
            // Reset (on laisse les classes enlevées ci-dessus)
            element.setAttribute('data-click-count', 0); // Prêt pour Clic 1
        }
        
    } else {
        // --- CAS NON-SPOIL : 1=Description, 2=Reset ---
        
        if (clickCount === 1) {
            element.classList.add('caption-visible'); // Affiche la description
        } else if (clickCount === 2) {
            // Reset
            element.setAttribute('data-click-count', 0); // Prêt pour Clic 1
        }
    }
}

function toggleVideoSpoiler(element) {
    element.classList.toggle('revealed');
}

