import {initRevealPop} from "./ts/scroll-reveal";
import {initStickyNav} from "./ts/sticky-nav";
import {loadClubData} from "./ts/data-loader";
import {initFlyby} from "./ts/flyby";


document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
    await loadClubData();
    initStickyNav();
    initRevealPop();
    //initFlyby();
});