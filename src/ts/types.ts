export interface ClubInfo {
    room: string;
    schedule: string;
    links: {
        email: string;
        discord: string;
        instagram: string;
        linktree: string;
    };
}

export interface OfficersData {
    officers: Array<{
        role: string;
        people: string[];
    }>;
    advisors: string[];
}

export interface ProjectsData {
    projects: Array<{
        image: string;
        title: string;
        desc: string;
    }>;
}

export interface EventsData {
    events: Array<{
        what: string;
        when: string;
    }>;
}