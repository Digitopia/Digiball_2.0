// MÓDULOS 

let threshold_color = 10; //para só mudar a cor acima de x velocidade midi
let treshold_timer = 300; //? manter este treshold de bangs de novas notas visualmente?


let triggerVals = { bang: 0, newVel: 0, vel: 0, minSize: 0, w: 0, h: 0, g: 0, b: 0, drawADD: 0 }
let droneVals = { w: 0, h: 0, g: 0, b: 0, amp: 0, dist: 0, res: 0 };

//Eventos Out do RNBO -- é chamada no draw
function eventosOuts() {
    device.messageEvent.subscribe((ev) => {
        //console.log(`Received message ${ev.tag}: ${ev.payload}`);

        if (ev.tag === "out3") triggerVals.bang = 1;
        if (ev.tag === "out4") triggerVals.newVel = map(random(0,127), 0, 127, width / 12, width / 7);
        if (ev.tag === "out5") droneVals.amp = ev.payload;
        if (ev.tag === "out6") droneVals.dist = ev.payload;
        if (ev.tag === "out7") droneVals.res = ev.payload;
    });
}

function triggerNotas() {
    //se receber nova nota -- bangNota
    if (triggerVals.newVel == triggerVals.vel && triggerVals.bang == 1) {

        // muda a cor se já tiver passado x tempo e se a vel estiver acima de x
        if (counter - prevCounter > treshold_timer && triggerVals.newVel > threshold_color) {
            threshold_color = width / 10;
            triggerVals.g = random(255);
            triggerVals.b = random(255);
            prevCounter = counter;
        }

        triggerVals.drawADD = random(0.2, 0.5)
        triggerVals.bang = 0;

    }

    // nova nota = novo tamanho
    if (triggerVals.vel != triggerVals.newVel) {
        triggerVals.vel = triggerVals.newVel;
        triggerVals.w = triggerVals.vel;
        triggerVals.h = triggerVals.w;
    }

    //redução gradual da bola (fadeout)
    if (triggerVals.w > triggerVals.minSize) {
        triggerVals.w -= triggerVals.vel / 20
        triggerVals.h = triggerVals.w;
        drawingContext.filter = "blur(2px)";
    } else if (triggerVals.w <= triggerVals.minSize) {
        //quando está no mínimo fica mt blur
        triggerVals.w = triggerVals.minSize;
        triggerVals.h = triggerVals.w;
        drawingContext.filter = "blur(50px)";
    }

    strokeWeight(1);
    stroke(255, triggerVals.g, triggerVals.b, 200);
    fill(255, triggerVals.g, triggerVals.b, 100);
    ellipse(width / 2, height / 2, triggerVals.w, triggerVals.h);
    noFill()

    if (triggerVals.w > triggerVals.minSize) {
        strokeWeight(3)
        drawingContext.filter = "blur(3px)";
        let plus = random(0., 0.15)

        for (let i = 0; i < 5; i++) {
            if (i != 0)
                ellipse(width / 2, height / 2, triggerVals.w * (1 + i * (triggerVals.drawADD + plus)), triggerVals.h * (1 + i * (triggerVals.drawADD + plus)));
        }
    }

}

function drone() {
    droneVals.w = map(droneVals.amp, 0, 1, 0, width);
    droneVals.h = droneVals.w;

    if (droneVals.amp > 0) {
        //Qual o valor máximo e máximo da ressonância? Acertar neste map  e no do video alpha!!
        if (droneVals.b <= 0) b = map(droneVals.res, 0, 1, 0, 255);

        if (droneVals.dist > 0) {
            videoAlpha = map(droneVals.dist, 0, 1, 0, 250) - map(droneVals.amp, 0, 1, 190, 0) - map(droneVals.res, 0, 1, 60, 0);
            if (droneVals.g <= 0) droneVals.g = random(0, map(droneVals.dist, 0, 1, 0, 200));
        } else {
            videoAlpha = 0;
        }

        //video play
        // let img = vid.get();
        // tint(255, videoAlpha); // make the video partially transparent without changing the color
        // image(img, 0, 0)

        if (droneVals.b > 0) droneVals.b -= map(droneVals.res, 0, 1, 1, 3);
        if (droneVals.g > 0) droneVals.g -= map(droneVals.dist, 0, 1, 1, 7);

        //nuvem maior menor e mais opaca conforme som
        noStroke();
        drawingContext.filter = "blur(200px)";
        fill(255, droneVals.g, droneVals.b, map(droneVals.w, 0, width, 50, 200));
        ellipse(width / 2, height / 2, droneVals.w, droneVals.h);
    }
}


