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
        
        if (dots.length > 0) {
             dots[slideIndex - 1].className += " active-dot";
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const audio = document.getElementById('background-audio');
    const btn = document.getElementById('audio-control-btn');
    const icon = document.getElementById('audio-icon'); 
    
    // Définition des classes Font Awesome
    const classMute = 'fa-volume-up';
    const classPlay = 'fa-volume-mute';
    
    let isPlaying = false; 
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
    // CAS 1 : MODE DESKTOP (Écran > 1024px, la vue par défaut) 
    if (!isMobileOrTabletView) {
        
        // Sur PC, le clic doit uniquement gérer l'anti-spoil (flou)
        if (isSpoiler) {
            // Bascule simplement la classe 'revealed' (enlève le flou).
            // Le CSS :hover gère la description (qui doit être active en dehors des media queries).
            element.classList.toggle('revealed');
        }
        return; // Le travail est fait, on quitte la fonction.
    }

    // CAS 2 : MODE MOBILE/TABLETTE (Écran <= 1024px, Logique Complexe) 

    // Récupère l'état actuel de l'élément (initialisé à 0 si non défini)
    let clickCount = parseInt(element.getAttribute('data-click-count')) || 0;
    
    // Incrémente le compteur
    clickCount++; 

    let maxClicks = isSpoiler ? 3 : 2; // Spoil = 3 étapes, Non-Spoil = 2 étapes
    
    // Réinitialise le compteur si le cycle est terminé
    if (clickCount > maxClicks) {
        clickCount = 1; 
    }
    
    // Définit le nouvel état
    element.setAttribute('data-click-count', clickCount);

    // Application de l'état actuel (Nettoyage et Ajout)
    
    // Nettoyage avant application :
    element.classList.remove('revealed'); 
    element.classList.remove('caption-visible'); 

    if (isSpoiler) {
        // --- CAS spoil : 1=Flou, 2=Description, 3=Reset ---
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
        // --- CAS non-spoil : 1=Description, 2=Reset ---
        
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

// Gère l'affichage/disparition du Loader au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Vérifie si l'élément loader existe (s'applique uniquement à index.html)
    const loader = document.getElementById('page-loader');
    if (loader) {
        // La fonction load est lancée lorsque TOUS les actifs sont prêts (images, iframes, etc.)
        window.addEventListener('load', () => {
            // Ajoute la classe 'hidden' pour déclencher la transition CSS (opacité à 0)
            loader.classList.add('hidden');
            
            // OPTIONNEL : Retire l'élément du DOM après la transition
            setTimeout(() => {
                loader.remove(); 
            }, 600); // Temps légèrement supérieur à la transition CSS (0.5s)
        });
    }
});


function toggleSpoiler(element) {
            element.classList.toggle('revealed');
        }

document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('nolan-quiz');
    
    if (!quizForm) return; 

    // Définition des réponses correctes
    const correctAnswers = {
        q1: 'b', // Memento
        q2: 'c', // 7 ans
        q3: 'c', // Heath Ledger
        q4: 'd', // L'Inception
        q5: 'b'  // IMAX (70mm)
    };
    
    // Fonction principale pour vérifier et afficher les couleurs
    function checkAnswer(currentCard, currentId, nextId) {
        const questionName = currentId;
        const userAnswer = quizForm.elements[questionName].value;
        const correctAnswer = correctAnswers[questionName];
        
        if (!userAnswer) {
            alert("Veuillez sélectionner une réponse pour confirmer.");
            return;
        }

        // 1. Désactiver toutes les options
        const inputs = currentCard.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.disabled = true; // Empêche de re-cliquer
            const label = currentCard.querySelector(`label[for="${input.id}"]`);
            
            if (input.value === correctAnswer) {
                // 2. Marquer la bonne réponse en VERT
                label.classList.add('correct');
            } else if (input.value === userAnswer) {
                // 3. Marquer la mauvaise réponse sélectionnée par l'utilisateur en rouge
                label.classList.add('incorrect');
            }
        });

        // 4. Changer les boutons (Confirmer devient Continuer)
        currentCard.querySelector('.check-btn').classList.add('hidden');
        
        const continueBtn = currentCard.querySelector('.continue-btn');
        continueBtn.classList.remove('hidden');
        
        // S'assurer que le bouton Continuer sait où aller
        if (nextId === 'results') {
            continueBtn.addEventListener('click', calculateAndShowResults);
        } else {
            continueBtn.addEventListener('click', () => {
                 goToNextQuestion(currentId, nextId);
            });
        }
    }

    // Fonction pour passer à la question suivante (après la vérification)
    function goToNextQuestion(currentId, nextId) {
        const currentCard = document.getElementById(currentId);
        const nextCard = document.getElementById(nextId);
        
        currentCard.classList.add('hidden');
        if (nextCard) {
            nextCard.classList.remove('hidden');
            // Défilement doux vers le haut de la nouvelle question
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Fonction de soumission finale (à appeler par le bouton Continuer de la dernière question)
    function calculateAndShowResults() {
        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        
        // Calcul du score
        for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
            const userAnswer = quizForm.elements[question].value;
            if (userAnswer === correctAnswer) {
                score++;
            }
        }
        
        // Affichage des résultats
        const resultsCard = document.getElementById('results');
        const scoreDisplay = document.getElementById('score-display');
        const gradeMessage = document.getElementById('grade-message');
        
        document.getElementById('q5').classList.add('hidden');
        resultsCard.classList.remove('hidden');
        
        scoreDisplay.textContent = `Votre score est de ${score}/${totalQuestions}.`;
        
        // Message d'évaluation
        let message = "";
        if (score === totalQuestions) {
            message = "Félicitations ! Vous êtes un Maître Criptologue du cinéma de Nolan. L'œuvre n'a plus de secrets pour vous.";
        } else if (score >= totalQuestions - 1) {
            message = "Très bien ! Presque parfait. Vous faites partie des Initiés.";
        } else if (score >= totalQuestions / 2) {
            message = "Bon score. Vous avez une solide base de connaissances sur l'univers de Nolan.";
        } else {
            message = "Temps de Revoir les Classiques ! Quelques zones d'ombre subsistent.";
        }
        gradeMessage.textContent = message;

        // Défilement doux vers la carte des résultats
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    }

    // Gestion des boutons "Confirmer la réponse" (Check-btn)
    const checkButtons = document.querySelectorAll('.check-btn');
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentId = button.parentElement.id;
            const nextId = button.getAttribute('data-next');
            checkAnswer(button.parentElement, currentId, nextId);
        });
    });
});