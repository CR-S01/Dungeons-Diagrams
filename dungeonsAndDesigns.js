/**
 * @file Dungeons And Designs
 * @version 1.1
 *
 */

//Made by CR-S01, feel free to edit (:
//reddit Link - https://www.reddit.com/user/CR-S01/
//github Link - https://github.com/CR-S01/Dungeons-Diagrams

//This is my first project using Javascript.
//This is by no means a good Javascript project.
//This may however be an okay enough NETronics project.

//Shoutout to PartyWumpus' exaDOOM for example code
//Shoutout to almostsweet's classicbbs


// ----- NETronics notes -----
//56 by 20 (0-55, 0-19)?
//drawBox (color, x, y, w, h);
//drawText (text, color, x, y)

//saveData (String); ← can use JSON.stringify();
//loadData (); ← can use JSON.parse();

// 0 to 9 is 048 to 057
// A to Z is 065 to 090
// a to z is 097 to 122
// [ & ] are 091 &  093
// del is 008
// tab is 009
// enter is 010
// space is 032

version = 1.0;

const aE = [];//0-63 (8 by 8)
const aN = [];//0-15 (8 by 2)
const bE = [];
const bN = [];
let index = 0;
let timer = 0;
let solve = 0;
let room = -2;
const KEY = {"UP":119,"DOWN":115,"LEFT":97,"RIGHT":100,"WALL":106,"MONSTER":107,"CHEST":108,"RESET":114};//w, s, a, d, j, k, l, r

/*    ROOMS    <- this should be an enum...
 * -1 - Intro
 *  0 - Main Menu
 *  1 - Code (for Dungeon)
 *  2 - Dungeon
 *  3 - Designs
 *  4 - guide
 *  5 - setting (keybind)
 *  6 - credits
 */

//I call it glyphs cause heiroglyphs, y'know, it's all greek to me. you're not supposed to be able to read it
let glyphs = [
'a','a',
'a','a','a','a',
'a','a','a','a',
'a','a','a','a',
'a','a','a','a',
'a','a','a','a'
];//22 digits * 6 bits per digit / 2 bits per tile * 64 tiles → 4 extra bits (version checking i guess)


function getName()
{
    return "D & Designs";
}

function onConnect()
{

    // Reset the server variables when a new user connects:
	load();
	
	roomSplashGoto();
	
}

function onUpdate()
{
	
	if (room == 3 || room == 2){
		timer++
		if (timer==25){drawDungeonCursor(true);}
		if (timer==50){drawDungeonCursor(false);}
		if (timer==50){drawDungeonCursor(false);}
	}
	
	if (room == -1){
		drawTitle();
	}
	
}

function onInput(key)
{
	
	switch(room){
		case -1:
			roomSplashInput();
			break;
		case 0:
			roomMenuInput(key);
			break;
		case 1:
			roomCodeInput(key);
			break;
		case 2:
			roomDungeonInput(key);
			break;
		case 3:
			roomDesignInput(key);
			break;
		case 4: 
			roomGuideInput(key);
			break;
		case 5: 
			roomKeybindInput(key);
			break;
		case 6:
			roomCreditsInput(key);
			break;
	}
	
}

/// ----- ----- ----- ROOM FUNCTIONS ----- ----- -----

function roomSplashGoto(){
	
	clearScreen();
	room = -1;
	
	drawTitle();
	
	drawText("Press [any] key to start!" ,  9, 7, 12);
	drawText("[any]", 17,  13, 12);
	drawText("[any]", 14,  13, 13);
	drawText("[any]", 11,  13, 14);
	drawText("[any]",  8,  13, 15);
	drawText("[any]",  5,  13, 16);
	drawText("[any]",  2,  13, 17);
	
}

function roomSplashInput(){
	roomMenuGoto();
}

function roomMenuGoto(){
	
	clearScreen();
	room = 0;
	
	drawTitle();
	
	drawText("[1]", 17, 7, 12);
	drawText("[2]", 17, 7, 14);
	drawText("[3]", 17, 25, 12);
	drawText("[4]", 17, 25, 14);
	drawText("[5]", 17, 25, 16);
	drawText("Dungeons" , 9, 11, 12);
	drawText("& Designs", 11, 11, 14);
	//drawText("[0] Levels", 1, 7, 16)
	drawText("Guide"    , 9, 29, 12);
	drawText("Keybinds" , 11, 29, 14);
	drawText("Credits"  , 13, 29, 16);
}

function roomMenuInput(key){
	
	switch (key){
		
		case 49: //'1' - dungeon
			roomCodeGoto();
			break;
		case 50: //'2' - design
			roomDesignGoto();
			break;
		case 51: //'3' - Guide
			roomGuideGoto();
			break;
		case 52: //'4' - keybinds
			roomKeybindGoto();
			break;
		case 53: //'5' - credits
			roomCreditsGoto();
			break;
		
	}
	
}

function roomCodeGoto(){
	
	clearScreen();
	room = 1;
	index = 2;
	
	drawDungeonBorders("Type the Code to Play");
	
	drawDungeonCode();
	drawText(glyphs[0], 17, 9, 5);
	
	fromGlyphs();
	generateNumbers();
	solve = checkDungeonSolve(false);
	drawDungeonSolve();
	
	drawText("[enter]", 17, 5, 13);
	drawText("Play Design", 6, 13, 13);
	drawText("[space]", 17, 5, 15);
	drawText("Next Character", 6, 13, 15);
	drawText("[esc]", 17,  5, 16);
	drawText("Return to Menu",  6, 11, 16);
	
}

function roomCodeInput(key){
	
	if (key==27){roomMenuGoto(); return;}//escape
	
	if (key==9){roomDungeonGotoRandom();}//tab
	
	if (key==10 && solve==1){roomDungeonGotoSeed(); return;}//enter
	
	let x = index%12+7 + ~~((index%12)/4)*3;
	let y = (index<12) ? 5 : 6;
	
	if (key==32){
		drawText(glyphs[index-2], 7, x,y);
		index++
		if (index==24){index = 2;}
		x = index%12+7 + ~~((index%12)/4)*3;
		y = (index<12) ? 5 : 6;
		drawText(glyphs[index-2],17, x,y);
		return;
	}
	
	if (!isCodeCharacter(key)){return;}
	
	glyphs[index-2] = String.fromCharCode(key);
	drawText(glyphs[index-2], 7, x,y);
	index++
	if (index==24){index = 2;}
	x = index%12+7 + ~~((index%12)/4)*3;
	y = (index<12) ? 5 : 6;
	drawText(glyphs[index-2],17, x,y);
	
	fromGlyphs();
	generateNumbers();
	solve = checkDungeonSolve(false);
	drawDungeonSolve();
	
}

function roomDungeonGotoSeed(){
	
	fromGlyphs();
	
	for (let i=0; i<64; i++){
		bE[i] = aE[i];
		if (aE[i]==1){aE[i]=0;}
	}
	for (let i=0; i<16; i++){
		bN[i] = aN[i];
	}
	generateNumbersDungeon();
	solve = checkDungeonSolve(true);
	
	roomDungeonGoto();
	
}

function roomDungeonGotoRandom(){
	
	generateRandomDungeon();
	toGlyphs();
	generateNumbers();
	
	drawDungeonDiagram();
	
	for (let i=0; i<64; i++){
		bE[i] = aE[i];
		//if (aE[i]==1){aE[i]=0;}
	}
	for (let i=0; i<16; i++){
		bN[i] = aN[i];
	}
	
	generateNumbersDungeon();
	solve = checkDungeonSolve(true);
	
	
	
	//roomDungeonGoto();
	
}

function roomDungeonGoto(){
	
	clearScreen();
	room = 2;
	index = 0;
	timer = 0;
	
	drawDungeonBorders("Dungeons & D");
	
	drawDungeonCode();
	drawDungeonDiagram();
	drawDungeonSolve();
	
	drawText("[esc]", 17,  5, 16);
	drawText("Return to Menu.",  6, 11, 16);
	
}

function roomDungeonInput(key){
	
	if (key==27){roomMenuGoto(); return;}	
	
	switch (key){
		case KEY.UP:
			drawDungeonCursor(false);
			index = (index+56)%64;
			drawDungeonCursor(true);
			return;
		case KEY.DOWN:
			drawDungeonCursor(false);
			index = (index+8)%64;
			drawDungeonCursor(true);
			return;
		case KEY.LEFT:
			drawDungeonCursor(false);
			index = (index+63)%64;
			drawDungeonCursor(true);
			return;
		case KEY.RIGHT:
			drawDungeonCursor(false);
			index = (index+1)%64;
			drawDungeonCursor(true);
			return;
			
		case KEY.RESET:
			for (let i=0; i<64; i++){
				if (bE[i]==0 || bE[i]==1){aE[i] = 0;}
			}
			break;
			
		case KEY.WALL:
			if (aE[index]==0){
				aE[index] = 1;
			}else if (aE[index]==1){
				aE[index] = 0;
			}
			break;
		case KEY.MONSTER:
			if (aE[index]==0){
				aE[index] = 4;
			}else if (aE[index]==4){
				aE[index] = 0;
			}
			return;
			
		default: return;
			
	}
	
	generateNumbersDungeon();
	solve = checkDungeonSolve(true);
	
	drawDungeonCode();
	drawDungeonDiagram();
	drawDungeonSolve();
	
	drawDungeonCursor(false);
	
}

function roomDesignGoto(){
	
	clearScreen();
	room = 3;
	index = 0;
	timer = 0;
	
	drawDungeonBorders("D & Designer");
	
	fromGlyphs();
	generateNumbers();
	
	solve = checkDungeonSolve(false);
	
	drawDungeonCode();
	drawDungeonDiagram();
	drawDungeonSolve();
	
	drawText("[esc]", 17,  5, 16);
	drawText("Return to Menu",  6, 11, 16);
	
}

function roomDesignInput(key){
	
	if (key==27){roomMenuGoto(); return;}	
	
	switch (key){
		case KEY.UP:
			drawDungeonCursor(false);
			index = (index+56)%64;
			drawDungeonCursor(true);
			return;
		case KEY.DOWN:
			drawDungeonCursor(false);
			index = (index+8)%64;
			drawDungeonCursor(true);
			return;
		case KEY.LEFT:
			drawDungeonCursor(false);
			index = (index+63)%64;
			drawDungeonCursor(true);
			return;
		case KEY.RIGHT:
			drawDungeonCursor(false);
			index = (index+1)%64;
			drawDungeonCursor(true);
			return;
			
		case KEY.RESET:
			for (let i=0; i<64; i++){
				aE[i] = 0;
				//displayE[i] = 0;
			}
			break;
			
		case KEY.WALL:
			aE[index] = (aE[index] == 1) ? 0 : 1;
			break;
		case KEY.MONSTER:
			aE[index] = (aE[index] == 2) ? 0 : 2
			break;
		case KEY.CHEST:
			aE[index] = (aE[index] == 3) ? 0 : 3;
			break;
			
		default: return;
			
	}
	
	//if wall/monster/chest fo this
	//displayE[index] = aE[index];
	
	toGlyphs();
	generateNumbers();
	solve = checkDungeonSolve(false);
	
	//for (let i=0; i<16; i++){displayN[i] = aN[i];}
	
	drawDungeonCode();
	drawDungeonDiagram();
	drawDungeonSolve();
	
	drawDungeonCursor(false);
	
	save();
	
}

function roomGuideGoto(){
	
	clearScreen();
	room = 4;
	
	drawTitle();
	drawEscape();
	
	drawText("- Use \"Designs\" to make custom D&D levels", 9, 4, 12);
	drawText("- Use the code that automatically generates", 11, 4, 14);
	drawText("  to play and share your creation using \"Dungeons\"", 12, 4, 15);
	
}

function roomGuideInput(key){
	if (key == 27){roomMenuGoto();}
}

function roomKeybindGoto(){
	
	clearScreen();
	room = 5;
	index = 0;
	
	drawTitle();
	drawEscape();
	
	drawBox(10, 12, 11, 5,3);//up
	drawBox(10, 12, 14, 5,3);//down
	drawBox(10,  7, 14, 5,3);//left
	drawBox(10, 17, 14, 5,3);//right
	drawBox(10, 19, 11, 5,3);//reset
	drawBox(10, 25, 13, 5,3);//wall
	drawBox(10, 30, 13, 5,3);//monster
	drawBox(10, 35, 13, 5,3);//chest
	
	drawText(String.fromCharCode(KEY.UP), 17, 14, 12);
	drawText(String.fromCharCode(KEY.DOWN), 4, 14, 15);
	drawText(String.fromCharCode(KEY.LEFT), 4, 9, 15);
	drawText(String.fromCharCode(KEY.RIGHT), 4, 19, 15);
	
	drawText(String.fromCharCode(KEY.RESET), 4, 21, 12);
	
	drawText(String.fromCharCode(KEY.WALL), 4, 27, 14);
	drawText(String.fromCharCode(KEY.MONSTER), 4, 32, 14);
	drawText(String.fromCharCode(KEY.CHEST), 4, 37, 14);
	
	drawText("Now Rebinding", 10, 25, 16);
	drawText("UP", 17, 39, 16);
	
}

function roomKeybindInput(key){
	
	if (key == 27){roomMenuGoto(); return;}
	
	//who needs readable code?
	switch(index++%8){
		case 0: keybindUpdate(key, "UP", "LEFT", 14,12, 9,15); break;
		case 1: keybindUpdate(key, "LEFT", "DOWN", 9,15, 14,15); break;
		case 2: keybindUpdate(key, "DOWN", "RIGHT", 14,15, 19,15); break;
		case 3: keybindUpdate(key, "RIGHT", "RESET", 19,15, 21,12); break;
		case 4: keybindUpdate(key, "RESET", "WALL", 21,12, 27,14); break;
		case 5: keybindUpdate(key, "WALL", "MONSTER", 27,14, 32,14); break;
		case 6: keybindUpdate(key, "MONSTER", "CHEST", 32,14, 37,14); break;
		case 7: keybindUpdate(key, "CHEST", "UP", 37,14, 14,12); break;
	}
	
	save();
	
}

function roomCreditsGoto(){
	
	clearScreen();
	room = 6;
	
	drawTitle();
	
	drawText("D & Designs created by CR-S01", 9, 4, 12);
	drawText("All credit for D & Diagrams go to Iklla Viljakkala  (and Zachtronics of course)", 11, 4, 14);
	drawText("Shoutout to PartyWumpus' exaDOOM for example code", 13, 4, 16);
	drawText("Thanks to whoever plays this, and especially my brother for having to play this :)", 0, 4, 18);
	drawText("And even to you, who is creeping in this code....", 0, 4, 18);
	
	drawEscape();
	drawText("              ",2,41,19);//to cover made by cr-s01
	
}

function roomCreditsInput(key){
	if (key == 27){roomMenuGoto();}
}

/// ----- ----- ----- DRAWING FUNCTIONS ----- ----- -----

function drawTitle(){
	
	drawText("▙▄▄▄▄▄▖ ",9,3,0);
	drawText("▜██▀▀▜▙▖",9,3,1);
	drawText("▐██  ▝▜▙▜▙ ▜▙▜▙▟▙▖▟█▙▟ ▟▛▜▙ ▟▛▜▙▜▙▟▙▖▟▛▀▙", 9,3,2);
	drawText("▐██  ▗▟▛▐█ ▐█▐▛▀▜▌█ ▐▛▐█▛▀▀▐█▌▐█▐▛▀▜▌▀▀▜▙",10,3,3);
	drawText("▟██▄▄▟▛▘▝▜█▛▛▟▌ ▐▙▜██▙ ▜▙▟▛ ▜▙▟▛▟▌ ▐▙▜▙▟▛",13,3,4);
	drawText("▛▀▀▀▀▀▘ ▙▄▄▄▄▄▖   ▙▄▟▛",14,3,5);
	drawText(" ▟▛▜▙   ▜██▀▀▜▙▖          <>",14,3,6);
	drawText(" ▜▙▐▛   ▐██  ▝▜▙ ▟▛▜▙ ▟▛▀▙▜▌▟█▙▟▜▙▟▙▖▟▛▀▙", 14,3,7);
	drawText(" ▟▜▙▟▛▀ ▐██  ▗▟▛▐█▛▀▀ ▀▀▜▙▐▌█ ▐▛▐▛▀▜▌▀▀▜▙",12,3,8);
	drawText(" ▜▄▟▛▜▙ ▟██▄▄▟▛▘ ▜▙▟▛ ▜▙▟▛▐▙▜██▙▟▌ ▐▙▜▙▟▛",11,3,9);
	drawText("        ▛▀▀▀▀▀▘             ▙▄▟▛",10,3,10);
	
	drawText("Made by CR-S01",2,41,19);
	
}

function drawEscape(){
	
	drawText("[esc]", 17,  7, 18);
	drawText("Return to Menu",  6, 13, 18);
	
}

function drawDungeonBorders(text){
	
	//Screen Border
    drawBox(10, 1, 1, 54, 18);
	if (text){drawText(" "+text+" ", 10, 3, 1);}
	
	//Dungeon Border
	drawBox(10, 29, 4, 23, 12);
	drawText("╦═╦═╦═╦═╦═╦═╦═╦═╦═╗", 10, 33, 4);
	drawText("╠═══╬═╩═╩═╩═╩═╩═╩═╩═╩═╣", 10, 29, 6);
	drawText("║", 10, 33, 5);
	drawText("╩", 10, 33, 15);
	for (let i=8; i<16; i++){
		drawText("╠   ╣", 10, 29, i-1);
	}
	
	//Code Border
	drawBox(10, 5, 4, 22, 4);
	drawText("██", 1, 7, 5);
	drawText("-", 10, 12, 5);
	drawText("-", 10, 19, 5);
	drawText("-", 10, 12, 6);
	drawText("-", 10, 19, 6);
	drawText(" Code v1.0 ", 10, 8, 4);
	
	//Solved Border
	drawBox(10, 5, 9, 12, 3)
	
}

function drawDungeonDiagram(){
	
	for (let i=0; i<=63; i++)
	{
		drawText(elementToChar(aE[i]), indexToColor(i,aE[i]), 35+(i%8)*2, 7 + ~~(i / 8));
	}
	
	//Numbers, horizontal then vertical
	for (let i=0; i<8; i++){
		drawText((aN[i]<0) ? -aN[i] : aN[i],(aN[i]<=0) ? 5 : 14, 35+i*2, 5);
	}
	for (let i=8; i<16; i++){
		drawText((aN[i]<0) ? -aN[i] : aN[i],(aN[i]<=0) ? 5 : 14, 31, i-1);
	}
	
}

function drawDungeonCode(){
	
	c = (room==1) ? 7 : 15
	
	drawText(glyphs[0], c,  9, 5);
	drawText(glyphs[1], c, 10, 5);
	for (let i=0; i<4; i++){
		drawText(glyphs[i+2] , c, 14+i, 5);
		drawText(glyphs[i+6] , c, 21+i, 5);
		drawText(glyphs[i+10], c,  7+i, 6);
		drawText(glyphs[i+14], c, 14+i, 6);
		drawText(glyphs[i+18], c, 21+i, 6);
	}
	
}

function drawDungeonCursor(draw){
	
	if (draw){
		drawText("#", 15, 35+(index%8)*2, 7 + ~~(index / 8));
		timer = 25;
	}else{
		drawText(elementToChar(aE[index]), indexToColor(index, aE[index]), 35+(index%8)*2, 7 + ~~(index / 8));
		timer = 0;
	}
	
}

function drawDungeonSolve(){
	
	if (solve=="A"){
		drawText("ERROR: 1", 15, 7, 10);
		return;
	}
	
	if (solve == 1){
		drawText("Solved! ", 15, 7, 10);
	}else{
		drawText("Unsolved", 5, 7, 10);
	}
	
}

/// ----- ----- ----- DUNGEON FUNCTIONS ----- ----- -----

function generateNumbers(){
	
	for (let i=0; i<8; i++){
		let walls = 0;
		for (let j=i; j<64; j+=8){
			if (aE[j]==1){
				walls++;
			}
		}
		aN[i] = walls;
	}
	for (let i=0; i<8; i++){
		let walls = 0;
		for (let j=(i*8); j<(i*8+8); j++){
			if (aE[j]==1){
				walls++;
			}
		}
		aN[i+8] = walls;
	}
	
}

function generateNumbersDungeon(){
	
	for (let i=0; i<8; i++){
		let walls = 0;
		for (let j=i; j<64; j+=8){
			if (aE[j]==1){
				walls++;
			}
		}
		aN[i] = bN[i] - walls;
		if (aN[i] < 0){aN[i] = -bN[i];}
	}
	for (let i=0; i<8; i++){
		let walls = 0;
		for (let j=(i*8); j<(i*8+8); j++){
			if (aE[j]==1){
				walls++;
			}
		}
		aN[i+8] = bN[i+8] - walls;
		if (aN[i+8] < 0){aN[i+8] = -bN[i+8];}
	}
	
}

function checkDungeonSolve(checkPicross){
	
	//CHECK CODE ERRORS
	let digit = glyphs[0].charCodeAt(0);
	
	if (digit < 59){//0-9
		digit = digit + 4;
	}else if (digit < 91){//A-Z
		digit = digit - 39;
	}else if (digit > 96){//A-Z
		digit = digit - 97;
	}else{
		digit = (digit==91) ? 62 : 63;
	}
	
	const b = [];
	b[0] = ((digit & 32)>0);
	b[1] = ((digit & 16)>0);
	b[2] = ((digit & 8 )>0);
	b[3] = ((digit & 4 )>0);
	
	//check we got the right version
	if (b[0]!=0 || b[1]!=0 || b[2]!=0 || b[3] !=0){
		//glyphs[0] = '!';
		return "A";
	}
	
	//CHECK PICROSS
	if (checkPicross){
		for (let i=0; i<16; i++){
			if (aN[i]!=0){return -1}
		}
	}
	
	//initialize flooding array
	let flood = [];
	for (let i=0; i<64; i++){
		flood[i]=100;
	}
	for (let i=0; i<64; i++){
		if (aE[i] != 1){
			flood[i] = 1;
			i=64;
		}
	}
	
	//flood array
	for (let i=1; i<40; i++){
		for (let j=0; j<64; j++){
			if (flood[j]==i){
				
				//up
				if (j>7 && flood[j] < flood[j-8] && aE[j-8]!=1){flood[j-8] = i+1;}
				//down
				if (j<56 && flood[j] < flood[j+8] && aE[j+8]!=1){flood[j+8] = i+1;}
				//left
				if (j%8>0 && flood[j] < flood[j-1] && aE[j-1]!=1){flood[j-1] = i+1;}
				//right
				if (j%8<7 && flood[j] < flood[j+1] && aE[j+1]!=1){flood[j+1] = i+1;}
				
			}
		}
	}
	
	for (let i=0; i<64; i++){
		if (flood[i]!=100){flood[i]=1;}
	}
	
	let tmp;
	
	for (let i=0; i<64; i++){
		//CHECK FLOOD
		if (aE[i]!=1 && flood[i]==100){
			return -2+':'+i+'('+aE[i]+','+flood[i]+')';
		}
		
		//CHECK CHESTS
		if (aE[i] == 3){
			//find room
			//NW, CC
			tmp = 0;
			tmp += 1*(i%8>0 && ~~(i/8)>0 && aE[i-1]%4==0 && aE[i-8]%4==0 && aE[i-9]%4==0);
			tmp += 2*(i%8<7 && ~~(i/8)>0 && aE[i+1]%4==0 && aE[i-8]%4==0 && aE[i-7]%4==0);
			tmp += 4*(i%8<7 && ~~(i/8)<7 && aE[i+1]%4==0 && aE[i+8]%4==0 && aE[i+9]%4==0);
			tmp += 8*(i%8>0 && ~~(i/8)<7 && aE[i-1]%4==0 && aE[i+8]%4==0 && aE[i+7]%4==0);
			//3 6 9 12 15
			//check room
			switch(tmp){
				case 0: case 7: case 11: case 13: case 14: case 5: case 10: 
					return -3;//none
			}
			let tmpX = (((tmp & 9) > 0) ? -1 : 0) + (((tmp & 6)  > 0) ? 1 : 0);
			let tmpY = (((tmp & 3) > 0) ? -1 : 0) + (((tmp & 12) > 0) ? 1 : 0);
			
			if (i%8<0-tmpX){return -3.1;}
			if (i%8>7-tmpX){return -3.2;}
			if (~~(i/8)<0-tmpY){return -3.3;}
			if (~~(i/8)>7-tmpY){return -3.4;}
			
			let tmp2 = 0;
			
			for (let j=-1; j<2; j++){
				for (let k=-1; k<2; k++){
					let I = i+(j+tmpX)+(k+tmpY)*8;
					if (aE[I]==3){tmp2++;}
					if (aE[I]==1 || aE[I]==2){return -3.5+':'+tmpX+'-'+tmpY;;}
				}
			}
			if (tmp2!=1){return -3.6}
			
			//check room walls (exactly one exit)
			tmp2 = 0;
			
			if ((i%8>1-tmpX)){//left walls
				let I = i+tmpX+tmpY*8-2;
				if (aE[I]!=1){tmp2++;}
				if (aE[I-8]!=1){tmp2++;}
				if (aE[I+8]!=1){tmp2++;}
				//aE[4] = 4;
			}
			if ((i%8<6-tmpX)){//right walls
				let I = i+tmpX+tmpY*8+2;
				if (aE[I]!=1){tmp2++;}
				if (aE[I-8]!=1){tmp2++;}
				if (aE[I+8]!=1){tmp2++;}
				//aE[5] = 4;
			}
			if ((~~(i/8)>1-tmpY)){//up walls
				let I = i+tmpX+tmpY*8-16;
				if (aE[I]!=1){tmp2++;}
				if (aE[I-1]!=1){tmp2++;}
				if (aE[I+1]!=1){tmp2++;}
				//aE[6] = 4;
			}
			if ((~~(i/8)<6-tmpY)){//down walls
				let I = i+tmpX+tmpY*8+16;
				if (aE[I]!=1){tmp2++;}
				if (aE[I-1]!=1){tmp2++;}
				if (aE[I+1]!=1){tmp2++;}
				//aE[7] = 4;
			}
			if (tmp2!=1){return -3.7 + ':'+tmp2;}
			
			//remove from flood
			for (let j=-1; j<2; j++){
				for (let k=-1; k<2; k++){
					let I = i+(j+tmpX)+(k+tmpY)*8;
					flood[I] = 2;
					//aE[I] = 4;
				}
			}
		}
		
		//CHECK NO EMPTY DEAD ENDS
		if (aE[i] == 0){
			tmp = 0;
			if (i<8 || aE[i-8]==1){tmp++;}
			if (i>55 || aE[i+8]==1){tmp++;}
			if (i%8==0 || aE[i-1]==1){tmp++;}
			if (i%8==7 || aE[i+1]==1){tmp++;}
			
			if (tmp>=3){//a single empty square would be counted as good otherwise lol
				return -4;
			}
		}
		//CHECK MONSTERS
		if (aE[i] == 2){
			//u,d,l,r
			tmp = 0;
			if (i<8 || aE[i-8]==1){tmp++;}
			if (i>55 || aE[i+8]==1){tmp++;}
			if (i%8==0 || aE[i-1]==1){tmp++;}
			if (i%8==7 || aE[i+1]==1){tmp++;}
			
			if (tmp<3){
				return -5;
			}
		}
	}
	
	//CHECK HALLWAYS
	for (let i=0; i<55; i++){
		if (i%8 == 7){continue;}
		if (flood[i]===1 && flood[i+1]===1 && flood[i+8]===1 && flood[i+9]===1){
			return -6+':'+i;
		}
	}
	
	return 1;
	
}

function resetDungeon(fill){
	
	for (let i=0; i<22; i++){
		glyphs[i] = '#';
	}
	for (let i=0; i<64; i++){
		aE[i] = fill;
	}
	
}

function generateRandomDungeon(){
	
	//initialize arrays
	const rand = [];
	for (let i=0; i<64; i++){
		rand[i] = i;
		aE[i] = -1;
	}
	
	//ez shuffle
	for (let i=0; i<64; i++){
		let j = ~~(Math.random()*64);
		let tmp = rand[i];
		rand[i] = rand[j];
		rand[j] = tmp;
	}
	
	for (let i=0; i<64; i++){
		
		fillArea(" ", 1, 2,19,27,10);
		drawText(rand[i],3,2+3*(i%8),10+~~(i/8));
		
	}
	
	//place chest rooms
	let chests = ~~(Math.random()*8);//between 0 and 7 attempts
	for (let i=0; i<chests; i++){
		let I = rand[i];
		if (aE[I]!=-1){continue;}
		//aE[I] = 2;
		if((I%8>0) && (I%8<7) && (0<~~(I/8)) && (7>~~(I/8))){
			//aE[I] = 3;
			if ((aE[I-9]+aE[I-8]+aE[I-7]+aE[I-1]+aE[I+1]+aE[I+7]+aE[I+8]+aE[I+9])==-8){
				aE[I] = 3;
				aE[I-9] = 4;
				aE[I-8] = 4;
				aE[I-7] = 4;
				aE[I-1] = 4;
				aE[I+9] = 4;
				aE[I+8] = 4;
				aE[I+7] = 4;
				aE[I+1] = 4;
				if (I%8>1){//left
					aE[I-10] = 1;
					aE[I-2] = 1;
					aE[I+6] = 1;
				}
				if (I%8<6){//right
					aE[I+10] = 1;
					aE[I+2] = 1;
					aE[I-6] = 1;
				}
				if (1<~~(I/8)){//up
					aE[I-15] = 1;
					aE[I-16] = 1;
					aE[I-17] = 1;
				}
				if (6>~~(I/8)){//right
					aE[I+15] = 1;
					aE[I+16] = 1;
					aE[I+17] = 1;
				}
			}
		}
	}
	
	return;
	
	//place walls (and hallways ig)
	for (let i=0; i<64; i++){
		let I = rand[i];
		if (aE[I]!=-1){continue;}
		
		tmp = 0;
		tmp += 1*(I%8>0 && ~~(I/8)>0 && aE[I-1]==-1 && aE[I-8]==-1 && aE[I-9]==-1);
		tmp += 2*(I%8<7 && ~~(I/8)>0 && aE[I+1]==-1 && aE[I-8]==-1 && aE[I-7]==-1);
		tmp += 4*(I%8<7 && ~~(I/8)<7 && aE[I+1]==-1 && aE[I+8]==-1 && aE[I+9]==-1);
		tmp += 8*(I%8>0 && ~~(I/8)<7 && aE[I-1]==-1 && aE[I+8]==-1 && aE[I+7]==-1);
		
		if (tmp!=0){
			aE[I]=1;
			continue;
		}
		
		aE[I]=0;
		
		
	}
	
}

/// ----- ----- ----- UTILITY FUNCTIONS ----- ----- -----

function keybindUpdate(key, bind1, bind2, x1,y1, x2,y2){
	
	//so now that I pass a string I need square brackets??
	//as someone who does not code JS
	// 1) I hate these not-array not-object things
	// 2) Thank you so much PartyWumpus, i would have literally never gotten this
	KEY[bind1] = key;
	drawText(String.fromCharCode(KEY[bind1]), 10, x1,y1);
	drawText(String.fromCharCode(KEY[bind2]), 17, x2,y2);
	drawText(bind2 + "     ", 17, 39, 16);
	
}

function toGlyphs(){
	
	const b = [0,0,0,0];
	
	for (let i=0; i<16; i++){
		
		let ii = (i%4)*2 + ~~(i/4)*16
		
		b[i*8+4] = (aE[ii+0]==1 || aE[ii+0]==3);
		b[i*8+5] = (aE[ii+1]==1 || aE[ii+1]==3);
		b[i*8+6] = (aE[ii+8]==1 || aE[ii+8]==3);
		b[i*8+7] = (aE[ii+9]==1 || aE[ii+9]==3);
		
		b[i*8+8] = (aE[ii+0]==2 || aE[ii+0]==3);
		b[i*8+9] = (aE[ii+1]==2 || aE[ii+1]==3);
		b[i*8+10]= (aE[ii+8]==2 || aE[ii+8]==3);
		b[i*8+11]= (aE[ii+9]==2 || aE[ii+9]==3);
		
	}
	for (let i=0; i<22; i++){//22 bits
		
		let j = i*6;
		let digit;
		
		let value = 32*b[j] + 16*b[j+1] + 8*b[j+2] + 4*b[j+3] + 2*b[j+4] + 1*b[j+5];
		if (value < 26){//a-z
			digit = 97 + value;
		}else if(value < 52){//A-Z
			digit = 39 + value;//65-26
		}else if(value < 62){//0-9
			digit = value - 4;//48-52
		}else{
			digit = (value==62) ? 91 : 93
		}
		
		glyphs[i] = String.fromCharCode(digit);
	}
	
	
}

function fromGlyphs(){
	
	const b = [];
	
	for (let i=0; i<22; i++){
		
		let digit = glyphs[i].charCodeAt(0);
		
		if (digit < 59){//0-9
			digit = digit + 4;
		}else if (digit < 91){//A-Z
			digit = digit - 39;
		}else if (digit > 96){//A-Z
			digit = digit - 97;
		}else{
			digit = (digit==91) ? 62 : 63;
		}
		
		b[i*6+0] = ((digit & 32)>0);
		b[i*6+1] = ((digit & 16)>0);
		b[i*6+2] = ((digit & 8 )>0);
		b[i*6+3] = ((digit & 4 )>0);
		b[i*6+4] = ((digit & 2 )>0);
		b[i*6+5] = ((digit & 1 )>0);
		
	}
	
	for (let i=0; i<16; i++){
		
		let ii = (i%4)*2 + ~~(i/4)*16
		
		aE[ii+0] = b[i*8+4]*1 + b[i*8+8]*2;
		aE[ii+1] = b[i*8+5]*1 + b[i*8+9]*2;
		aE[ii+8] = b[i*8+6]*1 + b[i*8+10]*2;
		aE[ii+9] = b[i*8+7]*1 + b[i*8+11]*2;
		
	}
	
}

function elementToChar(e){
	
	switch (e){
		case 0: return "♦";
		case 1: return "█";
		case 2: return "⚉";
		case 3: return "☺";
		case 4: return "─";
		default: return " ";
	}
	
}

function indexToColor(i, e){
	
	return 1+2*((i+~~(i/8))%2) + ((e%4 == 0) ? 0 : 6);
	
}

function save(){
	
	if (typeof _bbs_load !== 'undefined'){
		//in BBS, use new system
		_bbs_save_type('dungeons&designs', 'code', glyphs);
		_bbs_save_type('dungeons&designs', 'keys', JSON.stringify(KEY));
		_bbs_save();
		
	}else{
		//not in BBS, can use old code
		const data = {};
		data.code = glyphs;
		data.keys = KEY;
		saveData(JSON.stringify(data));
		
	}
	
}

function saveOLD(){
	//left in just in case
	const data = {};
	data.code = glyphs;
	data.keys = KEY;
	saveData(JSON.stringify(data));
	
}

function load(){
	
	if (typeof _bbs_load !== 'undefined'){
		//in BBS
		if (!_bbs_load()) {return 0;}
		glyphs	= _bbs_load_type('dungeons&designs', -1, 'code');
		KEY		= _bbs_load_type('dungeons&designs', -1, 'keys');
		
		//deal with a lack of save data the blind way
		if (glyphs === -1){
			glyphs = [
				'a','a',
				'a','a','a','a',
				'a','a','a','a',
				'a','a','a','a',
				'a','a','a','a',
				'a','a','a','a'
			]
		}
		if (KEY === -1){
			KEY = {"UP":119,"DOWN":115,"LEFT":97,"RIGHT":100,
				"WALL":106,"MONSTER":107,"CHEST":108,"RESET":114};
		}else{
			KEY = JSON.parse(KEY);
		}
		
	}else{
		//NOT in BBS
		let json = loadData();
		if (json == ""){
			return false;
		}
	
		const data = JSON.parse(loadData());
		glyphs = data.code;
		KEY = data.keys;
		
	}
}

function loadOLD(){
	//left in just in case
	let json = loadData();
	if (json == ""){
		return false;
	}
	
	const data = JSON.parse(loadData());
	glyphs = data.code;
	KEY = data.keys;
	
}

function isCodeCharacter(c){
	
	if (c>=48 && c<=57) {return true;}
	if (c>=65 && c<=91) {return true;}// also includes '['
	if (c>=97 && c<=122){return true;}
	if (c==93){return true;}// ']'
	
	return false;
}

