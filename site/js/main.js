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

    // --- Projects Section Logic --- //

    // Corrected Selectors for Projects Section
    const projectsContainer = document.querySelector('#projects .project-timeline-items');
    const projectCards = projectsContainer ? projectsContainer.querySelectorAll('.project-timeline-item') : [];
    const projectControls = document.querySelector('#projects .project-timeline-controls');
    const prevProjectBtn = projectControls ? projectControls.querySelector('.project-timeline-nav.prev') : null;
    const nextProjectBtn = projectControls ? projectControls.querySelector('.project-timeline-nav.next') : null;

    let currentProjectIndex = 0;
    let isProjectAnimating = false;

    // Initialize Project Card positions (MATCHING timeline)
    function initializeProjectCards() {
        if (!projectCards || projectCards.length === 0) return;
        projectCards.forEach((item, index) => {
            // Use exact values from timeline initializeCards
            item.style.transform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
            item.style.opacity = 1 - (index * 0.2);
            item.style.zIndex = projectCards.length - index;
            item.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'; // Match timeline transition timing
        });
        projectCards[0].classList.add('active');
        updateProjectNavigationButtons();
    }

    // Navigate Project Cards (MATCHING timeline logic exactly)
    function navigateToProjectCard(targetIndex) {
        if (!projectCards || projectCards.length === 0 || isProjectAnimating || targetIndex === currentProjectIndex || targetIndex < 0 || targetIndex >= projectCards.length) return;

        isProjectAnimating = true;
        const direction = targetIndex > currentProjectIndex ? 'forward' : 'backward';

        projectCards.forEach((item, index) => {
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

        projectCards[targetIndex].classList.add('active');
        currentProjectIndex = targetIndex;
        updateProjectNavigationButtons();

        setTimeout(() => {
            isProjectAnimating = false;
        }, 600);
    }

    // Update Project navigation button states
    function updateProjectNavigationButtons() {
        if (!prevProjectBtn || !nextProjectBtn || !projectCards || projectCards.length === 0) return;
        prevProjectBtn.disabled = currentProjectIndex === 0;
        nextProjectBtn.disabled = currentProjectIndex === projectCards.length - 1;
    }

    // Add checks before adding event listeners
    if (prevProjectBtn && nextProjectBtn && projectCards.length > 0) {
        prevProjectBtn.addEventListener('click', () => {
            if (currentProjectIndex > 0) {
                navigateToProjectCard(currentProjectIndex - 1);
            }
        });
        nextProjectBtn.addEventListener('click', () => {
            if (currentProjectIndex < projectCards.length - 1) {
                navigateToProjectCard(currentProjectIndex + 1);
            }
        });

        // Initialize Project Card layout only if elements exist
        initializeProjectCards();

        // Touch support (ensure container exists)
        const projectsStackElement = document.querySelector('#projects .project-timeline-items'); // Use the correct selector again for clarity
        if (projectsStackElement) {
            let touchStartX = 0;
            let touchEndX = 0;

            projectsStackElement.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true }); // Can likely be passive now

            projectsStackElement.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);

            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchEndX - touchStartX;

                if (Math.abs(diff) < swipeThreshold) return;

                if (diff > 0 && !prevProjectBtn.disabled) {
                    navigateToProjectCard(currentProjectIndex - 1);
                } else if (diff < 0 && !nextProjectBtn.disabled) {
                    navigateToProjectCard(currentProjectIndex + 1);
                }
                touchStartX = 0;
                touchEndX = 0;
            }
        }
    } else {
        console.warn('Project timeline elements not found. Skipping initialization.');
    }
});