class Player extends Entity {
    inventory = [];
    inventorySize = 20;
    gold = 0;
    class = 'monk';
    
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
            this.stats.armor = 5;
            this.stats.effectsImmunity = 3;
            this.stats.piercing = 3;
            this.stats.critChance = 5;
            this.stats.critPower = 1.8;
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
        
        inspectElement.querySelector('.item-image').style.backgroundImage=`url(./graphics/items/${item.type}/${item.type}${item.img}.png)`;
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
        if(this.stats.hp > this.stats.maxhp) {
            this.stats.hp = this.stats.maxhp;
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