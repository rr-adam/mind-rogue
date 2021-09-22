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
            if(this.rooms.indexOf(room)===0)
                continue;

            let secondRoom = this.rooms[Math.max(0,this.rooms.indexOf(room)-1)];


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