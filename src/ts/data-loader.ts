import {ClubInfo, EventsData, OfficersData, ProjectsData} from "./types";


export async function fetchJson<T>(url: URL): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load ${url.pathname}: ${response.status} ${response.statusText}`);
    }

    return await response.json() as Promise<T>;
}

export async function loadClubData(): Promise<void> {
    try {
        // Fetch all JSON files concurrently
        const [info, officersData, projectsData, eventsData] = await Promise.all([
            fetchJson<ClubInfo>(new URL("../data/info.json", import.meta.url)),
            fetchJson<OfficersData>(new URL("../data/officers.json", import.meta.url)),
            fetchJson<ProjectsData>(new URL("../data/projects.json", import.meta.url)),
            fetchJson<EventsData>(new URL("../data/events.json", import.meta.url))
        ]);

        // 1. Populate Info & Links
        document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach(el => {
            el.href = `mailto:${info.links.email}`;
            el.querySelector<HTMLElement>('.value')?.replaceChildren(info.links.email);
        });

        // Update Discord links
        document.querySelectorAll<HTMLAnchorElement>('a[href*="discord.gg"]').forEach(el => {
            el.href = info.links.discord;
            el.querySelector<HTMLElement>('.value')?.replaceChildren(info.links.discord.replace('https://', ''));
        });

        // Update Instagram links
        document.querySelectorAll<HTMLAnchorElement>('a[href*="instagram.com"]').forEach(el => {
            el.href = info.links.instagram;
            el.querySelector<HTMLElement>('.value')?.replaceChildren(info.links.instagram.replace('https://', ''));
        });

        // Update Linktree links
        document.querySelectorAll<HTMLAnchorElement>('a[href*="linktr.ee"]').forEach(el => {
            el.href = info.links.linktree;
            el.querySelector<HTMLElement>('.value')?.replaceChildren(info.links.linktree.replace('https://', ''));
        });

        // Update Meeting Location & Time
        document.querySelectorAll<HTMLElement>('#contact .callout p, .meeting-details')
            .forEach(el => el.textContent = `${info.room}, ${info.schedule}`);

        // 2. Populate Projects Grid
        const projGrid = document.querySelector('.proj-grid');
        if (projGrid) {
            projGrid.innerHTML = Object.entries(projectsData.projects).map(([title, project]) => `
        <div class="proj">
          <img src="${project.image}" alt="${title}" loading="lazy">
          <div><h3>${title}</h3><p>${project.desc}</p></div>
        </div>
      `).join('');
        }

        const rcPlaneImage = document.querySelector<HTMLImageElement>('.rc-plane-image');
        const rcPlane = projectsData.projects['RC Plane'];
        if (rcPlaneImage && rcPlane) {
            rcPlaneImage.src = rcPlane.image;
        }

        // 3. Populate Events Timeline
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.innerHTML = eventsData.events.map(e => `
        <div class="tl-row"><span class="what">${e.what}</span><span class="when">${e.when}</span></div>
      `).join('');
        }

        // 4. Populate Officers
        const officersContainer = document.querySelector('.officers');
        if (officersContainer) {
            // Add faculty advisors callout inside or right after
            officersContainer.innerHTML = officersData.officers.map(o => `
        <div class="officer-card">
          <p class="role-name">${o.role}</p>
          <p class="people">${o.people.join('<br>')}</p>
        </div>
      `).join('');

            const advisorBox = document.querySelector('#officers .advisors');
            if (advisorBox) {
                advisorBox.innerHTML = `
          <p class="eyebrow light">Faculty Advisors</p>
          <p>${officersData.advisors.join(' &nbsp;&bull;&nbsp; ')}</p>
        `;
            }
        }

    } catch (error) {
        console.error('Failed to load club data:', error);
    }
}
