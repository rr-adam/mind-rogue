const heroPortraits = document.querySelectorAll('.hero');
const seedInput = document.getElementById('seed-input');
const seedRandomBtn = document.getElementById('generate-random-seed');
const startGame = document.getElementById('startBtn');
let selected = 'legion';

const clearSelection = () => {
    for(const hero of heroPortraits) {
        hero.classList.remove('selected');
    }
}

const generateRandomSeed = () => {
    const number = Math.random();
    const rand = xmur3(number.toString());
    return rand();
}

const xmur3 = (str) => {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

seedInput.value = generateRandomSeed();


for(const hero of heroPortraits) {
    hero.addEventListener('click', ()=>{
        clearSelection();
        hero.classList.add('selected');
        selected = hero.id;
    });
}

seedRandomBtn.addEventListener('click', ()=>{
    seedInput.value = generateRandomSeed();
});

startGame.addEventListener('click', ()=>{
    if(seedInput.value.length > 0) {
        localStorage.setItem('selectedClass', selected);
        localStorage.setItem('seed', +seedInput.value);
        window.location.href = 'gameplay.html';
    } else {
        alert('Seed input invalid');
    }
    
});





