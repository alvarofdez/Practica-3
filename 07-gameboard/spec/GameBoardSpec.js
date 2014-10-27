/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("Clase GameBoardSpec", function(){
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
	
	//Test add
	it("add", function(){ 
		var board = new GameBoard();
		spyOn(board,"add").andCallThrough();
		var obj = {x: 0, y: 0};
		board.add(obj);
		expect (board.add).toHaveBeenCalled();
		expect (board.objects[0]).toEqual(obj);
	});

	//Test remove / resetRemoved / finalizeRemoved
	it("remove / resetRemoved / finalizeRemoved", function(){ 
		var board = new GameBoard();
		spyOn(board, "remove").andCallThrough();
		spyOn(board, "resetRemoved").andCallThrough();
		spyOn(board, "finalizeRemoved").andCallThrough();
		var obj = {x: 0, y: 0};
		//resetRemoved
		board.resetRemoved();
		expect (board.resetRemoved).toHaveBeenCalled();
		var emptyArry = [];
		expect (board.removed).toEqual (emptyArry);
		board.remove(obj);
		expect (board.removed[0]).toEqual(obj); //removed no vacio
		board.resetRemoved();
		expect (board.removed).toEqual (emptyArry); //removed vacio
		//remove
		board.remove(obj);
		expect (board.remove).toHaveBeenCalled();
		expect (board.removed[0]).toEqual(obj);
		//finalizeRemoved
		board.resetRemoved();
		board.add (obj); //añadimos algo a objects para que se borre
		expect (board.objects[0]).toEqual(obj);
		board.remove(obj);	
		expect (board.objects[0]).toEqual(obj); //obj sigue estando en objects
		expect (board.removed[0]).toEqual(obj);
		board.finalizeRemoved();
		expect (board.finalizeRemoved).toHaveBeenCalled();
		expect (board.objects[0]).toEqual(undefined); //objects esta vacio
	});
	
	//iterate
	it("iterate", function(){ 
		var board = new GameBoard();
		var empty = function(){this.f = function(){}};
		var e1 = new empty();
		board.add(e1);
		spyOn(e1, "f");
		board.iterate("f");
		expect(e1.f).toHaveBeenCalled();			
	});	
	
	//detect
	it("detect", function(){ 
		var board = new GameBoard();
		var obj1 = {x: 1, y: 0};
		var obj2 = {x: 2, y: 0};
		var obj3 = {x: 3, y: 0};
		board.add(obj1);
		board.add(obj2);
		board.add(obj3);
		var ret = board.detect(function(obj){return this.x === 3})
		expect(ret).toEqual(obj3);
	});	
	
	//step
	it("step", function(){ 
		var board = new GameBoard();
		var obj = {step:function(){}};
		spyOn (obj, "step");
		spyOn (board, "resetRemoved");
		spyOn (board, "finalizeRemoved");
		board.add(obj);
		board.step(1);
		expect(board.resetRemoved).toHaveBeenCalled();
		expect(obj.step).toHaveBeenCalled();
		expect(board.finalizeRemoved).toHaveBeenCalled();
	});
	
	//draw
	it ("draw", function(){
		var board = new GameBoard();
		var obj = {draw: function(){}};
		spyOn(obj, "draw");
		board.add(obj);
		board.draw(ctx);
		expect(obj.draw).toHaveBeenCalled();
	});
	
	//overlap
	it ("overlap", function(){
		var board = new GameBoard();
		var obj1 = {x: 15, y: 15, h:4, w:6};
		var obj2 = {x: 14, y: 16, h:3, w:6};
		expect (board.overlap(obj1, obj2)).toBe(true); //muy juntos
		var obj1 = {x: 35, y: 25, h:4, w:6};
		var obj2 = {x: 14, y: 16, h:3, w:6};
		expect (board.overlap(obj1, obj2)).toBe(false); //muy separados
	});
	
	//collide
	it ("collide", function(){
		var board = new GameBoard();
		var obj1 = {x: 15, y: 15, h:4, w:6};
		var obj2 = {x: 14, y: 16, h:3, w:6};
		var obj3 = {x: 14, y: 16, h:3, w:6};
		board.add(obj1);
		board.add(obj2);
		board.add(obj3);
		expect (board.collide(obj1)).toEqual(obj2);
	});	
	
});


