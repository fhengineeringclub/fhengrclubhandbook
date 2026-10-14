/**
 * Initializes the flyby effect, where a plane or fish flies across the screen when the user clicks anywhere on the page.
 * The effect is limited to once every 15 seconds and respects the user's reduced motion preference.
 * @author Danielle Mutuc
 */
export function initFlyby(): void {
    //no clue what this is for but ok -hayden
    const PLANE_IMG = '/images/plane-flyby.png';
    const FISH_IMG = '/images/fish-swim.png';
    const COOLDOWN_MS = 15000;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let lastRun = 0;
    document.addEventListener('click', e => {
        if (
            e.target instanceof HTMLElement &&
            e.target.closest('a, button, summary, .to-top')
        ) return;
        const now: number = Date.now();
        if (now - lastRun < COOLDOWN_MS) return;
        lastRun = now;

        const isPlane: boolean = Math.random() < 0.5;
        const el: HTMLImageElement = document.createElement('img');
        el.alt = '';
        el.setAttribute('aria-hidden', 'true');
        el.src = isPlane ? PLANE_IMG : FISH_IMG;
        el.className = isPlane ? 'plane-fly' : 'fish-swim';
        document.body.appendChild(el);
        el.addEventListener('animationend', (): void => el.remove());
    });
}