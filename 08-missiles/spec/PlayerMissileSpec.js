/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/

describe("Clase PlayerMissileSpec", function(){
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
	/*
	//Test step
	it("step", function(){ 
		var missile = new PlayerMissile(10, 20);
		var board = new GameBoard ();
		board.add(missile);
		missile.step(1); //deberia borrarse
		//expect (board.removed[0]).toEqual(missile);
	});
	*/
	//Test draw	
	it("draw", function(){
  	spyOn(SpriteSheet, "draw");
		var missile = new PlayerMissile(10, 20);
		missile.draw(ctx);
		expect(SpriteSheet.draw).toHaveBeenCalled();
	 	expect(SpriteSheet.draw.calls[0].args[1]).toEqual("missile");
	 	expect(SpriteSheet.draw.calls[0].args[2]).toEqual(missile.x);
	 	expect(SpriteSheet.draw.calls[0].args[3]).toEqual(missile.y);
  });

});
