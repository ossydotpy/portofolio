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
    const projectCards = document.querySelectorAll('.project-card');
    let activeCard = null;
    let isSpread = false;
    let isMobile = window.innerWidth <= 768;
    let startX, startY, moveX, moveY;
    let currentCardIndex = 0;

    // Create pagination dots for mobile
    function createPaginationDots() {
        if (projectCards.length <= 1) return;
        
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'card-pagination';
        
        projectCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'card-pagination-dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isMobile && !isAnimating) {
                    navigateToProjectCard(index);
                }
            });
            
            paginationContainer.appendChild(dot);
        });
        
        projectsStack.appendChild(paginationContainer);
    }

    // Navigate to a specific project card (for mobile)
    function navigateToProjectCard(index) {
        if (index === currentCardIndex || isAnimating) return;
        
        isAnimating = true;
        
        // Update the dots
        const dots = document.querySelectorAll('.card-pagination-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Handle the card navigation
        const direction = index > currentCardIndex ? 1 : -1;
        
        // Animate cards out
        projectCards.forEach((card, i) => {
            if (i === currentCardIndex) {
                card.style.transform = `translateX(${-direction * 100}%) scale(0.8)`;
                card.style.opacity = '0';
                card.style.zIndex = '1';
            }
        });
        
        setTimeout(() => {
            // Reset all cards to their stacked position
            resetCards(true);
            
            // Then set the new active card
            currentCardIndex = index;
            
            // Bring the new current card to the front
            projectCards.forEach((card, i) => {
                if (i === currentCardIndex) {
                    card.style.zIndex = projectCards.length + 1;
                } else if (i > currentCardIndex) {
                    // Cards after current should be stacked below
                    card.style.zIndex = projectCards.length - (i - currentCardIndex);
                } else {
                    // Cards before current should be behind all others
                    card.style.zIndex = i;
                }
            });
            
            isAnimating = false;
        }, 300);
    }

    // Update mobile state on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth <= 768;
            
            // Only react if mobile state actually changed
            if (wasMobile !== isMobile) {
                resetCards(isMobile);
                
                // Show/hide pagination based on mobile state
                const pagination = document.querySelector('.card-pagination');
                if (pagination) {
                    pagination.style.display = isMobile ? 'flex' : 'none';
                }
            }
        }, 250);
    });

    // Initialize cards with better mobile handling
    projectCards.forEach((card, index) => {
        // Set initial positions - cards stacked with slight offset
        const translateX = isMobile ? 0 : [-2, 0, 2][index];
        const translateY = isMobile ? (index * 10) : [-2, 0, 2][index];
        const rotate = isMobile ? 0 : [-1, 0, 1][index];
        
        card.style.transform = `translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`;
        card.style.zIndex = projectCards.length - index;
        
        // Add swipe handlers for mobile
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);
    });

    // Touch handlers for swipe navigation
    function handleTouchStart(e) {
        if (activeCard) return;
        
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        moveX = 0;
        moveY = 0;
    }
    
    function handleTouchMove(e) {
        if (!startX || !startY || activeCard) return;
        
        const touch = e.touches[0];
        moveX = touch.clientX - startX;
        moveY = touch.clientY - startY;
        
        // Determine if horizontal swipe
        if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 30) {
            e.preventDefault(); // Prevent scrolling during swipe
        }
    }
    
    function handleTouchEnd() {
        if (!startX || !startY || activeCard || isAnimating) return;
        
        // If it's a significant horizontal swipe
        if (Math.abs(moveX) > 50 && Math.abs(moveX) > Math.abs(moveY)) {
            if (moveX > 0 && currentCardIndex > 0) {
                // Swipe right - go to previous card
                navigateToProjectCard(currentCardIndex - 1);
            } else if (moveX < 0 && currentCardIndex < projectCards.length - 1) {
                // Swipe left - go to next card
                navigateToProjectCard(currentCardIndex + 1);
            }
        } else if (Math.abs(moveX) < 30 && Math.abs(moveY) < 30) {
            // It's a tap/click - handle normally
            handleProjectCardClick(projectCards[currentCardIndex]);
        }
        
        // Reset values
        startX = null;
        startY = null;
    }

    // Add hover/touch effect on stack to spread cards
    if ('ontouchstart' in window) {
        projectsStack.addEventListener('touchstart', handleStackTouchStart);
    } else {
        projectsStack.addEventListener('mouseenter', () => {
            if (!activeCard && !isMobile) {
                spreadCards();
            }
        });

        projectsStack.addEventListener('mouseleave', () => {
            if (!activeCard && !isMobile) {
                resetCards();
            }
        });
    }

    function handleStackTouchStart(e) {
        if (!activeCard && isMobile && !isSpread) {
            spreadCards();
            
            // Auto-collapse after a delay if no interaction
            setTimeout(() => {
                if (isSpread && !activeCard) {
                    resetCards(true);
                }
            }, 3000);
        }
    }

    // Handle click/touch to bring card forward
    projectCards.forEach(card => {
        const handleInteraction = (e) => {
            if (e.target.closest('.project-link')) return;
            e.stopPropagation();
            handleProjectCardClick(card);
        };

        card.addEventListener('click', handleInteraction);
        card.addEventListener('touchend', (e) => {
            if (e.target.closest('.project-link')) return;
            if (Math.abs(moveX) < 30 && Math.abs(moveY) < 30) {
                e.preventDefault();
                handleInteraction(e);
            }
        });
    });

    function spreadCards() {
        isSpread = true;
        projectsStack.classList.add('is-spread');
        
        projectCards.forEach((card, index) => {
            if (isMobile) {
                // On mobile, spread cards vertically with more spacing and clearer separation
                const spreadY = index * 60; // Increased vertical spacing
                card.style.transform = `
                    translate(0%, ${spreadY}px)
                    rotate(0deg)
                `;
                // Add subtle scale effect for better depth perception
                card.style.scale = 1 - (index * 0.03);
            } else {
                // Desktop spread animation
                const spreadAngle = -20 + (index * 20);
                const spreadX = -30 + (index * 30);
                
                card.style.transform = `
                    translate(${spreadX}%, -5%)
                    rotate(${spreadAngle}deg)
                `;
            }
            // Ensure proper z-index
            card.style.zIndex = projectCards.length - index;
        });
    }

    function resetCards(forceMobile = false) {
        isSpread = false;
        projectsStack.classList.remove('is-spread');
        projectsStack.classList.remove('has-active-card');
        
        projectCards.forEach((card, index) => {
            if (isMobile || forceMobile) {
                // Stack cards with more visible offset on mobile
                const translateY = index * 10;
                card.style.transform = `translate(0%, ${translateY}%) rotate(0deg)`;
                
                // Apply subtle scale for depth
                if (index !== currentCardIndex) {
                    card.style.scale = 1 - (index * 0.03);
                } else {
                    card.style.scale = 1;
                }
            } else {
                // Desktop stacked position
                const translateX = [-2, 0, 2][index];
                const translateY = [-2, 0, 2][index];
                const rotate = [-1, 0, 1][index];
                card.style.transform = `translate(${translateX}%, ${translateY}%) rotate(${rotate}deg)`;
                card.style.scale = 1;
            }
            
            // Ensure current card is visible
            if (index === currentCardIndex) {
                card.style.zIndex = projectCards.length + 1;
                card.style.opacity = 1;
            } else {
                card.style.zIndex = projectCards.length - Math.abs(index - currentCardIndex);
                card.style.opacity = 1 - (Math.min(Math.abs(index - currentCardIndex), 3) * 0.2);
            }
        });
        
        activeCard = null;
    }

    function handleProjectCardClick(clickedCard) {
        const clickedIndex = Array.from(projectCards).indexOf(clickedCard);
        
        // Update current index for mobile navigation
        currentCardIndex = clickedIndex;
        
        // Update pagination dots if on mobile
        if (isMobile) {
            const dots = document.querySelectorAll('.card-pagination-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === clickedIndex);
            });
        }
        
        if (clickedCard === activeCard) {
            activeCard = null;
            projectsStack.classList.remove('has-active-card');
            resetCards(isMobile);
        } else {
            activeCard = clickedCard;
            projectsStack.classList.add('has-active-card');
            
            projectCards.forEach((card) => {
                if (card === clickedCard) {
                    if (isMobile) {
                        card.style.transform = 'translate(0%, 0%) scale(1.05)';
                    } else {
                        card.style.transform = 'translate(0%, -15%) rotate(0deg) scale(1.1)';
                    }
                    card.style.zIndex = 100;
                } else {
                    if (isMobile) {
                        // Move other cards down on mobile
                        const offset = Array.from(projectCards).indexOf(card) > clickedIndex ? 120 : -60;
                        card.style.transform = `translate(0%, ${offset}%)`;
                    } else {
                        // Desktop spread
                        const isLeft = Array.from(projectCards).indexOf(card) < clickedIndex;
                        const xOffset = isLeft ? -40 : 40;
                        const rotation = isLeft ? -15 : 15;
                        card.style.transform = `translate(${xOffset}%, 5%) rotate(${rotation}deg)`;
                    }
                    card.style.zIndex = 1;
                }
            });
        }
    }

    // Handle clicks outside the stack
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.projects-stack') && activeCard) {
            resetCards(isMobile);
        }
    });

    // Handle touch events outside the stack
    document.addEventListener('touchend', (e) => {
        if (!e.target.closest('.projects-stack') && activeCard) {
            resetCards(isMobile);
        }
    });
    
    // Create pagination dots for mobile
    createPaginationDots();
});
