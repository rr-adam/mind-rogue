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
        this.player.class = localStorage.getItem('selectedClass');
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

        this.notification('item', newItem.type);
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
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${type}-notification`;

        if(type === 'item') {
            notificationElement.innerHTML = `You found new ${content} item!`;
        }

        notificationElement.addEventListener('click', () => {
            notificationElement.remove();
        });
        setTimeout(()=>{
            notificationElement.remove();
        },8000);

        document.getElementById('dungeon-section').appendChild(notificationElement);
    }
}

const game = new Game;
game.init(localStorage.getItem('seed'));


