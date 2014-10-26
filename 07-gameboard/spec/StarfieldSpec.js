//
// Usamos matchers de jasmine: http://pivotal.github.io/jasmine/
// Usamos matchers de jasmine-jquery: https://github.com/velesin/jasmine-jquery
//

describe("Clase Starfield", function(){

    var canvas, ctx;

    beforeEach(function(){
	// Hemos enlazado en jasmine/spec/javascript/fixtures el fichero index.html
	loadFixtures('index.html');

	canvas = $('#game')[0];
	expect(canvas).toExist();

	ctx = canvas.getContext('2d');
	expect(ctx).toBeDefined();

	oldGame = Game;
	Game = {width: 320, height: 480};

    });

    afterEach(function(){
	Game = oldGame;
    }); 

    it("draw + step + draw", function(){
	spyOn(ctx, "drawImage");

	// Ponemos velocidad 1 para testar más fácilmente
	var sf1 = new Starfield(1,0.4,100,true);
	
	sf1.draw(ctx);
	
 	expect(ctx.drawImage.calls[0].args[1]).toBe(0);
 	expect(ctx.drawImage.calls[0].args[2]).toBe(0);
 	expect(ctx.drawImage.calls[0].args[3]).toBe(320);
 	expect(ctx.drawImage.calls[0].args[4]).toBe(480);
 	expect(ctx.drawImage.calls[0].args[5]).toBe(0);
 	expect(ctx.drawImage.calls[0].args[6]).toBe(0);
 	expect(ctx.drawImage.calls[0].args[7]).toBe(320);
 	expect(ctx.drawImage.calls[0].args[8]).toBe(480);

	sf1.step(1); // dt = 1, así offset == dt*speed == 1*1 == 1
	sf1.draw(ctx);
 	expect(ctx.drawImage.calls[1].args[1]).toBe(0);
 	expect(ctx.drawImage.calls[1].args[2]).toBe(479);
  	expect(ctx.drawImage.calls[1].args[3]).toBe(320);
  	expect(ctx.drawImage.calls[1].args[4]).toBe(1);
  	expect(ctx.drawImage.calls[1].args[5]).toBe(0);
  	expect(ctx.drawImage.calls[1].args[6]).toBe(0);
  	expect(ctx.drawImage.calls[1].args[7]).toBe(320);
  	expect(ctx.drawImage.calls[1].args[8]).toBe(1);

 	expect(ctx.drawImage.calls[2].args[1]).toBe(0);
 	expect(ctx.drawImage.calls[2].args[2]).toBe(0);
  	expect(ctx.drawImage.calls[2].args[3]).toBe(320);
  	expect(ctx.drawImage.calls[2].args[4]).toBe(479);
  	expect(ctx.drawImage.calls[2].args[5]).toBe(0);
  	expect(ctx.drawImage.calls[2].args[6]).toBe(1);
  	expect(ctx.drawImage.calls[2].args[7]).toBe(320);
  	expect(ctx.drawImage.calls[2].args[8]).toBe(479);

    });

});

