/**
 * Highlights the link in the sticky nav for the section currently in view.
 * Also scrolls the nav sideways so the active pill stays in view.
 * @author Danielle Mutuc
 */
export function initStickyNav(): void {
    const navElement = document.getElementById("stickyNav");

    if (!(navElement instanceof HTMLElement)) {
        return;
    }

    const nav: HTMLElement = navElement;
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));

    const sections = links
        .map((link): HTMLElement | null => {
            const href = link.getAttribute("href") ?? "";

            if (!href.startsWith("#") || href === "#") {
                return null;
            }

            return document.getElementById(href.slice(1));
        })
        .filter((section): section is HTMLElement => section !== null);

    function setActive(id: string): void {
        links.forEach((link) => {
            const href = link.getAttribute("href") ?? "";
            const isActive = href === `#${id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                nav.scrollTo({
                    left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2,
                    behavior: "smooth"
                });
            }
        });
    }

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
}