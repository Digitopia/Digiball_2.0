/* ------ MÓDULOS: TRIGGER DE NOTAS e DRONE ------ */

let threshold_color = 50; //para só mudar a cor acima de x velocidade midi
let treshold_timer = 300; //? manter este treshold de bangs de novas notas visualmente?


let triggerVals = { bang: 0, noteX: 0, newVel: 0, vel: 0, minSize: 0, w: 0, h: 0, g: 0, b: 0, drawADD: 0, tempY: 0 }
let droneVals = { w: 0, h: 0, g: 0, b: 0, amp: 0, dist: 0, res: 0 };


//Eventos Out do RNBO -- é chamada no draw
function eventosOuts() {
    device.messageEvent.subscribe((ev) => {
        // console.log(`Received message ${ev.tag}: ${ev.payload}`);

        if (ev.tag === "out3") triggerVals.bang = 1;
        if (ev.tag === "out4") triggerVals.newVel = map(random(0, 127), 0, 127, width / 12, width / 7);
        if (ev.tag === "out5") droneVals.amp = ev.payload[0];
        // console.log(droneVals.amp)

        if (ev.tag === "out6") droneVals.dist = ev.payload[0];
        if (ev.tag === "out7") droneVals.res = ev.payload[0];

        if (ev.tag === "out9") {
            /* o x da representação visual da nota é relativo à altura da nota e o y tem uma aleatoriedade*/
            triggerVals.noteX = map(ev.payload[0], ev.payload[1], ev.payload[2], width / 8, width - width / 8);
            console.log(ev.payload)

            triggerVals.tempY = height / 2 + random(-height / 5, height / 5)
        }

        // console.log(droneVals.amp, droneVals.dist, droneVals.res)
    });
}

function triggerNotas() {
    //se receber nova nota -- bangNota
    if (triggerVals.newVel == triggerVals.vel && triggerVals.bang == 1) {

        // muda a cor se já tiver passado x tempo e se a vel estiver acima de x
        // o counter e prevCounter são iniciados e atualizados na função interfaceSetup() no app.js
        if (counter - prevCounter > treshold_timer && triggerVals.newVel > threshold_color) {
            triggerVals.g = random(255);
            triggerVals.b = random(255);
            prevCounter = counter;
        }

        triggerVals.drawADD = random(0.2, 0.5)

        //reset ao bang
        triggerVals.bang = 0;
    }

    // nova nota = novo tamanho
    if (triggerVals.vel != triggerVals.newVel) {
        triggerVals.vel = triggerVals.newVel;
        triggerVals.w = triggerVals.vel;
        triggerVals.h = triggerVals.w;
    }

    //redução gradual da bola (fadeout) – afeta a ellipse principal e os ecos
    if (triggerVals.w > triggerVals.minSize) {
        triggerVals.w -= triggerVals.vel / 20
        triggerVals.h = triggerVals.w;
    } else if (triggerVals.w <= triggerVals.minSize) {
        //quando está no mínimo fica mt blur
        triggerVals.w = triggerVals.minSize;
        triggerVals.h = triggerVals.w;
        drawingContext.filter = "blur(50px)";
    }

    //cores
    stroke(255, triggerVals.g, triggerVals.b, 200);
    fill(255, triggerVals.g, triggerVals.b, 150);

    // ellipse central
    drawingContext.filter = "blur(3px)";
    strokeWeight(1);
    ellipse(triggerVals.noteX, triggerVals.tempY, triggerVals.w, triggerVals.h);

    // "ecos" da ellipse à volta
    if (triggerVals.w > triggerVals.minSize) {
        noFill()
        strokeWeight(3)
        drawingContext.filter = "blur(3px)";
        let plus = random(0., 0.15)

        for (let i = 0; i < 5; i++) {
            if (i != 0)
                ellipse(triggerVals.noteX, triggerVals.tempY, triggerVals.w * (1 + i * (triggerVals.drawADD + plus)), triggerVals.h * (1 + i * (triggerVals.drawADD + plus)));
        }
    }

}

function drone() {
    droneVals.w = map(droneVals.amp, 0, 1, 0, width);
    // console.log(droneVals.amp, droneVals.dist, droneVals.res)

    droneVals.h = droneVals.w;

    if (droneVals.amp > 0.1 && droneVals.amp < 1.1) {
        droneVals.b = map(droneVals.dist, 0, 1, 0, 250);
        droneVals.g = map(droneVals.res, 0, 1, 0, 255);


        //nuvem maior menor e mais opaca conforme som
        noStroke();
        drawingContext.filter = "blur(200px)";
        fill(200, droneVals.g, droneVals.b, map(droneVals.w, 0, width, 50, 200));
        ellipse(width / 2, height / 2, droneVals.w, droneVals.h);
    } else {
        droneOn = false;
    }
}

/* ----------------------------------------------------------- */
/* ----------------------------------------------------------- */
/* --------- CÓDIGO DE SIMULAÇÕES COM RATO E TECLADO --------- */

let estado_drone = false;
let d;
let full_sim = false;

/* PARA ATIVAR E DESATIVAR SIMULAÇÕES: CARREGAR TECLAS  */
function keyPressed() {

    //simulação visual do ataque
    if (key === 't' && firstClick) {
        triggerVals.bang = 1;
        triggerVals.newVel = map(random(0, 127), 0, 127, width / 12, width / 7);
    }

    //simulação visual do drone
    if (key == 'd') {
        estado_drone = !estado_drone
    }

    //simulação da bola
    if (key === 's') {
        full_sim = !full_sim;

    }
}

//função para visual do drone
function sim_Drone() {
    if (estado_drone)
        d = map(mouseX, 0, width, 0, 1)
    else
        d = 0;

    droneVals.amp = d;
    droneVals.dist = d;
    droneVals.res = d;
}

//função para enviar valores como se fosse a bola
function sim_Full() {
    if (full_sim) {

        let mx = map(mouseX, 0, width, 10, 110);
        let my = map(mouseY, 0, height, 10, 110);

        // este mapping de valores foi criado com tentativa e erro
        const heading = map(mx, 0, 127, -180, 180)
        const roll = map(mx, 0, 127, -180, 180)
        const pitch = map(mx, 0, 127, 0, 360)
        const x = map(mx, 0, 127, -0.1, 0)
        const y = map(my, 0, 127, -0.1, 0)
        const z = map(my, 0, 127, -0.1, 0)


        //criado com base no que acontece no ficheiro bleConnect.js
        let vars = [heading, roll, pitch, x, y, z];

        let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "in1", vars);
        device.scheduleEvent(messageEvent);
    }
}


