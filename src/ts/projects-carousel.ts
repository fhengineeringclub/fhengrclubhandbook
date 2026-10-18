const BASE_SPEED = 0.035;
const MAX_SPEED = 1.8;
const DRAG_FRICTION = 0.94;
const RETURN_TO_BASE = 0.002;

/**
 * Initializes the projects carousel, allowing users to scroll through
 * project cards with mouse dragging or arrow buttons.
 * @author Hayden Honjo
 */
export function initProjectsCarousel(): void {
    const carousel = document.querySelector<HTMLElement>(".project-carousel");
    const track = carousel?.querySelector<HTMLElement>(".proj-grid");

    if (!carousel || !track) return;

    const originalCards = Array.from(track.querySelectorAll<HTMLElement>(".proj"));
    if (originalCards.length === 0) return;

    const prependClones = originalCards.map(card => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        return clone;
    });
    const appendClones = prependClones.map(card => card.cloneNode(true) as HTMLElement);
    prependClones.reverse().forEach(card => track.prepend(card));
    appendClones.forEach(card => track.append(card));

    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let velocity = BASE_SPEED;
    let cycleWidth = 0;
    let animationFrame = 0;
    let lastFrameTime = performance.now();
    let selectedCard: HTMLElement | null = null;

    const calculateCycleWidth = (): number => {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 0;
        return originalCards.reduce((total, card) => total + card.offsetWidth, 0)
            + gap * originalCards.length;
    };

    const normalizeScrollPosition = (): void => {
        if (track.scrollLeft < cycleWidth * 0.5) {
            track.scrollLeft += cycleWidth;
        } else if (track.scrollLeft > cycleWidth * 1.5) {
            track.scrollLeft -= cycleWidth;
        }
    };

    const updateCardDepth = (): void => {
        const center = track.scrollLeft + track.clientWidth / 2;
        track.querySelectorAll<HTMLElement>(".proj").forEach(card => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.min(Math.abs(center - cardCenter) / card.offsetWidth, 1);
            const direction = cardCenter < center ? -1 : 1;
            card.style.setProperty("--card-tilt", `${direction * distance * 7}deg`);
            card.style.setProperty("--card-depth", `${1 - distance * 0.12}`);
        });
    };

    const animate = (now: number): void => {
        const elapsed = Math.min(now - lastFrameTime, 50);
        lastFrameTime = now;

        if (!isDragging && !(selectedCard && selectedCard.matches(":hover"))) {
            const direction = velocity < 0 ? -1 : 1;
            const targetSpeed = direction * BASE_SPEED;
            if (Math.abs(velocity) > BASE_SPEED) {
                velocity *= Math.pow(DRAG_FRICTION, elapsed / 16.67);
                if (Math.abs(velocity) < BASE_SPEED) velocity = targetSpeed;
            } else {
                velocity += (targetSpeed - velocity) * Math.min(RETURN_TO_BASE * elapsed, 1);
            }
            track.scrollLeft += velocity * elapsed;
            normalizeScrollPosition();
            updateCardDepth();
        }

        animationFrame = requestAnimationFrame(animate);
    };

    const recalculate = (): void => {
        cycleWidth = calculateCycleWidth();
        track.scrollLeft = cycleWidth;
        updateCardDepth();
    };

    window.addEventListener("resize", recalculate);

    track.querySelectorAll<HTMLElement>(".proj").forEach(card => {
        card.addEventListener("click", () => {
            if (selectedCard && selectedCard !== card) {
                selectedCard.classList.remove("is-selected");
            }

            selectedCard = card;
            selectedCard.classList.add("is-selected");
            track.scrollTo({
                left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
                behavior: "instant"
            });
            normalizeScrollPosition();
            updateCardDepth();
        });

        card.addEventListener("pointerleave", () => {
            if (selectedCard !== card) return;
            card.classList.remove("is-selected");
            selectedCard = null;
        });
    });

    track.addEventListener("pointerdown", event => {
        isDragging = true;
        lastPointerX = event.clientX;
        lastPointerTime = event.timeStamp;
        track.setPointerCapture(event.pointerId);
        track.classList.add("is-dragging");
    });

    track.addEventListener("pointermove", event => {
        if (!isDragging) return;

        const deltaX = event.clientX - lastPointerX;
        const deltaTime = Math.max(event.timeStamp - lastPointerTime, 1);
        track.scrollLeft -= deltaX;
        velocity = Math.min(MAX_SPEED, Math.abs(deltaX / deltaTime));
        lastPointerX = event.clientX;
        lastPointerTime = event.timeStamp;
        normalizeScrollPosition();
        updateCardDepth();
    });

    const stopDragging = (event: PointerEvent): void => {
        if (!isDragging) return;
        isDragging = false;
        track.releasePointerCapture(event.pointerId);
        track.classList.remove("is-dragging");
        normalizeScrollPosition();
    };

    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);

    requestAnimationFrame(recalculate);
    animationFrame = requestAnimationFrame(animate);
    window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame), {once: true});
}
