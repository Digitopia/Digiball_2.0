/* VALORES A CONSIDERAR NOS PRESETS

knobNotas.angle = ;
knobOffset.angle = ;
knobTimbreAtq.angle = ;
knobTimeAtq.angle = ;
knobRangeDown.angle = ;
knobRangeUp.angle = ;

escalaVal = ; */
let preset = [];

class Preset {
    constructor(symb, x, y, scale, nota, offset, timbre, ataque, rDown, rUp) {
        this.symb = symb;

        this.x = x;
        this.y = y;

        this.scale = scale;

        this.nota = nota;
        this.offset = offset;
        this.timbre = timbre;
        this.ataque = ataque;

        this.rDown = rDown;
        this.rUp = rUp;

        this.size;

        this.changed = false;
    }

    display(cor, size) {
        this.size = size;
        textAlign(RIGHT);
        fill(cor)
        textSize(size)
        text(this.symb, this.x, this.y)
    }

    run() {
        if (mouseX > this.x - this.size && mouseX < this.x + this.size / 4 && mouseY > this.y - this.size / 2 && mouseY < this.y) {
            cursor(HAND);
            if (mouseIsPressed) {
                escalaVal = this.scale;
                knobNotas.angle = this.nota;
                knobOffset.angle = this.offset;
                knobTimbreAtq.angle = this.timbre;
                knobTimeAtq.angle = this.ataque;
                knobRangeDown.angle = this.rDown;
                knobRangeUp.angle = this.rUp;

                this.changed = true;
            }
        }

    }
}

function presetsDisplay() {
    // constructor(symb, x, y, scale, nota, offset, timbre, ataque, rUp, rDown)
    preset[0] = new Preset('◐', width - width / 22, height - 30, 0, -3.8, -1.6, -3.8, -3.8, 0.70, 1.4);
    preset[1] = new Preset('◒', width - width / 22, height - 30 - tSize * 3, 0, 2.48, -3, -1.6, 3, 0.10, -1.4);
    preset[2] = new Preset('◑', width - width / 22, height - 30 - tSize * 6, 3, -1.8, -1.5, 2.8, -1.8, -3.8, -2);
    preset[3] = new Preset('◓', width - width / 22, height - 30 - tSize * 9, 4, -0.1, -3, 2.8, -3, -0.10, 0.65);

    for (let i = 0; i < preset.length; i++) {
        preset[i].display(coresInterface.texto, tSize * 3);
    }
}

function presetsExect() {
    for (let i = 0; i < preset.length; i++) {
        preset[i].run();


        if (preset[i].changed == true) {
            sendPresRNBO()
            preset[i].changed = false;
        }
    }
}

function sendPresRNBO() {
    const escalaSend = device.parametersById.get("síntese/escala");
    escalaSend.value = escalaVal;

    const fundamentalSend = device.parametersById.get("síntese/fundamental");
    fundamentalSend.value = knobNotas.writtenValue + 60;

    const offsetSend = device.parametersById.get("síntese/offset");
    offsetSend.value = knobOffset.writtenValue - 12;

    const timbreAtqSend = device.parametersById.get("síntese/timbre_ataque");
    timbreAtqSend.value = knobTimbreAtq.writtenValue * 0.1;

    const timeAtqSend = device.parametersById.get("síntese/time_ataque");
    timeAtqSend.value = map(knobTimeAtq.writtenValue, 1, 10, 1, 1000);

    const rangeDownSend = device.parametersById.get("síntese/range_down");
    rangeDownSend.value = knobRangeDown.writtenValue - 14;

    const rangeUpSend = device.parametersById.get("síntese/range_up");
    rangeUpSend.value = knobRangeUp.writtenValue + 1;
}


