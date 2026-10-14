/**
 * Reveals elements with the class 'reveal-pop' when they enter the viewport.
 * Uses IntersectionObserver if available, otherwise reveals all elements immediately.
 * @author Danielle Mutuc
 */
export function initRevealPop(): void {
    const pops: Element[] = Array.from(document.querySelectorAll('.reveal-pop'));
    if (!('IntersectionObserver' in window)) {
        pops.forEach((el: Element): void =>
            el.classList.add('in-view'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    pops.forEach((el: Element): void => observer.observe(el));
}