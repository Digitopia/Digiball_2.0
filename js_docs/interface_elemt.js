/* ------ CLASSE DOS KNOBS USADOS PARA ALTERAÇÕES DE PARÂMETROS ------ */

class Knob {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.raio = width / 40;
        this.r = constrain(this.raio, 35, 60)
        this.dragging = false;

        this.angle = 0;
        this.newAngle = -2;
        this.calcAngle = 0;
        this.newCalcAngle = 0;
        this.writtenValue = 0;

        this.dx = 0;
        this.dy = 0;

    }

    mousecheck() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.r) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
        }
    }

    // para alterar o cursor
    mousehover() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.r) {
            cursor(HAND)
        }
    }

    changeValue() {
        // Is it being dragged?
        if (this.dragging) {
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
            let mouseAngle = atan2(this.dy, this.dx);
            // angle = mouseAngle - offsetAngle;
            this.angle = mouseAngle;
        }

        this.calcAngle = int(degrees(this.angle)) + 179 + 90;

        if (this.calcAngle > 360) this.calcAngle -= 360;

        if (this.calcAngle <= 315 && this.calcAngle >= 45) {
            if (
                (this.newCalcAngle >= 50 && this.newCalcAngle <= 310) ||
                (this.newCalcAngle <= 50 && this.calcAngle <= 310) ||
                (this.newCalcAngle >= 310 && this.calcAngle >= 50)
            ) {
                this.newAngle = this.angle;
                this.newCalcAngle = this.calcAngle;
            }
        }
    }

    display(minVal, maxVal, nomes, legenda) {
        noFill(0);
        drawingContext.filter = "blur(0px)";
        stroke(coresInterface.texto);

        // Draw ellipse for knob
        push();
        strokeWeight(1.5);
        translate(this.x, this.y);
        rotate(0);

        arc(0, 0, this.r, this.r, -4, 7.2);
        rotate(this.newAngle);
        line(this.r / 5, 0, this.r / 2 + this.r / 5, 0);
        pop();

        let min = minVal;
        let max = maxVal;
        let displayValue = nomes;
        let textoLegenda = legenda;

        this.writtenValue = round(map(this.newCalcAngle, 45, 315, min, max));

        textAlign(CENTER);
        fill(coresInterface.texto)
        noStroke()
        textSize(this.r / 4.2)
        text(displayValue[this.writtenValue], this.x, this.y + this.r / 2);

        textAlign(LEFT);
        text(textoLegenda, this.x + this.r / 1.5, this.y + this.r / 2);
    }
}

/* ---------------------------- */
/* ------ FUNÇÕES ESCALA ------ */

function escalaDraw() {
    textSize(tSize)
    textAlign(CENTER);
    fill(coresInterface.texto)
    text('escala ' + escalaDisplay[escalaVal] + ' →', width / 2, height - 30);


    // para alterar o cursor em hover
    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX > width / 2 - width / 12 && mouseX < width / 2 + width / 12 && start)
        cursor(HAND)
}

// para mudar a escala -- através de mousepressed
function escalaMousecheck() {
    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX > width / 2 - width / 12 && mouseX < width / 2 + width / 12 && start) escalaVal++;
    // if (mouseY < height - height / 15 && mouseY > height - height / 15 * 1.5 && mouseX > width / 2 + width / 100 && mouseX < width / 2 + width / 100 * 10) escalaVal++;
    if (escalaVal >= escalaDisplay.length) escalaVal = 0;
    if (escalaVal < 0) escalaVal = escalaDisplay.length - 1;


    //enviar a escala para o RNBO
    //const escalaSend = device.parametersById.get("síntese/escala");
    // escalaSend.value = escalaVal;

    device.messageEvent.subscribe((ev) => {
        if (ev.tag === "out10") {
            knobRangeUp.angle = map(ev.payload, 0, 13, -3.6, 0.7)
            knobRangeDown.angle = 0.7;
        }
    });
}


/* ---------------------------- */
/* -------- MAIS INFO --------- */

let maisInfoDisplay = false
let textoinfo =
    "texto textotextotextotextotextotexto textotext totextotextotextotextotexto xtotextotext.  xtotextotext. xtotextotextxtotextotext"

function maisInfo() {
    textAlign(LEFT);
    fill(coresInterface.texto)

    maisInfoBtn_mousehover()

    // para aparecer o nome do programa no canto superior direito
    textSize(tSize)
    text('DIGIBALL WEB.APP', width / 36, height / 20)


    if (maisInfoDisplay) {
        textSize(tSize * 1.25)
        stroke(150, 150, 0, 220);

        rectMode(CENTER)
        strokeWeight(10)

        fill(coresInterface.infobackground, 200);
        rect(width / 2, height / 2, width / 1.5, height / 1.5)

        strokeWeight(3)
        text('x', width / 36, height / 20 + tSize * 1.5)
        fill(coresInterface.infotexto)
        text(textoinfo, width / 2, height / 2, width / 1.5 - tSize * 2, height / 1.5 - tSize * 2);

        blackwhite()
    } else {
        textSize(tSize * 1.5)
        text('+', width / 36, height / 20 + tSize * 1.5)
    }

}

function maisInfoBtn_mousechecked() {
    if (mouseX < width / 36 + tSize && mouseX > width / 36 - tSize && mouseY < height / 20 + tSize * 2.5 && mouseY > height / 20 + tSize * 0.5)
        maisInfoDisplay = !maisInfoDisplay
}

function maisInfoBtn_mousehover() {
    if (mouseX < width / 36 + tSize && mouseX > width / 36 - tSize && mouseY < height / 20 + tSize * 2.5 && mouseY > height / 20 + tSize * 0.5)
        cursor(HAND)
}


// MODO CLARO E MODO ESCURO
function blackwhite() {
    textAlign(CENTER);
    textSize(tSize * 2)
    fill(50)
    text('☾', width / 2 - 25, height / 2 + (height / 1.5 - tSize * 2) / 2 - 25);
    // ellipse(width / 2 - 25, height / 2 + (height / 1.5 - tSize * 2) / 2 - 25, 20, 20);
    fill(245)
    // ellipse(width / 2 + 25, height / 2 + (height / 1.5 - tSize * 2) / 2 - 25, 20, 20);
    text('☀︎', width / 2 + 25, height / 2 + (height / 1.5 - tSize * 2) / 2 - 25);

    if (mouseY > height / 2 + (height / 1.5 - tSize * 2) / 2 - 25 - tSize * 2 && mouseY < height / 2 + (height / 1.5 - tSize * 2) / 2 - 25) {
        // modo claro
        if (mouseX > width / 2 + 25 - 10 && mouseX < width / 2 + 25 + 10) {
            cursor(HAND)
            if (mouseIsPressed) {
                coresInterface.texto = 100
                coresInterface.background = 245;
                coresInterface.infobackground = 220;
                coresInterface.infotexto = 100
            }
        }
        // modo escuro
        if (mouseX > width / 2 - 25 - 10 && mouseX < width / 2 - 25 + 10) {
            cursor(HAND)
            if (mouseIsPressed) {
                coresInterface.texto = 180
                coresInterface.background = 0;
                coresInterface.infobackground = 180;
                coresInterface.infotexto = 0
            }
        }
    }
}
