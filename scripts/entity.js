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