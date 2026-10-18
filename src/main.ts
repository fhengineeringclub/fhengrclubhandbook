import {initRevealPop} from "./ts/scroll-reveal";
import {initStickyNav} from "./ts/sticky-nav";
import {loadClubData} from "./ts/data-loader";
import {initFlyby} from "./ts/flyby";
import {initProjectsCarousel} from "./ts/projects-carousel";


document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
    await loadClubData();
    initProjectsCarousel();
    initStickyNav();
    initRevealPop();
    //initFlyby();
});