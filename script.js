// Lager en variabel for kuben min:
var myGamePiece;
// Lager variabel for vegger:
var myObstacles = [];
// Lager variabel for score:
var myScore;
// Lager en variabel for bakgrunnsmusikk:
var bakgrunnsMusikk;
// DUNK LYD:
var bonkLyd;
var hasPlayedBonk = false; // Forhindrer gjentatt lyd

// Definerer bakgrunnsbildet
var backgroundImage = new Image();
backgroundImage.src = "background.png"; // Antar at "background.png" er bildet ditt

var backgroundX = 0; // Startposisjon for bakgrunnens horisontale plassering
var backgroundSpeed = 1; // Hastighet på bakgrunnens bevegelse







// HJEMME MENYEN!:
// Lager en meny funksjon:
function showMainMenu() {

    
    
    // lager en konteiner for menyen
    let menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    // lager en tittel for spillet
    let gameTitle = document.createElement("h1");
    gameTitle.innerHTML = "Findus Flying Nutz";  // endre dette for å endre tittel:
    gameTitle.classList.add("game-title");
    menuContainer.appendChild(gameTitle);

    // Lager en "play" knapp:
    let playButton = document.createElement("button");
    playButton.innerHTML = "Play";
    playButton.classList.add("play-button");
    menuContainer.appendChild(playButton);

    // Sett inn menybeholderen over lerretet (eller før eksisterende innhold)
    document.body.insertBefore(menuContainer, document.body.firstChild);



    // Lager en klikk event til playknappen.
    playButton.addEventListener("click", function() {
        // Fjerner hjemme menyen
        menuContainer.remove();

        

        // starter spillet.
        startGame();
        // Slår på musikk
        bakgrunnsMusikk.play();{
            console.log("Bakgrunnsmusikken spiller.")
        }
    });
}



// Show the main menu when the page loads
window.onload = function() {
    showMainMenu();

};







// Sound konstruktør for å håndtere musikkavspilling
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    // Spiller lyden
    this.play = function() {
        this.sound.play();
    }

    // Stopper lyden
    this.stop = function() {
        this.sound.pause();
        this.sound.currentTime = 0; // Resetter avspillingen til starten
    }
}

// Bakgrunnsmusikk
var bakgrunnsMusikk;
var audioTriggered = false;

// Trigger audio etter første brukerinteraksjon
function triggerAudioPlayback() {
    if (!audioTriggered) {
        audioTriggered = true;
    }
}

// Legg til event listeners for tastetrykk eller klikk
document.addEventListener("keydown", triggerAudioPlayback);
//document.addEventListener("click", triggerAudioPlayback);



// Her starter jeg spillet:
function startGame(){
    myGameArea.start();  // Kaller på start-funksjonen til myGameArea for å sette opp spilleområdet

    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
    myScore.text = "SCORE: 0";  // Initialiserer score tekst

    // Starter bakgrunnsmusikk:
    bakgrunnsMusikk = new sound("sendmeonmyway.mp3");
    bakgrunnsMusikk.play();  // Spiller av bakgrunnsmusikken

    bonkLyd = new sound("bonk.mp3");
    hasPlayedBonk = false; // Reset dunk-lydstatus

    // Her legger jeg til farge til variabelen min:
    myGamePiece = new component(120, 100, "findus.png", 10, 120, "image");
}




// Her lager jeg mitt spille-område!
let myGameArea = {
    // Lager et nytt canvas-element som er det området der spillet vises
    canvas : document.createElement("canvas"),
    // Funksjon som setter opp spilleområdet når spillet starter
    start: function(){
        this.canvas.width = 880;
        this.canvas.height = 470; 
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);  // Starter spillsløyfen (game loop)

        // Legger til event-lyttere for tastetrykk
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.key] = (e.type == "keydown");
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = (e.type == "keydown");
        });
    },
    // Funksjon for å tømme canvas (clear canvas)
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },


    // Funksjon for å stoppe spillet
    stop: function() {
        // Lager en container for game over-skjermen og knappen
        let gameOverContainer = document.createElement("div");
        gameOverContainer.classList.add("game-over-container");

        // Lager "Game Over"-meldingen
        let h1El = document.createElement("h1");
        h1El.innerHTML = "Game Over!";
        h1El.classList.add("game-over-message");
        gameOverContainer.appendChild(h1El);

        // Lager "Try Again"-knappen
        let tryAgainButton = document.createElement("button");
        tryAgainButton.innerHTML = "Try Again";
        tryAgainButton.classList.add("try-again-button");
        gameOverContainer.appendChild(tryAgainButton);
        
        // Setter game over-containeren over canvasen
        document.body.insertBefore(gameOverContainer, myGameArea.canvas);

        // Legger til event-lytter til "Try Again"-knappen
        tryAgainButton.addEventListener("click", function() {
            // Fjerner game over-containeren og knappen
            gameOverContainer.remove();

            // Tilbakestiller spilltilstanden og starter et nytt spill
            myObstacles = [];
            myGamePiece = null;
            startGame();
        });

        // Stopp bakgrunnsmusikken når spillet stopper
        bakgrunnsMusikk.stop();{
            console.log("Stopper bakgrunnsmusikken gameover.")
        }


        clearInterval(this.interval);  // Stopper spillsløyfen
    }
}




// Her er spillkomponentet mitt (spillerens figur og hindringer)
function component(width, height, color, x, y, type){
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;

    // For å laste inn bilde
    if (this.type == "image") {
        this.image = new Image();  // Lager et nytt bildeobjekt
        this.image.src = color;  // "color"-parameteren er egentlig bildets kilde her (som "findus.png")
    }

    // Funksjon for å tegne objektet på skjermen
    this.update = function(){
        ctx = myGameArea.context;

        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "image" && this.image.complete) { // Sjekker om bildet er lastet
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);  // Tegner bildet
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // Funksjon for å oppdatere posisjonen til objektet
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    
        // Unngå at spilleren flyr over spillområdet.
        if (this.y < 0) {
            this.y = 0;  // Hvis spillerens Y-posisjon er mindre enn 0, sett den til 0 (på toppen av spilleområdet)
        }
    
        // For å unngå at spilleren går under spilleområdet.
        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;  // Hvis spilleren går under, sett spilleren på bunnen
        }
    
        // Unngå at spilleren går ut av spilleområdet til venstre.
        if (this.x < 0) {
            this.x = 0;  // Hvis spillerens X-posisjon er mindre enn 0, sett den til 0 (tilbake i spilleområdet)
        }
    
        // Unngå at spilleren går utenfor på høyre siden av gameArea.
        if (this.x + this.width > myGameArea.canvas.width) {
            this.x = myGameArea.canvas.width - this.width;  // Hvis spilleren går for langt til høyre, legg spilleren på kanten
        }
    }
    

    // Funksjon for å sjekke om et objekt krasjer med et annet
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)){
            crash = false;
        }
        return crash;
    }
}




// Funksjon som oppdaterer spillområdet!
function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // Sjekker om spillerens figur krasjer med noen hindringer
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();  // Stopper spillet om det skjer en kollisjon
            return;
        } 
    }




    // Tømmer canvas for å tegne på nytt
    myGameArea.clear();

    // Oppdaterer bakgrunnsposisjonen for å få den til å rulle
    backgroundX -= backgroundSpeed;

    // Hvis bakgrunnen har beveget seg helt ut av skjermen, sett den tilbake til startposisjonen
    if (backgroundX <= -myGameArea.canvas.width) {
        backgroundX = 0;
    }

    // Tegner bakgrunnen
    myGameArea.context.drawImage(backgroundImage, backgroundX, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    myGameArea.context.drawImage(backgroundImage, backgroundX + myGameArea.canvas.width, 0, myGameArea.canvas.width, myGameArea.canvas.height);

    myGameArea.frameNo += 1;  // Øker frame-telleren (bare én gang)

    // Sjekker om vi skal lage nye hindringer
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        
        // REDIGER DENNE HER FOR Å GJØRE VANSKELIGERE!:
        minGap = 115;
        maxGap = 200; 
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        // Lager nye hindringer
        myObstacles.push(new component(20, height, "green", x, 0));
        myObstacles.push(new component(20, x - height - gap, "green", x, height + gap));
    }

    // Oppdaterer posisjonen og tegner hindringene
    for (i = 0; i < myObstacles.length; i++) {
        // Gjør spillet progresivt vanskelig:
        if (myGameArea.frameNo > 8000) {
            myObstacles[i].x += -20;  // Beveger hindringene raskere etter score > 8000
        } else if (myGameArea.frameNo > 7500) {
            myObstacles[i].x += -19;  // Beveger hindringene raskere etter score > 7500 etc. etc.
        } else if (myGameArea.frameNo > 7000) {
            myObstacles[i].x += -18;  
        } else if (myGameArea.frameNo > 6500) {
            myObstacles[i].x += -17;  
        } else if (myGameArea.frameNo > 6000) {
            myObstacles[i].x += -16;  
        } else if (myGameArea.frameNo > 5500) {
            myObstacles[i].x += -15; 
        } else if (myGameArea.frameNo > 5000) {
            myObstacles[i].x += -14;  
        } else if (myGameArea.frameNo > 4500) {
            myObstacles[i].x += -13;  
        } else if (myGameArea.frameNo > 4000) {
            myObstacles[i].x += -12;  
        } else if (myGameArea.frameNo > 3500) {
            myObstacles[i].x += -11;  
        } else if (myGameArea.frameNo > 3000) {
            myObstacles[i].x += -10; 
        } else if (myGameArea.frameNo > 2500) {
            myObstacles[i].x += -9;   
        } else if (myGameArea.frameNo > 2000) {
            myObstacles[i].x += -8;  
        } else if (myGameArea.frameNo > 1500) {
            myObstacles[i].x += -7;   
        } else if (myGameArea.frameNo > 1000) {
            myObstacles[i].x += -6;   
        } else if (myGameArea.frameNo > 500) {
            myObstacles[i].x += -5;  
        } else {
            myObstacles[i].x += -4;   // Standard hastighet for hindringene
        }
    
        myObstacles[i].update();
    }

    // Oppdaterer spillerens posisjon
    myGamePiece.newPos();    
    myGamePiece.update();

    // Legger til hastighet når jeg ikke trykker noe
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // Beveger figuren når tastepilene blir trykket
    if (myGameArea.keys && myGameArea.keys["ArrowLeft"]) { myGamePiece.speedX = -2 } // Venstre
    if (myGameArea.keys && myGameArea.keys["ArrowRight"]) { myGamePiece.speedX = 2 }  // Høyre
    if (myGameArea.keys && myGameArea.keys["ArrowUp"]) { myGamePiece.speedY = -2 } // Opp
    if (myGameArea.keys && myGameArea.keys["ArrowDown"]) { myGamePiece.speedY = 2 }  // Ned

    // Beveger figuren når WASD blir trykket:
    if (myGameArea.keys && myGameArea.keys["a"]) { myGamePiece.speedX = -2 } // Venstre (A)
    if (myGameArea.keys && myGameArea.keys["d"]) { myGamePiece.speedX = 2 }  // Høyre (D)
    if (myGameArea.keys && myGameArea.keys["w"]) { myGamePiece.speedY = -2 } // Opp (W)
    if (myGameArea.keys && myGameArea.keys["s"]) { myGamePiece.speedY = 2 }  // Ned (S)

    // Oppdaterer score-visningen
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();





    // Oppdaterer posisjonen til spilleren
    myGamePiece.newPos();
    myGamePiece.update();




    // Sjekker om spillerens figur krasjer med noen hindringer
    var collision = false;
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            collision = true;
        } 
    }    


    // FÅR AT BONK LYDEN SKAL FUNKE!:

    if (collision) {
        if (!hasPlayedBonk) { // Spiller lyden kun hvis den ikke har blitt spilt allerede
            bonkLyd.play();{
                console.log("Spiller bonk-lyd.")
            }
            hasPlayedBonk = true; // Hindrer gjentatt lyd
        }
        myGameArea.stop(); // Stopper spillet
        return;
    } else {
        hasPlayedBonk = false; // Nullstiller slik at dunk-lyd kan spilles ved neste kollisjon
    }
}




// Funksjon som bestemmer om vi skal lage hindringer basert på interval
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
