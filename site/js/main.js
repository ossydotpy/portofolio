document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Timeline Logic --- 
    const timelineItems = document.querySelectorAll('.timeline-item');
    const prevTimelineButton = document.querySelector('.timeline-nav.prev');
    const nextTimelineButton = document.querySelector('.timeline-nav.next');
    let currentTimelineIndex = 0;
    let isTimelineAnimating = false;

    function initializeTimelineCards() {
        if (!timelineItems.length) return; // Exit if no timeline items
        timelineItems.forEach((item, index) => {
            item.style.transform = `translateY(${index * 20}px) scale(${1 - index * 0.05})`;
            item.style.opacity = 1 - (index * 0.2);
            item.style.zIndex = timelineItems.length - index; // Ensure correct stacking order
        });
        timelineItems[0].classList.add('active');
        updateTimelineNavigationButtons();
    }

    function navigateTimelineToCard(targetIndex) {
        if (isTimelineAnimating || targetIndex === currentTimelineIndex || !timelineItems.length) return;
        
        isTimelineAnimating = true;
        const direction = targetIndex > currentTimelineIndex ? 'forward' : 'backward';
        
        timelineItems.forEach((item, index) => {
            item.classList.remove('active');
            const offset = index - targetIndex;
            const translateY = offset * 20;
            const scale = 1 - Math.abs(offset * 0.05);
            const opacity = Math.max(0, 1 - Math.abs(offset * 0.2));
            const zIndex = timelineItems.length - Math.abs(offset);

            let transform = `translateY(${translateY}px) scale(${scale})`;
            let finalOpacity = opacity;

            // Animate out the card that was previously active
            if (index === currentTimelineIndex) {
                transform = direction === 'forward' 
                    ? `translateX(-100%) translateY(${translateY}px) scale(0.8)` 
                    : `translateX(100%) translateY(${translateY}px) scale(0.8)`;
                finalOpacity = 0;
            }
            // Animate in the new active card
            else if (index === targetIndex) {
                 transform = `translateY(0px) scale(1)`;
                 finalOpacity = 1;
            }
            // Position other cards
            else {
                 transform = `translateY(${translateY}px) scale(${scale})`;
                 finalOpacity = opacity;
            }

            item.style.transform = transform;
            item.style.opacity = finalOpacity;
            item.style.zIndex = zIndex;
        });

        timelineItems[targetIndex].classList.add('active');
        currentTimelineIndex = targetIndex;
        updateTimelineNavigationButtons();

        setTimeout(() => {
            isTimelineAnimating = false;
            // Re-apply final styles without transition for stability
            timelineItems.forEach((item, index) => {
                 const offset = index - currentTimelineIndex;
                 item.style.transition = 'none'; // Temporarily disable transition
                 item.style.transform = `translateY(${offset * 20}px) scale(${1 - Math.abs(offset * 0.05)})`;
                 item.style.opacity = Math.max(0, 1 - Math.abs(offset * 0.2));
                 item.style.zIndex = timelineItems.length - Math.abs(offset);
                 if(index === currentTimelineIndex) {
                    item.style.transform = 'translateY(0px) scale(1)';
                    item.style.opacity = 1;
                    item.style.zIndex = timelineItems.length + 1;
                 }
                 // Force reflow to apply styles immediately
                 void item.offsetWidth;
                 item.style.transition = ''; // Re-enable transitions
            });
             timelineItems[currentTimelineIndex].classList.add('active');

        }, 600); // Match CSS transition duration
    }

    function updateTimelineNavigationButtons() {
        if (!prevTimelineButton || !nextTimelineButton) return;
        prevTimelineButton.disabled = currentTimelineIndex === 0;
        nextTimelineButton.disabled = currentTimelineIndex === timelineItems.length - 1;
    }

    if (prevTimelineButton && nextTimelineButton) {
        prevTimelineButton.addEventListener('click', () => {
            if (currentTimelineIndex > 0) {
                navigateTimelineToCard(currentTimelineIndex - 1);
            }
        });

        nextTimelineButton.addEventListener('click', () => {
            if (currentTimelineIndex < timelineItems.length - 1) {
                navigateTimelineToCard(currentTimelineIndex + 1);
            }
        });
    }

    // Initialize Timeline
    initializeTimelineCards();

    // --- NEW Project Timeline Logic (Adapted from old project stack logic) ---
    const projectTimeline = document.querySelector('.project-timeline'); // Container
    const projectTimelineItemsContainer = projectTimeline?.querySelector('.project-timeline-items');
    const prevProjectTimelineBtn = projectTimeline?.querySelector('.project-timeline-nav.prev');
    const nextProjectTimelineBtn = projectTimeline?.querySelector('.project-timeline-nav.next');
    let projectTimelineItems = projectTimelineItemsContainer?.querySelectorAll('.project-timeline-item');
    let currentProjectIndex = 0;
    let isProjectTimelineAnimating = false;

    function initializeProjectCards() {
        if (!projectTimelineItems || projectTimelineItems.length === 0) return; // Exit if no project items
        projectTimelineItems.forEach((item, index) => {
            applyProjectCardStyle(item, index, projectTimelineItems.length);
            item.style.transition = 'none'; // Apply initial styles without animation
        });
        // Force reflow
        if (projectTimelineItemsContainer) void projectTimelineItemsContainer.offsetWidth;
        // Re-enable transitions
        projectTimelineItems.forEach(item => item.style.transition = '');

        if (projectTimelineItems[0]) projectTimelineItems[0].classList.add('active');
        updateProjectNavigationButtons();
    }

    function cycleProjectCards(direction) {
        if (isProjectTimelineAnimating || !projectTimelineItems || projectTimelineItems.length < 2) {
            isProjectTimelineAnimating = false; 
            return;
        }
        isProjectTimelineAnimating = true;

        const cards = Array.from(projectTimelineItems);
        const transitionDuration = 600; // ms, match CSS
        const currentCard = cards[currentProjectIndex];
        let targetIndex;

        // Determine target index
        if (direction === 'next') {
            targetIndex = (currentProjectIndex + 1) % cards.length;
        } else { // direction === 'prev'
            targetIndex = (currentProjectIndex - 1 + cards.length) % cards.length;
        }
        const targetCard = cards[targetIndex];

        // 1. Animate the current card flying off
        currentCard.style.transition = `all ${transitionDuration / 1000}s cubic-bezier(0.4, 0.0, 0.2, 1)`;
        if (direction === 'next') {
            currentCard.style.transform = `translateX(100%) translateY(20px) rotate(10deg) scale(0.8)`;
        } else {
            currentCard.style.transform = `translateX(-100%) translateY(20px) rotate(-10deg) scale(0.8)`;
        }
        currentCard.style.opacity = '0';
        currentCard.classList.remove('active');

        // 2. Prepare and animate the target card and others
        cards.forEach((card, index) => {
            // Skip the card that is flying off
            if (index === currentProjectIndex) return;

            const offset = (index - targetIndex + cards.length) % cards.length;
            
            // Ensure transition is set for all moving cards
            card.style.transition = `all ${transitionDuration / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`;

            // Apply the final style for the target position
            applyProjectCardStyle(card, offset, cards.length);

            if (index === targetIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        currentProjectIndex = targetIndex;
        updateProjectNavigationButtons();

        // Reset animation flag after transition
        setTimeout(() => {
            isProjectTimelineAnimating = false;
            // Optional: Stabilize final positions without transition
            projectTimelineItems?.forEach((item, index) => {
                 const offset = (index - currentProjectIndex + cards.length) % cards.length;
                 item.style.transition = 'none'; 
                 // Re-apply the style calculated by applyProjectCardStyle
                 const translateY = offset * 20;
                 const scale = Math.max(0, 1 - (offset * 0.05));
                 const opacity = Math.max(0, 1 - (offset * 0.2));
                 const zIndex = cards.length - offset;
                 let transform = `translateY(${translateY}px) scale(${scale})`;
                 let finalOpacity = opacity;
                 if (offset === 0) {
                     transform = `translateY(0px) scale(1)`;
                     finalOpacity = 1;
                 }
                 // Ensure the card that flew off is properly hidden and reset
                 if (item === currentCard && index !== currentProjectIndex) { 
                     // It might have been reset by the loop, ensure it's out
                     // Or reset its position if it's needed back in the stack later
                     // For simplicity, let's just ensure its final state is correct based on its *new* offset
                 }

                 item.style.transform = transform;
                 item.style.opacity = finalOpacity;
                 item.style.zIndex = zIndex;
                 
                 void item.offsetWidth; // Force reflow
                 item.style.transition = ''; // Re-enable transitions
            });
            if(projectTimelineItems && projectTimelineItems[currentProjectIndex]) {
                projectTimelineItems[currentProjectIndex].classList.add('active');
            }
        }, transitionDuration);
    }

    // Helper function to apply styles based on index relative to the active card
    function applyProjectCardStyle(card, offset, totalCards) {
        const translateY = offset * 20; // Vertical offset for stacking
        const scale = Math.max(0, 1 - (offset * 0.05)); // Scale down further cards
        const opacity = Math.max(0, 1 - (offset * 0.2)); // Fade out further cards
        const zIndex = totalCards - offset; // Active card has highest z-index

        let transform = `translateY(${translateY}px) scale(${scale})`;
        let finalOpacity = opacity;

        if (offset === 0) { // Style for the active card
            transform = `translateY(0px) scale(1)`;
            finalOpacity = 1;
        }

        card.style.transform = transform;
        card.style.opacity = finalOpacity;
        card.style.zIndex = zIndex;
    }

    function updateProjectNavigationButtons() {
        if (!prevProjectTimelineBtn || !nextProjectTimelineBtn || !projectTimelineItems || projectTimelineItems.length <= 1) {
             if(prevProjectTimelineBtn) prevProjectTimelineBtn.style.display = 'none';
             if(nextProjectTimelineBtn) nextProjectTimelineBtn.style.display = 'none';
            return; // No navigation needed for 0 or 1 card
        }
         if(prevProjectTimelineBtn) prevProjectTimelineBtn.style.display = 'flex';
         if(nextProjectTimelineBtn) nextProjectTimelineBtn.style.display = 'flex';
        // In a cycling setup, buttons are never truly disabled
        prevProjectTimelineBtn.disabled = false;
        nextProjectTimelineBtn.disabled = false;
    }

    // Navigation handlers for Project Timeline
    if (prevProjectTimelineBtn && nextProjectTimelineBtn) {
        prevProjectTimelineBtn.addEventListener('click', () => cycleProjectCards('prev'));
        nextProjectTimelineBtn.addEventListener('click', () => cycleProjectCards('next'));
    }

    // Initialize Project Cards
    initializeProjectCards();

    // Add keyboard navigation for both sections (optional, ensure focus management)
    document.addEventListener('keydown', (e) => {
        // Check if focus is within the timeline section
        if (document.activeElement && document.activeElement.closest('.timeline')) {
            if (e.key === 'ArrowLeft' && prevTimelineButton && !prevTimelineButton.disabled) {
                navigateTimelineToCard(currentTimelineIndex - 1);
            } else if (e.key === 'ArrowRight' && nextTimelineButton && !nextTimelineButton.disabled) {
                navigateTimelineToCard(currentTimelineIndex + 1);
            }
        }
        // Check if focus is within the project timeline section
        else if (document.activeElement && document.activeElement.closest('.project-timeline')) {
             if (e.key === 'ArrowLeft' && prevProjectTimelineBtn) {
                cycleProjectCards('prev');
            } else if (e.key === 'ArrowRight' && nextProjectTimelineBtn) {
                cycleProjectCards('next');
            }
        }
    });
});