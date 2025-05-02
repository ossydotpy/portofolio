document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const prevButton = document.querySelector('.timeline-nav.prev');
    const nextButton = document.querySelector('.timeline-nav.next');
    let currentIndex = 0;
    let isAnimating = false;

    // Initialize positions
    function initializeCards() {
        timelineItems.forEach((item, index) => {
            item.style.transform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
            item.style.opacity = 1 - (index * 0.2);
        });
        timelineItems[0].classList.add('active');
        updateNavigationButtons();
    }

    // Navigate to specific card
    function navigateToCard(targetIndex) {
        if (isAnimating || targetIndex === currentIndex) return;
        
        isAnimating = true;
        const direction = targetIndex > currentIndex ? 'forward' : 'backward';
        
        timelineItems.forEach((item, index) => {
            item.classList.remove('active');
            
            if (direction === 'forward') {
                if (index < targetIndex) {
                    item.style.transform = `translateX(-100%) translateY(${index * 20}px) scale(${1 - index * 0.05})`;
                    item.style.opacity = 0;
                } else {
                    const offset = index - targetIndex;
                    item.style.transform = `translateY(${offset * 20}px) scale(${1 - offset * 0.05})`;
                    item.style.opacity = 1 - (offset * 0.2);
                }
            } else {
                if (index < targetIndex) {
                    item.style.transform = `translateX(-100%) translateY(${index * 20}px) scale(${1 - index * 0.05})`;
                    item.style.opacity = 0;
                } else {
                    const offset = index - targetIndex;
                    item.style.transform = `translateY(${offset * 20}px) scale(${1 - offset * 0.05})`;
                    item.style.opacity = 1 - (offset * 0.2);
                }
            }
        });

        timelineItems[targetIndex].classList.add('active');
        currentIndex = targetIndex;
        updateNavigationButtons();

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    // Update navigation button states
    function updateNavigationButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === timelineItems.length - 1;
    }

    // Button click handlers
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            navigateToCard(currentIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < timelineItems.length - 1) {
            navigateToCard(currentIndex + 1);
        }
    });

    // Initialize
    initializeCards();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevButton.disabled) {
            navigateToCard(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && !nextButton.disabled) {
            navigateToCard(currentIndex + 1);
        }
    });

    // Projects Stack Initialization
    const projectsStack = document.querySelector('.projects-stack');
    let projectCards = document.querySelectorAll('.project-card'); // Use let to allow reassignment
    const prevProjectBtn = projectsStack.querySelector('.project-nav.prev');
    const nextProjectBtn = projectsStack.querySelector('.project-nav.next');
    let isProjectAnimating = false; // Renamed to avoid conflict

    function cycleCards(direction) {
        if (isProjectAnimating) return;
        isProjectAnimating = true;

        projectCards = projectsStack.querySelectorAll('.project-card'); // Update node list
        const cards = Array.from(projectCards);
        const transitionDuration = 500; // ms, match CSS
        const isMobile = window.innerWidth <= 768;

        if (direction === 'next') {
            if (cards.length < 2) { // Need at least 2 cards to cycle
                isProjectAnimating = false;
                return;
            }
            const firstCard = cards[0];

            // Animate the top card flying off
            firstCard.style.transition = `transform ${transitionDuration / 1000}s cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${transitionDuration / 1000}s ease-out`;
            // Adjust animation for mobile vs desktop
            const flyOffTransform = isMobile
                ? 'translateX(100%) translateY(10px) rotate(10deg) scale(0.85)' // Less horizontal, slight vertical
                : 'translateX(150%) translateY(20px) rotate(15deg) scale(0.8)'; // Original desktop
            firstCard.style.transform = flyOffTransform;
            firstCard.style.opacity = '0';
            firstCard.style.zIndex = '-1';

            // Shift remaining cards up smoothly
            cards.slice(1).forEach((card, index) => {
                card.style.transition = `all ${transitionDuration / 1000}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                applyCardStyle(card, index, cards.length - 1);
            });

            // After the animation completes
            setTimeout(() => {
                // Move the card element to the end of the stack in the DOM
                projectsStack.appendChild(firstCard);

                // Reset styles for the moved card (now last) without transition
                firstCard.style.transition = 'none';
                firstCard.style.opacity = '1';

                // Update all card positions/styles based on the new order
                updateProjectCards();

                // Allow new animations after a short delay
                setTimeout(() => {
                    isProjectAnimating = false;
                }, 50); // Small buffer

            }, transitionDuration);

        } else { // direction === 'prev'
            if (cards.length < 2) { // Need at least 2 cards to cycle back
                isProjectAnimating = false;
                return;
            }
            const lastCard = cards[cards.length - 1];

            // Instantly move the last card element to the beginning of the stack in the DOM
            projectsStack.insertBefore(lastCard, cards[0]);

            // Position the new first card off-screen (left/top) without transition, ready to animate in
            lastCard.style.transition = 'none';
            // Adjust animation for mobile vs desktop
            const flyOnTransform = isMobile
                ? 'translateX(-100%) translateY(10px) rotate(-10deg) scale(0.85)' // Less horizontal, slight vertical
                : 'translateX(-150%) translateY(20px) rotate(-15deg) scale(0.8)'; // Original desktop
            lastCard.style.transform = flyOnTransform;
            lastCard.style.opacity = '0';
            lastCard.style.zIndex = cards.length + 1; // Ensure it's on top initially

            // Force reflow/repaint to apply the initial off-screen style before animating
            void lastCard.offsetWidth;

            // Update all card positions smoothly, animating the new first card into view
            // and shifting others down. This applies the correct transitions and final styles.
            updateProjectCards();

            // Allow new animations after the transition duration
            setTimeout(() => {
                isProjectAnimating = false;
            }, transitionDuration);
        }
    }

    // Helper function to apply styles based on index
    function applyCardStyle(card, index, totalCards) {
        const isMobile = window.innerWidth <= 768;
        let transformStyle = '';
        let opacity = 1;
        const zIndex = totalCards - index;

        if (isMobile) {
            // Mobile layout: Tighter vertical stack
            const translateY = index * 8; // Reduced vertical offset for tighter stack
            const scale = 1 - (index * 0.03); // Slightly increased scale difference
            transformStyle = `translateY(${translateY}px) scale(${scale})`;
            opacity = index < 4 ? 1 : Math.max(0, 1 - (index - 3) * 0.5); // Fade out cards after the 4th more quickly
        } else {
            // Desktop layout: Fan out slightly
            if (index < 3) { // Apply fan to top 3 cards
                const angle = -5 + (index * 5); // Smaller angle range
                const translateX = index * 5; // Slight horizontal offset
                const translateY = index * 8; // Slight vertical offset
                transformStyle = `translate(${translateX}px, ${translateY}px) rotate(${angle}deg) scale(1)`;
            } else {
                // Cards further back are stacked more tightly and faded
                const baseTranslateY = 2 * 8;
                const additionalTranslateY = (index - 2) * 5;
                const translateY = baseTranslateY + additionalTranslateY;
                const scale = Math.max(0.9, 1 - (index - 2) * 0.03);
                transformStyle = `translate(${2 * 5}px, ${translateY}px) rotate(5deg) scale(${scale})`;
                opacity = Math.max(0, 1 - (index - 2) * 0.35);
            }
        }
        card.style.transform = transformStyle;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
    }

    function updateProjectCards() {
        projectCards = projectsStack.querySelectorAll('.project-card'); // Update node list
        const cards = Array.from(projectCards);
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            // Apply transition for smooth updates (unless it's the card being reset)
            if (card.style.transition === 'none') {
                // If transition was 'none', apply the standard transition after a frame
                requestAnimationFrame(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    applyCardStyle(card, index, totalCards);
                });
            } else {
                card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                applyCardStyle(card, index, totalCards);
            }
        });
    }

    // Navigation handlers
    prevProjectBtn.addEventListener('click', () => cycleCards('prev'));
    nextProjectBtn.addEventListener('click', () => cycleCards('next'));

    // Initialize layout
    updateProjectCards();

    // Update layout on resize
    window.addEventListener('resize', () => {
        // No animation needed on resize, just reposition
        projectCards.forEach(card => card.style.transition = 'none');
        updateProjectCards();
        // Re-enable transitions after a short delay
        setTimeout(() => {
             projectCards.forEach(card => card.style.transition = ''); // Reset to CSS default or previous value
        }, 50);
    });

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    projectsStack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projectsStack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) < swipeThreshold) return; // Not a swipe

        if (diff > 0) { // Swiped right (towards previous)
            cycleCards('prev');
        } else { // Swiped left (towards next)
            cycleCards('next');
        }
    }
});
