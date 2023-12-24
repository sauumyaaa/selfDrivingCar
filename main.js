/*The Canvas API allows JavaScript to draw graphics on the canvas.
The Canvas API can draw shapes, lines, curves, boxes, text, and images,
 with colors, rotations, transparencies, and other pixel manipulations.*/
const carCanvas=document.getElementById("carCanvas");
//accessing canvas element with html dom method getElementById()
carCanvas.width=200; //road
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;//nn visualization

const carCtx = carCanvas.getContext("2d");
//we need to create a 2d context object to draw in the canvas
//The getContext() method returns an object with tools (methods) for drawing.
const networkCtx = networkCanvas.getContext("2d");


// const car=new Car(100,100,30,50);

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=50;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

// function animate(){
//     car.update();
//Canvas.height=window.innerHeight;
//     car.draw(ctx);
//     requestAnimationFrame(animate);
    //it calls animate() method again and again many times per second   
    //gives the illusion of movement that we want
// }

function animate(time){

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    //resizing the canvas here is also clearing the canvas
    networkCanvas.height=window.innerHeight;

    carCtx.save(); 
    //this method of the Canvas 2D API saves the entire
    // state of the canvas by pushing the current state onto a stack.
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
//to specify that the object ..our canvas here.. is translated by given translate amount.
//context.translate(x, y)
// x: It stores the value, that how much the canvas will move left or right means x-axis wise.
// y: It stores the value, that how much the canvas will move up and down means y-axis wise

//so this way we feel that their is a drone filming our car. but actually car is still..only road is moving

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}