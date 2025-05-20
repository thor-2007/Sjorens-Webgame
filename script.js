// Knapp for å gå fullskjerm!
// Skal være ærlig og si at dette har jeg kopiert mye nettet.
// Her er hvor jeg fant den: https://www.w3schools.com/howto/howto_js_fullscreen.asp

// Opprett en knapp for fullskjerm
// Opprett en knapp for fullskjerm
let fullscreenButton = document.createElement("button");
fullscreenButton.id = "fullscreen-button";
fullscreenButton.innerHTML = "⛶";
document.body.appendChild(fullscreenButton);

// Funksjon for å aktivere/deaktivere fullskjerm
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen(); // Gå i fullskjerm
    } else {
        document.exitFullscreen(); // Avslutt fullskjerm
        console.log("Avslutter fullskjerm.");
    }
}

// Koble funksjonen til knappen
fullscreenButton.addEventListener("click", toggleFullscreen);

// Forhindre at spacebar aktiverer fullskjerm
document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && document.activeElement.id === "fullscreen-button") {
        e.preventDefault(); // Forhindrer at spacebar aktiverer fullskjerm
    }
});




// Definerer alle nødvendige variabler:


var myLasers = []; //Array for å holde alle laserne

//Lager en variabel for highscore:
var highScore = sessionStorage.getItem("highScore") || 0;
var myHighScore; // Komponent for å vise highscore

//lager en variabel for kuben min:
var myGamePiece;
//Lager variabel for vegger:
var myObstacles = [];
//Lager variabel for score:
var myScore;
//Lager en variabel for bakgrunnsmusikk:
var bakgrunnsMusikk;
//DUNK LYD:
var bonkLyd;
var hasPlayedBonk = false; // Forhindrer gjentatt lyd

//Definerer bakgrunnsbildet
var backgroundImage = new Image();
backgroundImage.src = "background.png"; //Antar at "background.png" er bildet ditt
backgroundImage.src = "background.jpg"; //Antar at "background.png" er bildet ditt

var backgroundX = 0; //Startposisjon for bakgrunnens horisontale plassering
var backgroundSpeed = 1; //Hastighet på bakgrunnens bevegelse



















var purpleBoxScore = 0; //Poeng for å skyte lilla bokser






// HJEMME MENYEN!:
// Lager en meny funksjon:
function showMainMenu() {

    
    
    // lager en konteiner for menyen
    let menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    // lager en tittel for spillet
    let gameTitle = document.createElement("h1");
    gameTitle.innerHTML = "Sjørens";  // endre dette for å endre tittel:
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
function startGame() {
    myGameArea.start(); // Kaller på start-funksjonen til myGameArea for å sette opp spilleområdet


    // Opprett spilleren som ett bilde
    myGamePiece = new component(170, 100, "karakter-01.png", 10, 120, "image");





    backgroundSpeed = 1; // Sett tilbake til standard hastighet
    console.log("Restarter hastigheten til bakgrunnen til 1.");



    
    myLasers = []; // Tømmer lasere for å være sikker på at det ikke er noen gamle lasere igjen.

    function shootLaser() {
        let laser = new component(30, 40, "lazer.png", myGamePiece.x + myGamePiece.width, myGamePiece.y + myGamePiece.height / 2 - 5, "image");
        myLasers.push(laser);
    }  

    





















    
    // Sjekk om scoreContainer allerede eksisterer, og opprett det hvis det mangler
    let scoreContainer = document.getElementById("scoreContainer");
    if (!scoreContainer) {
        scoreContainer = document.createElement("div");
        scoreContainer.id = "scoreContainer";
        document.body.appendChild(scoreContainer);
    } else {
        scoreContainer.innerHTML = ""; // Tøm containeren for å unngå duplikater
    }

    // Opprett score display
    let scoreDisplay = document.createElement("div");
    scoreDisplay.id = "scoreDisplay";
    scoreDisplay.innerHTML = "SCORE: 0";

    // Opprett highscore display
    let highScoreDisplay = document.createElement("div");
    highScoreDisplay.id = "highScoreDisplay";
    let savedHighScore = sessionStorage.getItem("highScore") || 0;
    highScoreDisplay.innerHTML = "HIGHSCORE: " + savedHighScore;

    // Append begge til containeren
    scoreContainer.appendChild(scoreDisplay);
    scoreContainer.appendChild(highScoreDisplay);

    // Nullstill score
    myScore = 0;
    document.getElementById("scoreDisplay").innerHTML = "SCORE: 0";

    // Sjekk om purpleBoxScoreDisplay allerede eksisterer, og opprett det hvis det mangler
    let purpleBoxScoreDisplay = document.getElementById("purpleBoxScoreDisplay");
    if (!purpleBoxScoreDisplay) {
        purpleBoxScoreDisplay = document.createElement("div");
        purpleBoxScoreDisplay.id = "purpleBoxScoreDisplay";
        scoreContainer.appendChild(purpleBoxScoreDisplay);
    }
    purpleBoxScore = 0; // Nullstill poengsummen for lilla bokser
    purpleBoxScoreDisplay.innerHTML = "TRASH CLEANED: 0";









    // Opprett purpleBoxHighScoreDisplay
    let purpleBoxHighScoreDisplay = document.createElement("div");
    purpleBoxHighScoreDisplay.id = "purpleBoxHighScoreDisplay";
    let savedPurpleBoxHighScore = sessionStorage.getItem("purpleBoxHighScore") || 0;
    purpleBoxHighScoreDisplay.innerHTML = "TRASH CLEANED HIGHSCORE: " + savedPurpleBoxHighScore;

    scoreContainer.appendChild(purpleBoxHighScoreDisplay);






    




    // Start bakgrunnsmusikk
    if (!bakgrunnsMusikk) {
        bakgrunnsMusikk = new sound("sendmeonmyway.mp3");
    }
    bakgrunnsMusikk.play();

    // Nullstill bonk-lydstatus
    bonkLyd = new sound("bonk.mp3");
    hasPlayedBonk = false;

    
}



// Her lager jeg mitt spille-område!
let myGameArea = {
    // Lager et nytt canvas-element som er det området der spillet vises
    canvas : document.createElement("canvas"),
    // Funksjon som setter opp spilleområdet når spillet starter
    start: function() {
        this.canvas.width = 900;
        this.canvas.height = 470;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20); // Starter spillsløyfen
    
        // Legg til event-lyttere for tastetrykk
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
    // Stopper spillet og fjerner scoretavlen
    stop: function() {
        // Fjerner scoretavlen hvis den eksisterer
        const scoreContainer = document.getElementById('scoreContainer');
        if (scoreContainer) {
            scoreContainer.remove(); // Fjerner hele scoreContainer for å unngå duplikater
        }
    
        // Lager en container for "Game Over"-skjermen og knappen
        let gameOverContainer = document.createElement("div");
        gameOverContainer.classList.add("game-over-container");
    
        // Lager "Game Over"-meldingen
        let h1El = document.createElement("h1");
        h1El.innerHTML = "Game Over!";
        h1El.classList.add("game-over-message");
        gameOverContainer.appendChild(h1El);
    


        // Vis Highscore
        let highScore = sessionStorage.getItem("highScore") || 0;
        let highScoreDisplay = document.createElement("div");
        highScoreDisplay.innerHTML = "HIGHSCORE: " + highScore;
        highScoreDisplay.classList.add("game-over-highscore");
        gameOverContainer.appendChild(highScoreDisplay);

        // Vis Purple Box Highscore
        let purpleBoxHighScore = sessionStorage.getItem("purpleBoxHighScore") || 0;
        let purpleBoxHighScoreDisplay = document.createElement("div");
        purpleBoxHighScoreDisplay.innerHTML = "TRASH CLEANED HIGHSCORE: " + purpleBoxHighScore;
        purpleBoxHighScoreDisplay.classList.add("game-over-purplebox-highscore");
        gameOverContainer.appendChild(purpleBoxHighScoreDisplay);
            



        // Lager "Prøv igjen"-knappen
        let tryAgainButton = document.createElement("button");
        tryAgainButton.innerHTML = "Try Again";
        tryAgainButton.classList.add("try-again-button");
        gameOverContainer.appendChild(tryAgainButton);
    
        // Setter game over-containeren over canvasen
        document.body.insertBefore(gameOverContainer, myGameArea.canvas);
    
        // Legger til event-lytter til "Prøv igjen"-knappen
        tryAgainButton.addEventListener("click", function() {
            // Fjern game over-containeren
            gameOverContainer.remove();
    
            // Nullstill poengsummen for lilla bokser
            purpleBoxScore = 0;
    
            // Opprett scoreContainer på nytt
            let scoreContainer = document.createElement("div");
            scoreContainer.id = "scoreContainer";
            document.body.appendChild(scoreContainer);
    
            // Opprett purpleBoxScoreDisplay på nytt
            let purpleBoxScoreDisplay = document.createElement("div");
            purpleBoxScoreDisplay.id = "purpleBoxScoreDisplay";
            purpleBoxScoreDisplay.innerHTML = "TRASH CLEANED: 0";
            scoreContainer.appendChild(purpleBoxScoreDisplay);
    
            // Nullstill andre variabler
            myObstacles = []; // Tøm hindringer
            myLasers = []; // Tøm lasere
            myGamePiece = null; // Nullstill spilleren
    
            // Nullstill frame-telleren
            myGameArea.frameNo = 0;
    
            // Tøm canvas
            myGameArea.clear();
    
            // Start spillet på nytt
            startGame();
        });
    
        // Stopper bakgrunnsmusikken når spillet stopper
        if (bakgrunnsMusikk) {
            bakgrunnsMusikk.stop();
            console.log("Stopper bakgrunnsmusikken gameover.");
        }
    
        // Stopper spillsløyfen
        clearInterval(this.interval);
    }




    
}




// Her er spillkomponentet mitt (spillerens figur og hindringer)
function component(width, height, color, x, y, type){
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;










    if (this.type == "image") {
        this.image = new Image();  // Lager et nytt bildeobjekt
        this.image.src = color;  // "color"-parameteren er egentlig bildets kilde her (som "karakter-01.png")
    }
    
    // Funksjon for å tegne objektet på skjermen
    this.update = function() {
        ctx = myGameArea.context;
    
        if (this.type == "image" && this.image.complete) { // Sjekker om bildet er lastet
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);  // Tegner bildet
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height); // Tegner en rektangel hvis bildet ikke er lastet
        }
    };












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
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
    
        return !(mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright);
    };
}




// Funksjon som oppdaterer spillområdet!
function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // Update the purpleBoxScoreDisplay element
    let purpleBoxScoreDisplay = document.getElementById("purpleBoxScoreDisplay");
    if (purpleBoxScoreDisplay) {
        purpleBoxScoreDisplay.innerHTML = "TRASH CLEANED: " + purpleBoxScore;
    }




    let purpleBoxHighScoreDisplay = document.getElementById("purpleBoxHighScoreDisplay");
    let purpleBoxHighScore = parseInt(sessionStorage.getItem("purpleBoxHighScore")) || 0; // Hent highscore fra sessionStorage
    if (purpleBoxScore > purpleBoxHighScore) {
        sessionStorage.setItem("purpleBoxHighScore", purpleBoxScore); // Oppdater sessionStorage
        if (purpleBoxHighScoreDisplay) {
            purpleBoxHighScoreDisplay.innerHTML = "TRASH CLEANED HIGHSCORE: " + purpleBoxScore; // Oppdater display
        }
    }



    

    // Om du leser dette Johannes, så vil jeg bare si at jeg beklager.
    // Jeg vet at det er litt rotete men det funker :)


    // Oppdaterer bakgrunnsposisjonen for å få den til å rulle
    if (myGameArea.frameNo > 500) {
        backgroundSpeed = 2; // Øk hastigheten etter 500 frames
    }
    if (myGameArea.frameNo > 1000) {
        backgroundSpeed = 2.05; // Øk hastigheten etter 1000 frames
    }
    if (myGameArea.frameNo > 1500) {
        backgroundSpeed = 2.1; // Øk hastigheten etter 1500 frames
    }
    if (myGameArea.frameNo > 2000) {
        backgroundSpeed = 2.15; // Øk hastigheten etter 2000 frames
    }
    if (myGameArea.frameNo > 2500) {
        backgroundSpeed = 2.2; // Øk hastigheten etter 2500 frames
    }
    if (myGameArea.frameNo > 3000) {
        backgroundSpeed = 2.25; // Øk hastigheten etter 3000 frames
    }
    if (myGameArea.frameNo > 4000) {
        backgroundSpeed = 2.3; // Øk hastigheten etter 4000 frames
    }
    if (myGameArea.frameNo > 5000) {
        backgroundSpeed = 2.35; // Øk hastigheten etter 5000 frames
    }
    if (myGameArea.frameNo > 6000) {
        backgroundSpeed = 2.4; // Øk hastigheten etter 6000 frames
    }
    if (myGameArea.frameNo > 7000) {
        backgroundSpeed = 2.45; // Øk hastigheten etter 7000 frames
    }
    if (myGameArea.frameNo > 8000) {
        backgroundSpeed = 2.5; // Øk hastigheten etter 8000 frames
    }

    // Oppdaterer bakgrunnsposisjonen
    backgroundX -= backgroundSpeed;

    // Hvis bakgrunnen har beveget seg helt ut av skjermen, sett den tilbake til startposisjonen
    if (backgroundX <= -myGameArea.canvas.width) {
        backgroundX = 0;
    }

    // Tegner bakgrunnen
    myGameArea.context.drawImage(backgroundImage, backgroundX, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    myGameArea.context.drawImage(backgroundImage, backgroundX + myGameArea.canvas.width, 0, myGameArea.canvas.width, myGameArea.canvas.height);



















    // Sjekker om spillerens figur krasjer med noen hindringer
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();  // Stopper spillet om det skjer en kollisjon
            return;
        } 
    }

    
    // Oppdaterer og tegner lasere
    for (let i = 0; i < myLasers.length; i++) {
        myLasers[i].x += 5; // Juster hastigheten på laseren
        myLasers[i].update();
    }

    // Fjern lasere som har gått ut av skjermen
    myLasers = myLasers.filter(laser => laser.x < myGameArea.canvas.width && laser.x + laser.width > 0);


    
                
            
    
    

        for (let i = myLasers.length - 1; i >= 0; i--) {
            for (let j = myObstacles.length - 1; j >= 0; j--) {
                if (myLasers[i].crashWith(myObstacles[j])) {
                    console.log("Hindring truffet:", myObstacles[j]); // mer debugging blah blah
                    




                    // Hvis det er en target (søppel-bilde), legg til poeng
                    if (myObstacles[j].canBeDestroyed) {
                        purpleBoxScore += 1;
                        document.getElementById("purpleBoxScoreDisplay").innerHTML = "TRASH CLEANED: " + purpleBoxScore;
                        console.log("Target truffet! Ny score:", purpleBoxScore); // Debugging
                    }

                    // Fjern laseren
                    myLasers.splice(i, 1);

                    // Hvis boksen kan ødelegges, fjern den
                    if (myObstacles[j].canBeDestroyed) {
                        myObstacles.splice(j, 1);
                    }

                    break; // Avslutt den indre løkken for å unngå flere treff
                }
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

    myGameArea.frameNo += 1;  // Øker frame-telleren (bare en gang)

    // Sjekker om vi skal lage nye hindringer
    if (myGameArea.frameNo == 1 || everyinterval(150)) { //Rediger denne for å få hindringene til å dukke opp oftere!
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        
        // REDIGER DENNE HER FOR Å GJØRE VANSKELIGERE!:
        minGap = 115;
        maxGap = 200; 
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        // Lager nye hindringer
        myObstacles.push(new component(20, height, "teal", x, 0));
        myObstacles.push(new component(20, x - height - gap, "teal", x, height + gap));
            
        
    

    // Grønne hindringer (skal IKKE kunne skytes)
    myObstacles.push(Object.assign(new component(20, height, "teal", x, 0), { canBeDestroyed: false }));
    myObstacles.push(Object.assign(new component(20, x - height - gap, "teal", x, height + gap), { canBeDestroyed: false }));

    // Lag flere lilla hindringer hver 50. frame
    if (myGameArea.frameNo % 50 === 0) {
        for (let i = 0; i < 3; i++) {
            let attempts = 0;
            let maxAttempts = 10;
            let newBox;
            let overlaps;



            
    
            let trash = ["søppel 1.png", "søppel 2.png", "søppel 3.png", "søppel 4.png"];

            do {
                let y = Math.floor(Math.random() * (myGameArea.canvas.height - 50));
                // Velg et tilfeldig bilde fra trash-arrayen
                let randomIndex = Math.floor(Math.random() * trash.length);
                let trashImage = trash[randomIndex];
                // Lag en hinder med bilde
                newBox = Object.assign(
                    new component(60, 60, trashImage, myGameArea.canvas.width, y, "image"),
                    { canBeDestroyed: true }
                );

                overlaps = myObstacles.some(obstacle => {
                    return (
                        newBox.x < obstacle.x + obstacle.width &&
                        newBox.x + newBox.width > obstacle.x &&
                        newBox.y < obstacle.y + obstacle.height &&
                        newBox.y + newBox.height > obstacle.y
                    );
                });

                attempts++;
            } while (overlaps && attempts < maxAttempts);
    





            
            // Legg til boksen hvis det ikke er overlapp
            if (!overlaps) {
                myObstacles.push(newBox);
            }
        }
    }


    }
    
    
    
     
    // Oppdaterer posisjonen og tegner hindringene
    for (i = 0; i < myObstacles.length; i++) {
        // Gjør spillet progresivt vanskelig:
        if (myGameArea.frameNo > 9000) {
            myObstacles[i].x += -24;  // Beveger hindringene raskere etter score > 9000
        } else if (myGameArea.frameNo > 8500) {
            myObstacles[i].x += -23;  // Beveger hindringene raskere etter score > 8500 etc. etc.
        } else if (myGameArea.frameNo > 8000) {
            myObstacles[i].x += -22; 
        } else if (myGameArea.frameNo > 7500) {
            myObstacles[i].x += -21;  
        } else if (myGameArea.frameNo > 7000) {
            myObstacles[i].x += -20;  
        } else if (myGameArea.frameNo > 6500) {
            myObstacles[i].x += -19;  
        } else if (myGameArea.frameNo > 6000) {
            myObstacles[i].x += -18;  
        } else if (myGameArea.frameNo > 5500) {
            myObstacles[i].x += -17; 
        } else if (myGameArea.frameNo > 5000) {
            myObstacles[i].x += -16;  
        } else if (myGameArea.frameNo > 4500) {
            myObstacles[i].x += -15;  
        } else if (myGameArea.frameNo > 4000) {
            myObstacles[i].x += -14;  
        } else if (myGameArea.frameNo > 3500) {
            myObstacles[i].x += -13;  
        } else if (myGameArea.frameNo > 3000) {
            myObstacles[i].x += -12; 
        } else if (myGameArea.frameNo > 2500) {
            myObstacles[i].x += -11;   
        } else if (myGameArea.frameNo > 2000) {
            myObstacles[i].x += -10;  
        } else if (myGameArea.frameNo > 1500) {
            myObstacles[i].x += -9;   
        } else if (myGameArea.frameNo > 1000) {
            myObstacles[i].x += -8;   
        } else if (myGameArea.frameNo > 500) {
            myObstacles[i].x += -7;  
        } else {
            myObstacles[i].x += -6;   // Standard hastighet for hindringene
        }
    
        myObstacles[i].update();
    }

    // Oppdaterer spillerens posisjon
    myGamePiece.newPos();    
    myGamePiece.update();

    // Legger til hastighet når jeg ikke trykker noe
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // HER KAN JEG JUSTERE HASTIGHETEN PÅ SPILLEREN:


    // Beveger figuren når tastepilene blir trykket
    if (myGameArea.keys && myGameArea.keys["ArrowLeft"]) { myGamePiece.speedX = -2.4 } // Venstre
    if (myGameArea.keys && myGameArea.keys["ArrowRight"]) { myGamePiece.speedX = 2.4 }  // Høyre
    if (myGameArea.keys && myGameArea.keys["ArrowUp"]) { myGamePiece.speedY = -2.4 } // Opp
    if (myGameArea.keys && myGameArea.keys["ArrowDown"]) { myGamePiece.speedY = 2.4 }  // Ned

    // Beveger figuren når WASD blir trykket:
    if (myGameArea.keys && myGameArea.keys["a"]) { myGamePiece.speedX = -2.4 } // Venstre (A)
    if (myGameArea.keys && myGameArea.keys["d"]) { myGamePiece.speedX = 2.4 }  // Høyre (D)
    if (myGameArea.keys && myGameArea.keys["w"]) { myGamePiece.speedY = -2.4 } // Opp (W)
    if (myGameArea.keys && myGameArea.keys["s"]) { myGamePiece.speedY = 2.4 }  // Ned (S)

    

        // Oppdaterer og tegner lasere
    for (let i = 0; i < myLasers.length; i++) {
        myLasers[i].x += 5; // Juster hastigheten på laseren
        myLasers[i].update();
    }

    // Fjern lasere som har gått ut av skjermen
    myLasers = myLasers.filter(laser => laser.x < myGameArea.canvas.width);




    // Update Score
    myScore = myGameArea.frameNo;
    document.getElementById("scoreDisplay").innerHTML = "SCORE: " + myScore;

    // Check and update highscore
    let highScore = sessionStorage.getItem("highScore") || 0;
    if (myScore > highScore) {
        sessionStorage.setItem("highScore", myScore);
        document.getElementById("highScoreDisplay").innerHTML = "HIGHSCORE: " + myScore;
    }

    
        


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


function shootLaser() {
    let laser = new component(30, 40, "lazer.png", myGamePiece.x + myGamePiece.width, myGamePiece.y + myGamePiece.height / 2 - 5, "image");
    myLasers.push(laser);
}

// Fikser rar glitch med at laseret går gjennom søpla når man trykker "try again"..
document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
        shootLaser();
    }
});




// Funksjon som bestemmer om vi skal lage hindringer basert på interval
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

