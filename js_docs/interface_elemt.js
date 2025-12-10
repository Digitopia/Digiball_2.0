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
/* --------------------------------- */
/* ------ OBJETO FADER DUPLO  ------ */

class Fader {

    constructor(x, y, l) {
        this.x = x;
        this.y = y;
        this.comprimento = l

        this.fsize = constrain(this.comprimento / 20, 10, 20)

        this.fmin_dragging = false;
        this.fmax_dragging = false;

        this.tessituraMax = 14
        this.tessituraMin = -14
        this.fmin_map = 0;
        this.fmax_map = 7;

        this.fmin_x = map(this.fmin_map, this.tessituraMin, this.tessituraMax, this.x, this.x + this.comprimento);
        this.fmax_x = map(this.fmax_map, this.tessituraMin, this.tessituraMax, this.x, this.x + this.comprimento);
    }

    display() {
        stroke(coresInterface.texto)
        fill(coresInterface.texto)
        strokeWeight(2);
        line(this.x, this.y, this.x + this.comprimento, this.y);

        strokeWeight(0);
        rectMode(CENTER)
        rect(this.fmin_x, this.y, this.fsize, this.fsize, 5);
        rect(this.fmax_x, this.y, this.fsize, this.fsize, 5);

        textAlign(LEFT)
        text("tessitura", this.x, this.y + 20);

        textAlign(RIGHT)
        if (this.fmin_map > 0)
            text('+' + this.fmin_map + ' → +' + this.fmax_map, this.x + this.comprimento, this.y + 20);
        else if (this.fmax_map < 0)
            text(this.fmin_map + ' → ' + this.fmax_map, this.x + this.comprimento, this.y + 20);
        else
            text(this.fmin_map + ' → +' + this.fmax_map, this.x + this.comprimento, this.y + 20);

    }

    mousehoverCheck() {
        if (mouseX > this.fmin_x - this.fsize * 1.1 && mouseX < this.fmin_x * 1.1 + this.fsize && mouseY > this.y - this.fsize && mouseY < this.y + this.fsize) {
            cursor(HAND)
            if (mouseIsPressed && mouseX < this.fmax_x - this.fsize && mouseX > this.x) {
                this.fmin_x = mouseX
                this.mappingvaluesMouse();
                this.fmin_dragging = true;
            } else {
                this.fmin_dragging = false;
            }
        }

        if (mouseX > this.fmax_x - this.fsize * 1.1 && mouseX < this.fmax_x + this.fsize * 1.1 && mouseY > this.y - this.fsize && mouseY < this.y + this.fsize) {
            cursor(HAND)
            if (mouseIsPressed && mouseX > this.fmin_x + this.fsize && mouseX < this.x + this.comprimento) {
                this.fmax_x = mouseX
                this.mappingvaluesMouse();
                this.fmax_dragging = true;
            } else {
                this.fmax_draggging = false;
            }
        }
    }

    mappingvaluesMouse() {
        this.fmin_map = round(map(this.fmin_x, this.x, this.x + this.comprimento, this.tessituraMin, this.tessituraMax));
        this.fmax_map = round(map(this.fmax_x, this.x, this.x + this.comprimento, this.tessituraMin, this.tessituraMax));
    }

    mappingvaluesPreset() {
        this.fmin_x = map(this.fmin_map, this.tessituraMin, this.tessituraMax, this.x, this.x + this.comprimento);
        this.fmax_x = map(this.fmax_map, this.tessituraMin, this.tessituraMax, this.x, this.x + this.comprimento);
    }
}

/* ---------------------------- */
/* ------ FUNÇÕES ESCALA ------ */

function escalaDraw() {
    textSize(tSize)
    textAlign(CENTER);
    fill(coresInterface.texto)
    let textoEscala = 'escala ' + escalaDisplay[escalaVal] + ' →'
    text(textoEscala, width / 2, height - 30);


    // para alterar o cursor em hover
    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX > width / 2 - textWidth(textoEscala) / 2 && mouseX < width / 2 + textWidth(textoEscala) / 2 && start)
        cursor(HAND)
}

// para mudar a escala -- através de mousepressed
function escalaMousecheck() {
    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX > width / 2 - width / 12 && mouseX < width / 2 + width / 12 && start) escalaVal++;
    // if (mouseY < height - height / 15 && mouseY > height - height / 15 * 1.5 && mouseX > width / 2 + width / 100 && mouseX < width / 2 + width / 100 * 10) escalaVal++;
    if (escalaVal >= escalaDisplay.length) escalaVal = 0;
    if (escalaVal < 0) escalaVal = escalaDisplay.length - 1;


    // enviar a escala para o RNBO
    const escalaSend = device.parametersById.get("síntese/escala");
    escalaSend.value = escalaVal;

    // device.messageEvent.subscribe((ev) => {
    //     if (ev.tag === "out10") {
    //         faderRange.fmax_map = ev.payload
    //         faderRange.fmin_map  = 0
    //     }
    // });
}


/* ---------------------------- */
/* -------- MAIS INFO --------- */

let maisInfoDisplay = false
let textoinfo =
    "A Digiball Web.App é a interface visual e interativa para o instrumento Digiball. Esta versão está atualmente em desenvolvimento.\n \n A Digiball é um instrumento universal que permite a qualquer pessoa produzir som através do movimento.  \nBasta conectarmos a Digiball a esta interface web através de BLE (bluetooth) – seguir os passos que aparacem no navegador – e usarmos a bola Digiball para a produção de som. \n\n A Digiball Web.App apresenta vários controlos que nos permitem alterar parâmetros sonoros e explorar diferentes escalas. \n Sempre que entramos no website encontramos quatro presets disponíveis e a possibilidade de os alterar momentânemante através do comando 'gravar preset'. \n\n\n Digitópia 2025"

function maisInfo() {
    textAlign(LEFT);
    fill(coresInterface.texto)

    maisInfoBtn_mousehover()

    // para aparecer o nome do programa no canto superior direito
    textSize(tSize)
    text('DIGIBALL WEB.APP', width / 36, height / 20)


    if (maisInfoDisplay) {
        stroke(150, 150, 0, 220);

        rectMode(CENTER)
        strokeWeight(10)

        fill(coresInterface.infobackground, 200);
        rect(width / 2, height / 2, constrain(width / 1.5, 200, 900), height / 1.5)

        strokeWeight(2)
        textSize(tSize)
        text('x', width / 36, height / 20 + tSize * 1.5)
        fill(coresInterface.infotexto)

        if (width > height)
            textSize(constrain(tSize, 16, 18))
        else if (height - width < 100)
            textSize(constrain(tSize, 14, 18))
        else {
            textSize(constrain(tSize, 12, 18))
        }

        strokeWeight(1)
        text(textoinfo, width / 2 + tSize, height / 2 + tSize, constrain(width / 1.5 - tSize * 2, 200, 900) - tSize, height / 1.5 - tSize * 2);

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
    strokeWeight(3)

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
