class Item {
    rarity; //common, rare, legendary

    img; // number 2-26
    description; //dependent on image
    name; //dependent on image
    type;//dependent on image

    itemPower;

    potion = {
        type: 0,
        heal: 0,
    }

    stats = {
        maxhp: 0,
        armor: 0,
        evasion: 0,
        effectsImmunity: 0,

        baseDmg: 0,
        piercing: 0,
        critPower: 0,
        critChance: 0,

        burnDmg: 0,
        poisonDmg: 0,

        blindChance: 0,
        blindPower: 0,
        confusionChance: 0,
        confusionPower: 0,
        rootChance: 0,
        rootPower: 0,

        dropLevelBoost: 0,
        dropPowerBoost: 0
    }

    constructor(level, dropRNG, player) {
        if(dropRNG.rand()<0.19) {
            
            this.type = 'consumable';

            const potionType = parseInt(dropRNG.rand()*3);

            this.potion.type = potionType;
            if(potionType==0) {
                this.description = 'You see weird substance inside the bottle. It will heal you.';
                this.rarity = 'common';
            } else if(potionType==1) {
                this.description = 'It will clean you from all status effects.';
                this.rarity = 'rare';
            } else if(potionType==2) {
                this.description = 'It will fully heal you and clean status effects.';
                this.rarity = 'legendary';
            }
            
            this.img = parseInt(dropRNG.randMinMax(2,6));
            this.name = this.generateName(this.type, this.img, dropRNG);
            return;
        }

        const dropLevelBoost = player.stats.dropLevelBoost;
        const dropPowerBoost = player.stats.dropPowerBoost;

        level+=dropLevelBoost;
    
        const itemRarity = parseInt( dropRNG.randMinMax(0, 100));
        let itemPower = parseInt( dropRNG.randMinMax(2*level, 999*(level/100)))+dropPowerBoost;
        this.itemPower = itemPower;

        if (itemRarity < 80) {
            this.rarity = 'common';
            this.img = parseInt(dropRNG.randMinMax(2,15));
        } else if(itemRarity < 95) {
            this.rarity = 'rare';
            this.img = parseInt(dropRNG.randMinMax(15,22));
            itemPower+=parseInt(dropRNG.randMinMax(120*(level/100)/2, 120*(level/100)));
        } else {
            this.rarity = 'legendary';
            this.img = parseInt(dropRNG.randMinMax(23,26));
            itemPower+=parseInt(dropRNG.randMinMax(400*(level/100)/2, 400*(level/100)));
        }

        const typeRand = dropRNG.rand();

        if (typeRand < 0.25) {
            //weapon
            this.type = 'weapon';
            
            this.stats.baseDmg = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.piercing = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.critChance = parseInt(dropRNG.randMinMax(0, 1+itemPower/1000*15));
            this.stats.critPower = +((dropRNG.rand()*itemPower/1000*5)).toFixed(2);

            if(dropRNG.rand() > 0.7) {
                this.stats.blindChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.blindPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.confusionChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.confusionPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.rootChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.rootPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropLevelBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000, 1+itemPower/1000*8));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropPowerBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15, 1+itemPower/1000*150));
            }


        } else if (typeRand >= 0.25 && typeRand < 0.5) {
            //armor
            this.type = 'armor';

            this.stats.maxhp = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.armor = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.evasion = parseInt(dropRNG.randMinMax(itemPower/1000*15/2, 5+itemPower/1000*50));
            this.stats.effectsImmunity = parseInt(dropRNG.randMinMax(itemPower/1000*15/2, 1+itemPower/1000*50));

            if(dropRNG.rand() > 0.93) {
                this.stats.dropLevelBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000, 1+itemPower/1000*8));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropPowerBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15, 1+itemPower/1000*150));
            }
            
        } else if (typeRand >= 0.5 && typeRand < 0.75) {
            //talisman
            this.type = 'talisman';

            this.stats.maxhp = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.armor = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.evasion = parseInt(dropRNG.randMinMax(itemPower/1000*15/2, 5+itemPower/1000*50));
            this.stats.effectsImmunity = parseInt(dropRNG.randMinMax(itemPower/1000*15/2, 1+itemPower/1000*50));

            if(dropRNG.rand() > 0.7) {
                this.stats.blindChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.blindPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.confusionChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.confusionPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.rootChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.rootPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropLevelBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000, 1+itemPower/1000*8));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropPowerBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15, 1+itemPower/1000*150));
            }
            
        } else {
            //ring
            this.type = 'ring';

            this.stats.armor = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.evasion = parseInt(dropRNG.randMinMax(itemPower/1000*15/2, 5+itemPower/1000*50));
            this.stats.piercing = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.critChance = parseInt(dropRNG.randMinMax(0, 1+itemPower/1000*15));
            this.stats.critPower = +((dropRNG.rand()*itemPower/1000*5)).toFixed(2);

            if(dropRNG.rand() > 0.7) {
                this.stats.blindChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.blindPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.confusionChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.confusionPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.7) {
                this.stats.rootChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.rootPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*10));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropLevelBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000, 1+itemPower/1000*8));
            }

            if(dropRNG.rand() > 0.93) {
                this.stats.dropPowerBoost = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15, 1+itemPower/1000*150));
            }

        }


        this.name = this.generateName(this.type, this.img, dropRNG);
    }

    generateName(type, number, dropRNG) {
        const part1 = ['Great', 'Mighty', 'Magic', 'Enchanted', 'Overpowered', 'Powerful', 'Long', 'The longest', 'The best', 
        'Inspirational', 'Cursed', 'Blessed', 'Silver', 'Steel', 'Golden', 'Mythic', 'Greater', 'Small', 'Short', 'Scary', 'Respectable',
        'Shiny', 'Glowing', 'Sharp', 'Irrational', 'Magnificent'];
        let part2 = '';
        const part3 = ['of power', 'of magic', 'of legends', 'for warriors', 'of adventurer', 'created by ancients', 'of might', 'of dark magic',
        'forged in depths of ocean', 'forged by gnomes', 'of forest spirits', 'of the elder', 'of blood', 'of destiny', 'covered in blood',
        'of a beast', 'of orcs', 'of grand mage', 'put together by the Forger', 'forged by gods'];

        if (type == 'weapon') {
            switch(number){
                case 2:
                    part2 = 'spikes';
                    break;
                case 3:
                    part2 = 'mace';
                    break;
                case 4:
                    part2 = 'wand';
                    break;
                case 5: case 12: case 13: case 17:
                    part2 = 'bow';
                    break;
                case 6:
                    part2 = 'claws';
                    break;
                case 7: case 25:
                    part2 = 'axe';
                    break;
                case 8: case 20: case 21:
                    part2 = 'staff';
                    break;
                case 9: case 14: case 15: case 22: case 24:
                    part2 = 'sword';
                    break;
                case 10: case 16:
                    part2 = 'dagger';
                    break;
                case 11:
                    part2 = 'shurikens';
                    break;
                case 18:
                    part2 = 'crossbow';
                    break;
                case 19:
                    part2 = 'hammer';
                    break;
                case 23:
                    part2 = 'pistol';
                    break;
                case 25:
                    part2 = 'heart orb';
                    break;
            }
        }
        if (type == 'armor') {
            part2 = 'armor';
        }
        if (type == 'talisman') {
            part2 = 'talisman';
        }
        if (type == 'ring') {
            part2 = 'ring';
        }
        if (type == 'consumable') {
            part2 = 'potion';
        }

        return part1[parseInt(dropRNG.rand()*part1.length)]+' '+part2+' '+part3[parseInt(dropRNG.rand()*part3.length)];
    }
}

class Entity {
    type;
    behavior;

    name;
    posX;
    posY;

    className;

    stats = {
        hp: 10,
        maxhp: 10,
        armor: 1,
        evasion: 0,
        effectsImmunity: 0,

        baseDmg: 1,
        
        piercing: 1,
        critPower: 1.5,
        critChance: 2,

        burnDmg: 0,
        poisonDmg: 0,

        blindChance: 0,
        blindPower: 0,
        confusionChance: 0,
        confusionPower: 0,
        rootChance: 0,
        rootPower: 0,

        dropLevelBoost: 0,
        dropPowerBoost: 0
    };

    effects = {
        burn: 0, // applies temporary armor reduction
        poison: 0, // take direct health damage
        rooted: 0, // cant move : max 10
        blind: 0, // high miss chance  : max 80
        confusion: 0, // doesnt follow player : max 5
    };

    takeDamage(attacker, textQueue) {
        //return -1 if evaded
        //returns damage if took damage
        const textPosX = this.posX;
        const textPosY = this.posY;
        let crit = 1;

        if(Math.random()*100 < attacker.stats.critChance) {
            crit = attacker.stats.critPower;
        } 

        if (Math.random()*100 < this.stats.evasion+attacker.effects.blind) {
            
            textQueue.push({
                damage: 0,
                type: 'evade',
                posX: textPosX,
                posY: textPosY
            });

            return -1;
        }

        const damage = Math.max(0, parseInt((attacker.stats.baseDmg - Math.max(0,(this.stats.armor-attacker.stats.piercing - this.effects.burn)))*crit));
        this.stats.hp -= damage;

        //apply status effects

        //blind
        if (Math.random()*100 < attacker.stats.blindChance) {
            const blind = Math.max(0, attacker.stats.blindPower - this.stats.effectsImmunity);
            this.effects.blind += blind;
            textQueue.push({
                damage: blind,
                type: 'blind',
                posX: textPosX,
                posY: textPosY
            });
        }

        //confusion
        if (Math.random()*100 < attacker.stats.confusionChance) {
            const confusion = Math.max(0, attacker.stats.confusionPower - this.stats.effectsImmunity);
            this.effects.confusion += confusion;
            textQueue.push({
                damage: confusion,
                type: 'confusion',
                posX: textPosX,
                posY: textPosY
            });
        }

        this.effects.burn += Math.max(0, attacker.stats.burnDmg - this.stats.effectsImmunity);
        this.effects.poison += Math.max(0, attacker.stats.poisonDmg- this.stats.effectsImmunity);

        if(damage>0) {
            textQueue.push({
            damage: damage,
            type: 'damage',
            posX: textPosX,
            posY: textPosY
            });
            return damage;
        } else {
            textQueue.push({
                damage: damage,
                type: 'block',
                posX: textPosX,
                posY: textPosY
            });
            return damage;
        }
        
    }


}

class Player extends Entity {
    inventory = [];
    inventorySize = 20;
    gold = 0;
    class = 'thief';
    
    eqWeapon = -1;
    eqArmor = -1;
    eqTalisman = -1;
    eqRing = -1;

    classSetup() {
        const heroPortraitElement = document.getElementById('hero-portrait').querySelector('img');
        document.getElementById('profile-class').innerText = `class: ${this.class}`;
        document.getElementById('profile-name').innerText = `name: ${this.name}`;
        if(this.class == 'legion') {
            heroPortraitElement.src = 'graphics/heroes/hero7.png';
            this.stats.hp = 30;
            this.stats.maxhp = 30;
            this.stats.baseDmg = 3;
            this.stats.effectsImmunity = 2;
            this.stats.armor = 5;
            this.stats.piercing = 5;
            this.stats.critChance = 2;
            this.stats.critPower = 1.3;
        }
        if(this.class == 'focus') {
            heroPortraitElement.src = 'graphics/heroes/hero6.png';
            this.stats.hp = 20;
            this.stats.maxhp = 20;
            this.stats.effectsImmunity = 2;
            this.stats.baseDmg = 2;
            this.stats.armor = 3;
            this.stats.piercing = 6;
            this.stats.blindChance = 5;
            this.stats.blindPower = 4;
            this.stats.critChance = 3;
            this.stats.critPower = 1.4;
        }
        if(this.class == 'monk') {
            heroPortraitElement.src = 'graphics/heroes/hero5.png';
            this.stats.hp = 10;
            this.stats.maxhp = 10;
            this.stats.baseDmg = 2;
            this.stats.effectsImmunity = 5;
            this.stats.armor = 6;
            this.stats.piercing = 5;
            this.stats.rootChance = 10;
            this.stats.rootPower = 3;
            this.stats.confusionChance = 5;
            this.stats.confusionPower = 2;
        }
        if(this.class == 'thief') {
            heroPortraitElement.src = 'graphics/heroes/hero4.png';
            this.stats.hp = 20;
            this.stats.maxhp = 20;
            this.stats.evasion = 5;
            this.stats.effectsImmunity = 2;
            this.stats.armor = 2;
            this.stats.poisonDmg = 3;
            this.stats.blindChance = 15;
            this.stats.blindPower = 5;
        }
        if(this.class == 'mage') {
            heroPortraitElement.src = 'graphics/heroes/hero3.png';
            this.stats.hp = 15;
            this.stats.maxhp = 15;
            this.stats.effectsImmunity = 4;
            this.stats.armor = 2;
            this.stats.burnDmg = 2;
            this.stats.blindChance = 5;
            this.stats.blindPower = 4;
        }
        if(this.class == 'king') {
            heroPortraitElement.src = 'graphics/heroes/hero2.png';
            this.stats.hp = 45;
            this.stats.maxhp = 45;
            this.stats.effectsImmunity = 3;
            this.stats.piercing = 3;
            this.stats.critChance = 2;
            this.stats.critPower = 1.7;
        }
        if(this.class == 'berserk') {
            heroPortraitElement.src = 'graphics/heroes/hero1.png';
            this.stats.evasion = 5;
            this.stats.baseDmg = 4;
            this.stats.effectsImmunity = 2;
            this.stats.hp = 25;
            this.stats.maxhp = 25;
            this.stats.critChance = 10;
            this.stats.critPower = 1.1;
        }
    }

    inspectItem(item, action) {
        const inspectElement = document.getElementById('inspect-item');
        
        inspectElement.querySelector('.item-image').style.backgroundImage=`url(../graphics/items/${item.type}/${item.type}${item.img}.png)`;
        inspectElement.querySelector('.item-image').className = `item-image rarity-${item.rarity}`;

        inspectElement.querySelector('.item-name').innerText=item.name;
        inspectElement.querySelector('.item-type').innerText=item.type;
        inspectElement.querySelector('.item-rarity').innerText=item.rarity;
        inspectElement.querySelector('.item-description').innerText=item.description;

        const statElement = inspectElement.querySelector('.item-stats');
        statElement.innerHTML='';

        if(item.stats.armor>0) {
            statElement.innerHTML += `<p>ARMOR: ${item.stats.armor} (${this.comparisonString(item.type, 'armor', item.stats.armor)})</p>`;
        }
        if(item.stats.evasion>0) {
            statElement.innerHTML += `<p>EVASION: ${item.stats.evasion} (${this.comparisonString(item.type, 'evasion', item.stats.evasion)})</p>`;
        }
        if(item.stats.piercing>0) {
            statElement.innerHTML += `<p>PIERCING: ${item.stats.piercing} (${this.comparisonString(item.type, 'piercing', item.stats.piercing)})</p>`;
        }
        statElement.innerHTML += '<br>';
        if(item.stats.baseDmg>0) {
            statElement.innerHTML += `<p>BASE DAMAGE: ${item.stats.baseDmg} (${this.comparisonString(item.type, 'baseDmg', item.stats.baseDmg)})</p>`;
        }
        if(item.stats.critChance>0) {
            statElement.innerHTML += `<p>CRIT CHANCE: ${item.stats.critChance} (${this.comparisonString(item.type, 'critChance', item.stats.critChance)})</p>`;
        }
        if(item.stats.critPower>0) {
            statElement.innerHTML += `<p>CRIT POWER: ${item.stats.critPower} (${this.comparisonString(item.type, 'critPower', item.stats.critPower)})</p>`;
        }
        statElement.innerHTML += '<br>';
        if(item.stats.burnDmg>0) {
            statElement.innerHTML += `<p>BURN DAMAGE: ${item.stats.burnDmg} (${this.comparisonString(item.type, 'burnDmg', item.stats.burnDmg)})</p>`;
        }
        if(item.stats.poisonDmg>0) {
            statElement.innerHTML += `<p>POISON DAMAGE: ${item.stats.poisonDmg} (${this.comparisonString(item.type, 'poisonDmg', item.stats.poisonDmg)})</p>`;
        }
        statElement.innerHTML += '<br>';
        if(item.stats.blindChance>0 && item.stats.blindPower>0) {
            statElement.innerHTML += `<p>BLIND CHANCE: ${item.stats.blindChance} (${this.comparisonString(item.type, 'blindChance', item.stats.blindChance)})</p>`;
            statElement.innerHTML += `<p>BLIND POWER: ${item.stats.blindPower} (${this.comparisonString(item.type, 'blindPower', item.stats.blindPower)})</p>`;
        }
        if(item.stats.confusionChance>0 && item.stats.confusionPower>0) {
            statElement.innerHTML += `<p>CONFUSION CHANCE: ${item.stats.confusionChance} (${this.comparisonString(item.type, 'confusionChance', item.stats.confusionChance)})</p>`;
            statElement.innerHTML += `<p>CONFUSION POWER: ${item.stats.confusionPower} (${this.comparisonString(item.type, 'confusionPower', item.stats.confusionPower)})</p>`;
        }
        if(item.stats.rootChance>0 && item.stats.rootPower>0) {
            statElement.innerHTML += `<p>ROOT CHANCE: ${item.stats.rootChance} (${this.comparisonString(item.type, 'rootChance', item.stats.rootChance)})</p>`;
            statElement.innerHTML += `<p>ROOT POWER: ${item.stats.rootPower} (${this.comparisonString(item.type, 'rootPower', item.stats.rootPower)})</p>`;
        }
        statElement.innerHTML += '<br>';
        if(item.stats.dropLevelBoost>0) {
            statElement.innerHTML += `<p>LOOT LEVEL BOOST: ${item.stats.dropLevelBoost} (${this.comparisonString(item.type, 'dropLevelBoost', item.stats.dropLevelBoost)})</p>`;
        }
        if(item.stats.dropPowerBoost>0) {
            statElement.innerHTML += `<p>LOOT POWER BOOST: ${item.stats.dropPowerBoost} (${this.comparisonString(item.type, 'dropPowerBoost', item.stats.dropPowerBoost)})</p>`;
        }

        //destroy item
        if(action!=='unequip') {
            const destroyItemBtn = document.getElementById('destroy-item');
            destroyItemBtn.replaceWith(destroyItemBtn.cloneNode(true));
            const newButton = document.getElementById('destroy-item');
            newButton.style.display = 'block';
            newButton.addEventListener('click', () => {
                this.destroyItem(item);
                this.closeItemInspect();
            });
        }

        const actionButtons = inspectElement.querySelectorAll('.action');

        for(const btn of actionButtons) {
            btn.classList.remove('visible');
            btn.replaceWith(btn.cloneNode(true));
        }

        if (action == 'equip') {
            const newButton = inspectElement.querySelector('.equip-btn');
            newButton.classList.add('visible');
            newButton.addEventListener('click', () => {
                this.equipItem(item);
                this.closeItemInspect();
            });
        }
        if (action == 'unequip') {
            const newButton = inspectElement.querySelector('.unequip-btn');
            newButton.classList.add('visible');
            newButton.addEventListener('click', () => {
                this.unequipItem(item);
                this.closeItemInspect();
            });
        }
        if (action == 'use') {
            const newButton = inspectElement.querySelector('.use-btn');
            newButton.classList.add('visible');
            newButton.addEventListener('click', () => {
                this.useItem(item);
                this.closeItemInspect();
            });
        }

        const cancelBtn = inspectElement.querySelector('.cancel-btn');
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        const newCancelBtn = inspectElement.querySelector('.cancel-btn');
        newCancelBtn.addEventListener('click', ()=>{
            this.closeItemInspect();
        });

        inspectElement.style.display = 'block';
    }

    closeItemInspect() {
        const inspectElement = document.getElementById('inspect-item');
        inspectElement.style.display = 'none';
        const destroyItemBtn = document.getElementById('destroy-item');
        destroyItemBtn.style.display = 'none';
    }

    comparisonString(type, stat, newAmount) {
        let operator = '';
        let amount = 0;

        if(type === 'armor') {
            if (this.eqArmor !== -1) {
                if(newAmount >= this.eqArmor.stats[stat]) {
                    operator = '+';
                    amount = newAmount-this.eqArmor.stats[stat];
                } else if(newAmount < this.eqArmor.stats[stat]) {
                    amount =  newAmount-this.eqArmor.stats[stat];
                }
            } else {
                operator = '+';
                amount =  newAmount;
            }
        }
        if(type === 'weapon') {
            if (this.eqWeapon !== -1) {
                if(newAmount >= this.eqWeapon.stats[stat]) {
                    operator = '+';
                    amount =  newAmount-this.eqWeapon.stats[stat];
                } else if(newAmount < this.eqWeapon.stats[stat]) {
                    amount =  newAmount-this.eqWeapon.stats[stat];
                }
            } else {
                operator = '+';
                amount =  newAmount;
            }
        }
        if(type === 'talisman') {
            if (this.eqTalisman !== -1) {
                if(newAmount >= this.eqTalisman.stats[stat]) {
                    operator = '+';
                    amount =  newAmount-this.eqTalisman.stats[stat];
                } else if(newAmount < this.eqTalisman.stats[stat]) {
                    amount =  newAmount-this.eqTalisman.stats[stat];
                }
            } else {
                operator = '+';
                amount =  newAmount;
            }
        }
        if(type === 'ring') {
            if (this.eqRing !== -1) {
                if(newAmount >= this.eqRing.stats[stat]) {
                    operator = '+';
                    amount =  newAmount-this.eqRing.stats[stat];
                } else if(newAmount < this.eqRing.stats[stat]) {
                    amount =  newAmount-this.eqRing.stats[stat];
                }
            } else {
                operator = '+';
                amount =  newAmount;
            }
        }

        if(Number.isInteger(amount))
            return operator+amount;
        else
            return operator+amount.toFixed(2);
    }

    addItem(item) {
        if (this.inventory.length < this.inventorySize) {
            this.inventory.push(item);
            this.renderInventory();
        }
        
    }

    useItem(item) {
        this.stats.hp = this.stats.maxhp;
        this.destroyItem(item);
    }

    destroyItem(item) {
        this.inventory.splice(this.inventory.indexOf(item), 1);
        this.renderInventory();
    }

    equipItem(item) {
        let tempWeaponHold = -1;

        for(const stat in item.stats) {
            this.stats[stat] += item.stats[stat];
        }
        this.inventory.splice(this.inventory.indexOf(item), 1);

        if(item.type === 'weapon') {
            if (this.eqWeapon !== -1)
                tempWeaponHold = this.eqWeapon;
        } else if(item.type === 'armor') {
            if (this.eqArmor !== -1)
                tempWeaponHold = this.eqArmor;
        } else if(item.type === 'talisman') {
            if (this.eqTalisman !== -1)
                tempWeaponHold = this.eqTalisman;
        } else if(item.type === 'ring') {
            if (this.eqRing !== -1)
                tempWeaponHold = this.eqRing;
        }

        if(tempWeaponHold !== -1) {
            this.unequipItem(tempWeaponHold);
        }

        if(item.type === 'weapon') {
            this.eqWeapon = item;
        } else if(item.type === 'armor') {
            this.eqArmor = item;
        } else if(item.type === 'talisman') {
            this.eqTalisman = item;
        } else if(item.type === 'ring') {
            this.eqRing = item;
        }

        this.renderInventory();
    }

    unequipItem(item) {
        this.inventory.push(item);

        for(const stat in item.stats) {
            this.stats[stat] -= item.stats[stat];
        }

        if(item.type === 'weapon') {
            this.eqWeapon = -1;
        }
        if(item.type === 'armor') {
            this.eqArmor = -1;
        }
        if(item.type === 'talisman') {
            this.eqTalisman = -1;
        }
        if(item.type === 'ring') {
            this.eqRing = -1;
        }

        this.renderInventory();
    }

    renderInventory() {
        const inventoryElement = document.getElementById('inventory');
        const newInventoryElement = document.createElement('div');

        newInventoryElement.id = 'inventory';
        
        newInventoryElement.className = 'inventory';

        let currentSize = 0;

        for(const item of this.inventory) {
            currentSize++;

            if(currentSize > this.inventorySize)
                return;

            const slotElement = this.renderSlot(item);
            newInventoryElement.appendChild(slotElement);

        }

        for(let i = currentSize; i<this.inventorySize; i++) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            newInventoryElement.appendChild(slotElement);
        }

        inventoryElement.replaceWith(newInventoryElement);
        


        const equipmentElement = document.getElementById('equipment');
        const newEquipmentElement = document.createElement('div');
        newEquipmentElement.id = 'equipment';
        newEquipmentElement.className = 'equipment';

        if(this.eqWeapon === -1) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            newEquipmentElement.appendChild(slotElement);
        } else {
            const slotElement = this.renderEquipmentSlot(this.eqWeapon);
            newEquipmentElement.appendChild(slotElement);
        }

        if(this.eqArmor === -1) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            newEquipmentElement.appendChild(slotElement);
        } else {
            const slotElement = this.renderEquipmentSlot(this.eqArmor);
            newEquipmentElement.appendChild(slotElement);
        }

        if(this.eqTalisman === -1) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            newEquipmentElement.appendChild(slotElement);
        } else {
            const slotElement = this.renderEquipmentSlot(this.eqTalisman);
            newEquipmentElement.appendChild(slotElement);
        }

        if(this.eqRing === -1) {
            const slotElement = document.createElement('div');
            slotElement.classList.add('slot');
            newEquipmentElement.appendChild(slotElement);
        } else {
            const slotElement = this.renderEquipmentSlot(this.eqRing);
            newEquipmentElement.appendChild(slotElement);
        }

        equipmentElement.replaceWith(newEquipmentElement);
        this.updateProfileUI();

    }

    renderSlot(item) {
        const slotElement = document.createElement('div');
        slotElement.classList.add('slot');
        slotElement.classList.add(`rarity-${item.rarity}`);
        slotElement.style.backgroundImage = `url(./graphics/items/${item.type}/${item.type}${item.img}.png)`;

        slotElement.addEventListener('click', () => {
            if(item.type === 'consumable') {
                this.inspectItem(item, 'use');
            } else {
                this.inspectItem(item, 'equip');
            }
            
        });
        
        return slotElement;
    }

    renderEquipmentSlot(item) {
        const slotElement = document.createElement('div');
        slotElement.classList.add('slot');
        slotElement.classList.add(`rarity-${item.rarity}`);
        slotElement.style.backgroundImage = `url(./graphics/items/${item.type}/${item.type}${item.img}.png)`;

        slotElement.addEventListener('click', () => {
            this.inspectItem(item, 'unequip');
        });
        
        return slotElement;
    }

    updateProfileUI() {
        const statElement = document.getElementById('stats-container');

        statElement.innerHTML = `
        <p>ARMOR: ${this.stats.armor}</p>
        <p>EVASION: ${this.stats.evasion}</p>
        <p>PIERCING: ${this.stats.piercing}</p>
        <br>
        <p>BASE DAMAGE: ${this.stats.baseDmg}</p>
        <p>CRIT CHANCE: ${this.stats.critChance}%</p>
        <p>CRIT POWER: x${this.stats.critPower.toFixed(2)}</p>
        <br>
        <p>BURN DAMAGE: ${this.stats.burnDmg}</p>
        <p>POISON DAMAGE: ${this.stats.poisonDmg}</p>
        <br>
        <p>BLIND CHANCE: ${this.stats.blindChance}%</p>
        <p>BLIND POWER: ${this.stats.blindPower}</p>
        <p>CONFUSION CHANCE: ${this.stats.confusionChance}%</p>
        <p>CONFUSION POWER: ${this.stats.confusionPower}</p>
        <p>ROOT CHANCE: ${this.stats.rootChance}%</p>
        <p>ROOT POWER: ${this.stats.rootPower}</p>
        <br>
        <p>LOOT LEVEL BOOST: ${this.stats.dropLevelBoost}</p>
        <p>LOOT POWER BOOST: ${this.stats.dropPowerBoost}</p>
        `

        const hpBar = document.getElementById('hp-bar-container');
        hpBar.querySelector('.resource-bar-fill').style.width = `${this.stats.hp/this.stats.maxhp*100}%`;
        hpBar.querySelector('.resource-bar-text').innerText = `${this.stats.hp}/${this.stats.maxhp}`;
    }
}

class Room {
    posX;
    posY;
    offsetX;
    offsetY;
    sizeX;
    sizeY;

    tileX;
    tileY;

    constructor(tileSize, tileX, tileY, mapRNG) {
        this.tileX = tileX;
        this.tileY = tileY;

        this.offsetX = parseInt(mapRNG.rand() * tileSize/2)+1;
        this.offsetY = parseInt(mapRNG.rand() * tileSize/2)+1;

        this.posX = tileSize * tileX + this.offsetX;
        this.posY = tileSize * tileY + this.offsetY;

        this.sizeX = parseInt(mapRNG.randMinMax(2 , tileSize - this.offsetX - 1 ));
        this.sizeY = parseInt(mapRNG.randMinMax(2 , tileSize - this.offsetY - 1 ));
    }
}

class Map {
    mapRNG;
    level;

    //single tile can contain one room
    //tile size = how many characters make one tile square
    tileSize;
    tilesCountX;
    tilesCountY;
    // roomCount has to be less than tilesCountX * tilesCountY
    roomCount;

    maxX;
    maxY;

    //array for generated rooms
    rooms = [];
    tileLayout = [];

    liveMap = [];
    // map legend:
    // 0 - empty cell
    // 1 - wall
    // 2 - floor 
    // 3 - stairs
    // liveMap is a 2D array. liveMap[y][x]

    entities = [];
    monsterCount;
    neutralCount;
    chestCount;
    npcCount;
    player;

    constructor(mapRNG, level, player) {
        this.mapRNG = mapRNG;
        this.level = level;
        this.player = player;
    }

    generateMap(entityManager) {
        // 1. create map specification based on mapRNG generator and current level

        this.tileSize = 6 + parseInt(Math.sqrt(this.level)) + parseInt(this.mapRNG.rand()*4);
        this.tilesCountX = 2 + parseInt(Math.sqrt(this.level/2)) + parseInt(this.mapRNG.rand()*2);
        this.tilesCountY = 2 + parseInt(Math.sqrt(this.level/2)) + parseInt(this.mapRNG.rand()*2);
        this.roomCount = parseInt(this.mapRNG.randMinMax(parseInt((this.tilesCountX*this.tilesCountY)*0.4), parseInt(this.tilesCountX*this.tilesCountY)));

        this.maxX = this.tileSize*this.tilesCountX;
        this.maxY = this.tileSize*this.tilesCountY;

        // 2. generate tile layout and rooms inside them
        
        // 2.1 initialize tileLayout array
        for(let arrY=0; arrY<this.tilesCountY+1; arrY++)
        {
            this.tileLayout[arrY] = [];
            for(let arrX=0; arrX<this.tilesCountY+1; arrX++) {
                this.tileLayout[arrY].push(0);
            }

        }

        // 2.2 create rooms
        for(let i=0; i<this.roomCount; i++) {
            let foundEmptyTile = false;
            let testedTileX;
            let testedTileY;

            do {
                testedTileX = parseInt(this.mapRNG.randMinMax(0, this.tilesCountX-1));
                testedTileY = parseInt(this.mapRNG.randMinMax(0, this.tilesCountY-1));

                if(this.tileLayout[testedTileY][testedTileX] === 0) {
                    foundEmptyTile = true;
                    break;
                }
            }while(!foundEmptyTile);

            this.tileLayout[testedTileY][testedTileX] = 1;

            const newRoom = new Room(this.tileSize, testedTileX, testedTileY, this.mapRNG);
            this.rooms.push(newRoom);
        }
 
        // 3. initialize liveMap with 0's

        for(let y = 0; y < this.tilesCountY*this.tileSize; y++) {
            const row = [];
            for(let x = 0; x < this.tilesCountX*this.tileSize; x++) {
                row.push(0);
            }
            this.liveMap.push(row);
        }

        // 4. fill rooms, then draw walls around rooms

        for (const room of this.rooms) {
            for(let y = room.posY; y < room.posY+room.sizeY; y++) {
                for(let x = room.posX; x < room.posX+room.sizeX; x++) {
                    this.liveMap[y][x] = 2;
                }
            }
        }


        for (const room of this.rooms) {
            //top
            for(let x = room.posX-1; x < room.posX+room.sizeX+1; x++) {
                this.liveMap[room.posY-1][x] = 1;
            }

            //bottom
            for(let x = room.posX-1; x < room.posX+room.sizeX+1; x++) {
                this.liveMap[room.posY+room.sizeY][x] = 1;
            }

            //right
            for(let y = room.posY; y < room.posY+room.sizeY; y++) {
                this.liveMap[y][room.posX+room.sizeX] = 1;
            }

            //left
            for(let y = room.posY; y < room.posY+room.sizeY; y++) {
                this.liveMap[y][room.posX-1] = 1;
            }
            
        }
        

        // 5. generate corridors between rooms

        for (const room of this.rooms) {
            let secondRoom = this.rooms[parseInt(this.mapRNG.rand()*this.roomCount)];

            while(room === secondRoom || this.tileLayout[secondRoom.tileY][secondRoom.tileX] === 2) {
                secondRoom = this.rooms[parseInt(this.mapRNG.rand()*this.roomCount)];
            }

            this.tileLayout[secondRoom.tileY][secondRoom.tileX] = 2;

            let cursorX = parseInt((room.posX+room.posX+room.sizeX)/2);
            let cursorY = parseInt((room.posY+room.posY+room.sizeY)/2);

            let destinationX = parseInt((secondRoom.posX+secondRoom.posX+secondRoom.sizeX)/2);
            let destinationY = parseInt((secondRoom.posY+secondRoom.posY+secondRoom.sizeY)/2);

            while(cursorX != destinationX || cursorY != destinationY) {
                const direction = parseInt(this.mapRNG.randMinMax(0,2));

                if(direction == 0 && cursorY != destinationY) {
                    //traverse on Y
                    if(cursorY < destinationY) {
                        cursorY++;
                    } else if (cursorY > destinationY) {
                        cursorY--;
                    } 

                } else {
                    //traverse on X
                    if(cursorX < destinationX) {
                        cursorX++;
                    } else if (cursorX > destinationX) {
                        cursorX--;
                    } else {
                        // cursorX is equal to desinationX so traverse Y instead
                        if(cursorY < destinationY) {
                            cursorY++;
                        } else if (cursorY > destinationY) {
                            cursorY--;
                        } 
                    }

                }

                this.liveMap[cursorY][cursorX] = 2;
            }
        }

        // 6. set up entities

        this.monsterCount = 1+parseInt(this.mapRNG.randMinMax(this.roomCount*0.3,this.roomCount*2));

        // player position
        const playerRoom = this.rooms[parseInt(this.mapRNG.rand()*this.rooms.length)];
        const playerpx = playerRoom.posX+parseInt(this.mapRNG.rand()*playerRoom.sizeX);
        const playerpy = playerRoom.posY+parseInt(this.mapRNG.rand()*playerRoom.sizeY);

        this.player.posX = playerpx;
        this.player.posY = playerpy;


        // 7. populate rooms with entities

        for(let i = 0; i < this.monsterCount; i++) {
            const monsterType = Math.min(entityManager.monsterDb.length, parseInt(Math.max(0, this.level/100*entityManager.monsterDb.length-this.level/100*entityManager.monsterDb.length*this.mapRNG.rand()*this.mapRNG.rand())));


            const entity = clone(entityManager.monsterDb[monsterType]);
            entity.stats.hp = entity.stats.maxhp;
            console.log(entity)
            
            let goodPosition = true;

            do {
                goodPosition = true;
                const room = this.rooms[parseInt(this.mapRNG.rand()*this.rooms.length)];
                const px = room.posX+parseInt(this.mapRNG.rand()*room.sizeX);
                const py = room.posY+parseInt(this.mapRNG.rand()*room.sizeY);

                //check if player is here
                if (Math.abs(this.player.posX-px) < 4 &&Math.abs(this.player.posY-py) < 4) {
                    goodPosition = false;
                    continue;
                }

                //check if previous entity has this position'
                for(const entity of this.entities) {
                    if (entity.posX == px && entity.posY == py) {
                        goodPosition = false;
                        break;
                    }
                }

                if(goodPosition) {
                    entity.posX = px;
                    entity.posY = py;
                }
                

            }while(!goodPosition);

            this.entities.push(entity);

        }

        // 8. stairs

        let goodStairsPosition = true;
        let stairsX;
        let stairsY;
        do {
            goodStairsPosition = true;
            const room = this.rooms[parseInt(this.mapRNG.rand()*this.rooms.length)];
            const px = room.posX+parseInt(this.mapRNG.rand()*room.sizeX);
            const py = room.posY+parseInt(this.mapRNG.rand()*room.sizeY);

            //check if player is here
            if (Math.abs(this.player.posX-px) < 4 &&Math.abs(this.player.posY-py) < 4) {
                goodStairsPosition = false;
                continue;
            }

            //check if previous entity has this position'
            for(const entity of this.entities) {
                if (entity.posX == px && entity.posY == py) {
                    goodStairsPosition = false;
                    break;
                }
            }

            if(goodStairsPosition) {
                stairsX = px;
                stairsY = py;
            }
            

        }while(!goodStairsPosition);

        this.liveMap[stairsY][stairsX] = 3;
        console.log(stairsX, stairsY)



    }

    isStairs(x, y) {
        if (this.liveMap[y][x] === 3)
            return true;
        
        return false;
    }

    isFree(x, y) {
        if (this.liveMap[y][x] !== 2)
            return false;

        for(const entity of this.entities) {
            if (entity.posX == x && entity.posY == y) {
                return false;
            }
        }

        if (this.player.posX == x && this.player.posY == y)
            return false;
        

        return true;
    }

    entityCheck(x, y) {
        for(const entity of this.entities) {
            if (entity.posX == x && entity.posY == y) {
                return entity;
            }
        }

        return -1;
    }

}

class RunRNG {
    seed;
    rand;

    constructor(seedP) {
        this.seed = this.xmur3(seedP);
        this.rand = this.mulberry32(this.seed());
    }

    xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }
    
    mulberry32(a) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    randMinMax(min, max) {
        return this.rand()*(max-min+1) + min;
    }

}

class Game {
    state = 'pause';

    dropRNG;
    mapRNG;

    cellSize = 16; //pixels of a rendered cell
    renderPixelSize = 2;

    map;
    player;
    entities = [];

    fightTextQueue = [];

    dungeonStage = 5; //for map generation : number 1- 100, the higher the more difficult the dungeon

    init(runSeed) {

        this.dropRNG = new RunRNG(runSeed);
        this.mapRNG = new RunRNG(runSeed);

        this.player = new Player;
        this.player.name = "Player name";
        this.player.classSetup();
        this.player.renderInventory();
        

        this.entityManager = new EntityManager;
        this.entityManager.init();

        this.map = new Map(this.mapRNG, this.dungeonStage, this.player);
        this.map.generateMap(this.entityManager);
        this.entities = this.map.entities;

        this.initializeControls();

        this.gameStep('pass');

        this.state = 'play';

    }

    initializeControls() {
        //click pad
        
        const up = document.getElementById('up');
        const down = document.getElementById('down');
        const left = document.getElementById('left');
        const right = document.getElementById('right');
        const pass = document.getElementById('pass');

        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');

        up.addEventListener('click', this.gameStep.bind(this, 'up'));
        down.addEventListener('click', this.gameStep.bind(this, 'down'));
        left.addEventListener('click', this.gameStep.bind(this, 'left'));
        right.addEventListener('click', this.gameStep.bind(this, 'right'));
        pass.addEventListener('click', this.gameStep.bind(this, 'pass'));

        // zoomIn.addEventListener('click', this.viewportZoom.bind(null, 'in'));
        zoomIn.addEventListener('click', ()=> {
            this.viewportZoom('in');
        });
        // zoomOut.addEventListener('click', this.viewportZoom.bind(null, 'out'));
        zoomOut.addEventListener('click', ()=> {
            this.viewportZoom('out');
        });

        //keyboard
        document.addEventListener('keydown', (event) => {
            if (event.key === 'w') {
                this.gameStep.bind(this, 'up')();
            }
            else if (event.key === 's') {
                this.gameStep.bind(this, 'down')();
            }
            else if (event.key === 'a') {
                this.gameStep.bind(this, 'left')();
            }
            else if (event.key === 'd') {
                this.gameStep.bind(this, 'right')();
            }
            else if (event.key === ' ') {
                this.gameStep.bind(this, 'pass')();
            }
          });
    }

    renderGameFrame(camX, camY) {
        const tempDungeonElement = document.createElement('div');
        tempDungeonElement.classList.add('map-container');

        const tempFightTextElement = document.createElement('div');
        tempFightTextElement.classList.add('fight-text-container');

        const mapElement = document.getElementById('dungeon-map');

        this.renderPixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
        this.cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
        //calculate how many characters will fit
        const maxHeight = parseInt(mapElement.clientHeight/(this.cellSize*this.renderPixelSize));
        const maxWidth = parseInt(mapElement.clientWidth/(this.cellSize*this.renderPixelSize));

        const startX = camX - parseInt(maxWidth/2);
        const startY = camY - parseInt(maxHeight/2);

        this.renderMapFrame(startX, startY, maxWidth, maxHeight, tempDungeonElement);
        this.renderEntities(startX, startY, maxWidth, maxHeight, tempDungeonElement);
        this.renderFightText(startX, startY, maxWidth, maxHeight, tempFightTextElement);

        mapElement.querySelector('.map-container').replaceWith(tempDungeonElement);
        mapElement.querySelector('.fight-text-container').replaceWith(tempFightTextElement);
    }

    renderEntities(startX, startY, maxWidth, maxHeight, tempDungeonElement) {

        // setup
        const monsterImgPath = './graphics/entities/monsters/';

        //render player
        const playerCell = document.createElement('div');
        playerCell.classList.add('cell');
        playerCell.classList.add('player');
        playerCell.classList.add(this.player.class);

        playerCell.style.left = `${(this.player.posX-startX)*this.cellSize*this.renderPixelSize}px`;
        playerCell.style.top = `${(this.player.posY-startY)*this.cellSize *this.renderPixelSize}px`;

        tempDungeonElement.appendChild(playerCell);

        //render other entities
        for(const entity of this.entities) {
            if (entity.posX < startX || entity.posX > startX+maxWidth || entity.posY < startY || entity.posY > startY+maxHeight) {
                continue;
            }

            const newCell = document.createElement('div');
            newCell.classList.add('cell');

            newCell.style.backgroundImage = `url(${monsterImgPath}${entity.cssClass}.gif)`;

            newCell.style.left = `${(entity.posX-startX)*this.cellSize*this.renderPixelSize}px`;
            newCell.style.top = `${(entity.posY-startY)*this.cellSize *this.renderPixelSize}px`;
            
            tempDungeonElement.appendChild(newCell);
        }

    }

    renderMapFrame(startX, startY, maxWidth, maxHeight, tempDungeonElement) {
        const currentMap = this.map.liveMap;

        for(let y = startY-1; y < startY+maxHeight+1; y++) {
            for(let x = startX-1; x < startX+maxWidth+1; x++) {
                if(y < 0 || x < 0 || y >= this.map.maxY || x >= this.map.maxX) {
                    continue;
                }

                const newCell = document.createElement('div');
                newCell.classList.add('cell');
                if (currentMap[y][x] == 0) {
                    
                    continue;
                } else if (currentMap[y][x] == 1) {
                    newCell.classList.add('wall');
                } else if (currentMap[y][x] == 2) {
                    newCell.classList.add('floor');
                } else if (currentMap[y][x] == 3) {
                    newCell.classList.add('stairs');
                }

                newCell.style.left = `${(x-startX)*this.cellSize*this.renderPixelSize}px`;
                newCell.style.top = `${(y-startY)*this.cellSize*this.renderPixelSize}px`;
                
                tempDungeonElement.appendChild(newCell);
            }

        }

        
    }

    renderFightText(startX, startY, maxWidth, maxHeight, tempDungeonElement) {

        for (const fightText of this.fightTextQueue) {

            if (fightText.posX < startX || fightText.posX > startX+maxWidth || fightText.posY < startY || fightText.posY > startY+maxHeight) {
                continue;
            }

            const newFightText = document.createElement('div');
            newFightText.className = `fight-text ${fightText.type}-text`;

            let offset=0;
            if(fightText.type == 'block') {
                offset = 0;
                newFightText.innerText = `Block!`;
            }
            else if(fightText.type == 'evade') {
                offset = 0;
                newFightText.innerText = `Evasion!`;
            }
            else if(fightText.type == 'damage') {
                offset = 0;
                newFightText.innerText = `-${fightText.damage}`;
            }
            else if(fightText.type == 'poison') {
                offset = 1;
                newFightText.innerText = `poison: -${fightText.damage}`;
            }
            else if(fightText.type == 'burn') {
                offset = 2;
                newFightText.innerText = `burn: armor -${fightText.damage}`;
            }
            else if(fightText.type == 'blind') {
                offset = 3;
                newFightText.innerText = `blind ${fightText.damage}`;
            }
            else if(fightText.type == 'root') {
                offset = 5;
                newFightText.innerText = `root ${fightText.damage}`;
            }
            else if(fightText.type == 'confusion') {
                offset = 6;
                newFightText.innerText = `confusion ${fightText.damage}`;
            }

            newFightText.style.left = `${(fightText.posX-startX)*this.cellSize*this.renderPixelSize+Math.random()*10-5}px`;
            newFightText.style.top = `${(fightText.posY-startY)*this.cellSize*this.renderPixelSize+Math.random()*10-5+offset*6*this.renderPixelSize}px`;

            

            tempDungeonElement.appendChild(newFightText);

            newFightText.animate([
                // keyframes
                { transform: 'translateY(0px)',
                opacity: 1 },
                { transform: `translateY(-${this.cellSize*this.renderPixelSize/2}px)`,
            opacity: 0.7 },
                { transform: `translateY(-${this.cellSize*this.renderPixelSize}px)`,
            opacity: 0 }
              ], {
                // timing options
                duration: 4100,
                iterations: 1,
                easing: 'ease-out'
              });

            setTimeout((element=>{element.remove()}).bind(null,newFightText),4000);
        }


        this.fightTextQueue = [];
        
    }

    gameStep(action) {
        //handle player input (interaction with entities and/or movement)
        this.playerInputHandler(action);

        //handle entities logic
        this.entitiesLogic();

        //apply monster status effects
        this.applyEntityStatusEffects();
        
        //apply player status effects
        this.applyPlayerStatusEffects();

        this.checkPlayerDead();

        
        this.renderGameFrame(this.player.posX, this.player.posY);
        this.player.updateProfileUI();

    }

    checkPlayerDead() {
        if (this.player.stats.hp <= 0) {
            window.location.href = 'youdied.html';
        }
    }

    entitiesLogic() {
        for(const entity of this.entities) {
            //check if its dead
            if (entity.stats.hp < 0) {
                this.entities.splice(this.entities.indexOf(entity), 1);
                this.playerLoot();
                continue;
            }

            if (entity.type == 'monster') {
                //check if player is around
                if(entity.behavior === 'scared' && entity.stats.hp <= entity.stats.maxhp/10 && entity.effects.rooted === 0 && entity.effects.confusion === 0) {
                    //run away from player
                    let dirX = entity.posX;
                    let dirY = entity.posY;

                    const randMove = parseInt(Math.random()*2);

                    if (this.player.posX <= entity.posX)
                        dirX++;
                    if (this.player.posX > entity.posX)
                        dirX--;
                    if (this.player.posY <= entity.posY)
                        dirY++;
                    if (this.player.posY > entity.posY)
                        dirY--;
                    
                    if (randMove == 0) {
                        if (this.map.isFree(dirX, entity.posY)) {
                            entity.posX = dirX;
                        } else if (this.map.isFree(entity.posX, dirY)) {
                            entity.posY = dirY;
                        }
                    } 
                    else {
                        if (this.map.isFree(entity.posX, dirY)) {
                            entity.posY = dirY;
                        } else if (this.map.isFree(dirX, entity.posY)) {
                            entity.posX = dirX;
                        }
                    }
                } else {
                    if (Math.abs(this.player.posX - entity.posX)==1 && this.player.posY === entity.posY ||
                    Math.abs(this.player.posY - entity.posY)==1 && this.player.posX === entity.posX) {
                        //attack player
                        this.player.takeDamage(entity, this.fightTextQueue);
                    }else {
                        //cant attack player
                        //check if player is in rage to follow
                        if (entity.effects.confusion == 0 && 
                        Math.abs(this.player.posX - entity.posX)<8 && 
                        Math.abs(this.player.posY - entity.posY)<8) {
                            
                            let dirX = entity.posX;
                            let dirY = entity.posY;

                            const randMove = parseInt(Math.random()*2);

                            if (this.player.posX < entity.posX)
                                dirX--;
                            if (this.player.posX > entity.posX)
                                dirX++;
                            if (this.player.posY < entity.posY)
                                dirY--;
                            if (this.player.posY > entity.posY)
                                dirY++;
                            
                            if (randMove == 0) {
                                if (this.map.isFree(dirX, entity.posY)) {
                                    entity.posX = dirX;
                                } else if (this.map.isFree(entity.posX, dirY)) {
                                    entity.posY = dirY;
                                }
                            } 
                            else {
                                if (this.map.isFree(entity.posX, dirY)) {
                                    entity.posY = dirY;
                                } else if (this.map.isFree(dirX, entity.posY)) {
                                    entity.posX = dirX;
                                }
                            }
                                

                        } else {
                            const randMove = parseInt(Math.random()*5);

                            let monsterDestinationX = entity.posX;
                            let monsterDestinationY = entity.posY;

                            if(randMove === 0) {
                                monsterDestinationX++;
                            } else if(randMove === 1) {
                                monsterDestinationX--;
                            } else if(randMove === 2) {
                                monsterDestinationY--;
                            } else if(randMove === 3) {
                                monsterDestinationY++;
                            }

                            if (this.map.isFree(monsterDestinationX, monsterDestinationY) && entity.stats.rooted === 0) {
                                entity.posX = monsterDestinationX;
                                entity.posY = monsterDestinationY;
                            }
                        }


                    }
                }
                
            }


        }
    }

    applyPlayerStatusEffects() {
        this.player.stats.hp -= this.player.effects.poison - parseInt(Math.random()*this.player.effects.poison/2);

        const textPosX = this.player.posX;
        const textPosY = this.player.posY;

        if (this.player.effects.burn > 0) {
            this.fightTextQueue.push({
                damage: this.player.effects.burn,
                type: 'burn',
                posX: textPosX,
                posY: textPosY
            });
        } 

        if (this.player.effects.poison > 0) {
            this.fightTextQueue.push({
                damage: this.player.effects.poison,
                type: 'poison',
                posX: textPosX,
                posY: textPosY
            });
            this.player.updateProfileUI();
        } 

        for(const effect in this.player.effects) {
            if (this.player.effects[effect] > 0)
                this.player.effects[effect]--;
        }



    }

    applyEntityStatusEffects() {
        for(const entity of this.entities) {
            //poison
            entity.stats.hp -= entity.effects.poison - parseInt(Math.random()*entity.effects.poison/2);

            const textPosX = entity.posX;
            const textPosY = entity.posY;

            if (entity.burn > 0) {
                this.fightTextQueue.push({
                    damage: entity.effects.burn,
                    type: 'burn',
                    posX: textPosX,
                    posY: textPosY
                });
            } 

            if (entity.effects.poison > 0) {
                this.fightTextQueue.push({
                    damage: entity.effects.poison,
                    type: 'poison',
                    posX: textPosX,
                    posY: textPosY
                });
            } 

            //decrease durations
            for(const effect in entity.effects) {
                if (entity.effects[effect] > 0)
                    entity.effects[effect]--;
            }
        }

        
    }

    playerLoot() {
        if(this.dropRNG.rand() > 0.3) {
            return;
        }
        const newItem = new Item(this.dungeonStage, this.dropRNG, this.player);
        this.player.addItem(newItem);
        console.log(newItem)
    }

    playerInputHandler(action) {
        let playerDestinationX = this.player.posX;
        let playerDestinationY = this.player.posY;

        if (action == 'up') {
            playerDestinationY--;
        } else if (action == 'down') {
            playerDestinationY++;
        }else if (action == 'left') {
            playerDestinationX--;
        }else if (action == 'right') {
            playerDestinationX++;
        } else {
            return;
        }

        //check if an entity is there. if yes - return it
        const entityCheck = this.map.entityCheck(playerDestinationX, playerDestinationY);

        if (entityCheck === -1) {
            //no entity found at the destination - move player there if its floor
            if(this.map.isFree(playerDestinationX, playerDestinationY)){
                this.player.posX = playerDestinationX;
                this.player.posY = playerDestinationY;
            }
            if(this.map.isStairs(playerDestinationX, playerDestinationY)) {
                this.nextDungeonLevel();
            }
        } else {
            //interact with entity
            if(entityCheck.type == 'monster') {
                const damage = entityCheck.takeDamage(this.player, this.fightTextQueue);
            }

        }

    }

    viewportZoom(action) {
        let root = document.documentElement;
        if(action === 'in') {
            root.style.setProperty('--cell-size', `${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'))+1}`);

        } else if(action === 'out') {
            root.style.setProperty('--cell-size', `${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'))-1}`);
        }
        console.log(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')-1)
        this.renderGameFrame(this.player.posX, this.player.posY);
    }

    nextDungeonLevel() {
        this.map = new Map(this.mapRNG, this.dungeonStage, this.player);
        this.map.generateMap(this.entityManager);
        this.entities = this.map.entities;

        this.dungeonStage+=5;
    }

    notification(type, content) {

    }
}

const game = new Game;
game.init("totally random seedva");


