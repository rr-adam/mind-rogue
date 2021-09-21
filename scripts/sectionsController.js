const heroSection = document.getElementById('hero-section');
const dungeonSection = document.getElementById('dungeon-section');
const menuSection = document.getElementById('menu-section');

const sectionClearSelectedClass = () => {
    const sections = [heroSection, dungeonSection, menuSection];
    for(const section of sections) {
        section.classList.remove('selected');
    }
}

const selectSection = section => {
    section = section.toUpperCase();

    sectionClearSelectedClass();

    switch(section) {
        case 'HERO':
            heroSection.classList.add('selected');
            break;
        case 'DUNGEON':
            dungeonSection.classList.add('selected');
            break;
        case 'MENU':
            menuSection.classList.add('selected');
            break;
    }
}