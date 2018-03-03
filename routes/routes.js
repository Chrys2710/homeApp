var faker = require("faker");
var ws281x = require('rpi-ws281x-native');

var appRouter = function (app) {



  app.get("/", function (req, res) {
    var data = "<p><button>test</button><p/>";
    res.status(200).send(data);
  });

  app.get("/lightUp/:r/:g/:b/:bright/", function (req, res) {
    var NUM_LEDS = 165;
	var pixelData = new Uint32Array(NUM_LEDS);
	
	var bright = req.params.bright;
	// var bright = 20;
	var r = req.params.r;
	// var r = 0;
	var g = req.params.g;
	// var g = 100;
	var b = req.params.b;
	// var b = 100;

	console.log(bright);

	ws281x.init(NUM_LEDS);
	ws281x.setBrightness(0);
	 
	for (var i = 0; i < NUM_LEDS; i++) {
		pixelData[i] = rgb2Int(r,g,b);
	}

	ws281x.render(pixelData);

	console.log('Leds colored');

	var j = 0, howManyTimes = bright;
	f(j, howManyTimes);
	
	res.status(200).send({ message: 'Leds lighted up' });
  });
  
  app.get("/shutdown/", function (req, res) {
    var NUM_LEDS = 165;
	var pixelData = new Uint32Array(NUM_LEDS);
	
	var bright = 0;
	var r = 0;
	var g = 0
	var b = 0;
	
	console.log(bright);

	ws281x.init(NUM_LEDS);
	 
	for (var i = 0; i < NUM_LEDS; i++) {
		pixelData[i] = rgb2Int(r,g,b);
	}

	ws281x.render(pixelData);

	console.log('Leds colored');
	
	res.status(200).send({ message: 'Leds shutted down' });
  });
  
  app.get("/user", function (req, res) {
    var data = ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
    res.status(200).send(data);
  });

 app.get("/users/:num", function (req, res) {
   var users = [];
   var num = req.params.num;

   if (isFinite(num) && num  > 0 ) {
     for (i = 0; i <= num-1; i++) {
       users.push({
           firstName: faker.name.firstName(),
           lastName: faker.name.lastName(),
           username: faker.internet.userName(),
           email: faker.internet.email()
        });
     }

     res.status(200).send(users);
    
   } else {
     res.status(400).send({ message: 'invalid number supplied' });
   }

 });
}

function f(j, howManyTimes) {
	var date = new Date();
		console.log("let : " + date.toString());
		ws281x.setBrightness(j);
    j++;
    if( j < howManyTimes ){
        setTimeout( function() {
			f(j, howManyTimes);
		}, 30 );
    }
}


function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

module.exports = appRouter;