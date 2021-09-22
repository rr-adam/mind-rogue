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
        let itemPower = parseInt( dropRNG.randMinMax((999*(level/100))/2, 999*(level/100)))+dropPowerBoost;
        this.itemPower = itemPower;

        if (itemRarity < 80) {
            this.rarity = 'common';
            this.img = parseInt(dropRNG.randMinMax(2,15));
        } else if(itemRarity < 95) {
            this.rarity = 'rare';
            this.img = parseInt(dropRNG.randMinMax(15,22));
            itemPower=parseInt(itemPower*1.4);
        } else {
            this.rarity = 'legendary';
            this.img = parseInt(dropRNG.randMinMax(23,26));
            itemPower=parseInt(itemPower*2);
        }

        const typeRand = dropRNG.rand();

        if (typeRand < 0.25) {
            //weapon
            this.type = 'weapon';
            
            this.stats.baseDmg = parseInt(dropRNG.randMinMax(itemPower/1000*15000/2, itemPower/1000*15000));
            this.stats.piercing = parseInt(dropRNG.randMinMax(itemPower/1000*1000/2, itemPower/1000*1000));
            this.stats.critChance = parseInt(dropRNG.randMinMax(1+itemPower/1000*35/4, 1+itemPower/1000*35));
            this.stats.critPower = +((dropRNG.rand()*itemPower/1000*10)).toFixed(2);

            if(dropRNG.rand() > 0.5) {
                this.stats.blindChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.blindPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*50));
            }

            if(dropRNG.rand() > 0.5) {
                this.stats.confusionChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.confusionPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*50));
            }

            if(dropRNG.rand() > 0.5) {
                this.stats.rootChance = 1+parseInt(dropRNG.randMinMax(1+itemPower/1000*15/2, 1+itemPower/1000*50));
                this.stats.rootPower = 1+parseInt(dropRNG.randMinMax(2, 2+itemPower/1000*50));
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