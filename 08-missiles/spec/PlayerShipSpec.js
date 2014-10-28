describe("Clase PlayerShip", function(){
    // Una vez comenzado el juego deberá aparecer la nave del jugador en
    // la parte inferior

    // La nave debera moverse a izquierda y derecha con las teclas de las
    // flechas izda y dcha

    var canvas, ctx;

    beforeEach(function(){
	loadFixtures('index.html');

	canvas = $('#game')[0];
	expect(canvas).toExist();

	ctx = canvas.getContext('2d');
	expect(ctx).toBeDefined();

	oldGame = Game;
	SpriteSheet.load (sprites,function(){});
    });

    afterEach(function(){
        Game = oldGame;
    });


    it("draw", function(){
    	//   a) draw llama a SpriteSheet.draw con los parametros adecuados en
    	//      funcion de su posicion
    

	// Comprobamos que draw llama a SpriteSheet.draw con los
	// parametros adecuados
	spyOn(SpriteSheet, "draw");

	// Necesitamos tener Game.width y Game.height para que el
	// constructor de PlayerShip pueda inicializar x e y
	Game = {width: 320, height: 480};

	var miNave = new PlayerShip();

	miNave.draw();

	expect(SpriteSheet.draw).toHaveBeenCalled();
 	expect(SpriteSheet.draw.calls[0].args[1]).toEqual("ship");
 	expect(SpriteSheet.draw.calls[0].args[2]).toEqual(miNave.x);
 	expect(SpriteSheet.draw.calls[0].args[3]).toEqual(miNave.y);
 	expect(SpriteSheet.draw.calls[0].args[4]).toEqual(0);
	
    });


    it("step sin teclas pulsadas", function(){
	// b) Tras llamar a step sin haber pulsado teclas la nave se
	// muestra en el mismo lugar

	// Necesitamos tener Game.width y Game.height para que el
	// constructor de PlayerShip pueda inicializar x e y.  Y
	// necesitamos Geame.keys para saber si se ha pulsado una
	// tecla
	Game = {width: 320, height: 480, keys: {'left': false, 'right': false}};
	
	// Creamos un PlayerShip para testar
	var miNave = new PlayerShip();	

 	miNave.step(1); // Hacemos como que ha pasado 1 segundo
	// Tras step, con Game.keys['left'] == false y Game.keys['right'] == false, 
        // no debe haberse movido, por lo que lo comparamos con la posición x 
        // inicial de PlayerShip
	expect(miNave.x).toEqual(Game.width/2 - miNave.w / 2);


    });


    it("step con tecla left pulsada", function(){
	// c) Tras llamar a step con una flecha pulsada, se actualiza
	//    la posicion de la nave


	// Hacemos que se pulse la tecla left:
	Game = {width: 320, height: 480, keys: {'left': true}};

	// Creamos un PlayerShip para testar
	var miNave = new PlayerShip();

        // La posición inicial es 
        //   Game.width/2 - this.w / 2 == 320/2 -37/2 == 160 - 17.5 = 141.5
	// Si tenemos la tecla izquierda pulsada, yendo a velocidad miNave.maxVel, 
        // tras 0.5s la posición x de la nave debe ser la posición X inicial menos
        // (miNave.maxVel * 0.5s)
        // Como miNave.maxVel == 200, la posición después de 0.5s con la flecha
        // izquierda pulsada ha de ser:
        //   141.5 - 200*0.5 == 41.5

 	miNave.step(0.5); // Hacemos como que ha pasado 0.5s
	expect(miNave.x).toEqual(41.5);

	// Ahora hacemos como que pulsamos la flecha izquierda durante 2s. La nave
        // ha de llegar hasta la izquierda del todo, por tanto la posición x será el
        // extremo izquierdo: x == 0
 	miNave.step(2); // Hacemos como que ha pasado 2s
	expect(miNave.x).toEqual(0);
    });

    it("step con tecla right pulsada", function(){
	// c) Tras llamar a step con una flecha pulsada, se actualiza
	//    la posicion de la nave


	// Hacemos que se pulse la tecla left:
	Game = {width: 320, height: 480, keys: {'right': true}};

	// Creamos un PlayerShip para testar
	var miNave = new PlayerShip();


        // La posición inicial es 
        //   Game.width/2 - this.w / 2 == 320/2 -37/2 == 160 - 17.5 = 141.5
	// Si tenemos la tecla derecha pulsada, yendo a velocidad miNave.maxVel, 
        // tras 0.5s la posición x de la nave debe ser la posición X inicial más
        // (miNave.maxVel * 0.5s)
        // Como miNave.maxVel == 200, la posición después de 0.5s con la flecha
        // izquierda pulsada ha de ser:
        //   141.5 + 200*0.5 == 241.5

 	miNave.step(0.5); // Hacemos como que ha pasado 0.5s
	expect(miNave.x).toEqual(241.5);


	// Ahora hacemos como que pulsamos la flecha derecha durante 2s. La nave
        // ha de llegar hasta la derecha del todo, por tanto la posición x será el
        // límite derecha, menos el ancho de la nave, es decir, Game.width - 37
 	miNave.step(2); // Hacemos como que ha pasado 0.5s
	expect(miNave.x).toEqual(Game.width - 37);

    });

});

