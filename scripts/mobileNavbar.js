const heroMobBtn = document.getElementById('mob-bottom-nav-hero');
const dungeonMobBtn = document.getElementById('mob-bottom-nav-dungeon');
const menuMobBtn = document.getElementById('mob-bottom-nav-menu');

const mobBtnClearSelected = () => {
    const mobButtons = [heroMobBtn, dungeonMobBtn, menuMobBtn];
    for (const btn of mobButtons) {
        btn.classList.remove('selected');
    }
}

const  mobBtnHandler = (btnElement, selection) => {
    mobBtnClearSelected();

    //selectionsController.js
    selectSection(selection);
    btnElement.classList.add('selected');
}

heroMobBtn.addEventListener('click', mobBtnHandler.bind(null, heroMobBtn, 'HERO'));
dungeonMobBtn.addEventListener('click', mobBtnHandler.bind(null, dungeonMobBtn, 'DUNGEON'));
menuMobBtn.addEventListener('click', mobBtnHandler.bind(null, menuMobBtn, 'MENU'));

