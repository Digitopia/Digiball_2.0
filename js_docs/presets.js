/* VALORES A CONSIDERAR NOS PRESETS

knobNotas.angle = ;
knobOffset.angle = ;
knobTimbreAtq.angle = ;
knobTimeAtq.angle = ;
knobRangeDown.angle = ;
knobRangeUp.angle = ;

escalaVal = ; */
let preset = [];
let simboloP = ['◐', '◒', '◑', '◓']

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
        this.ativo;
        this.recorded = false;
    }

    display(cor, size) {
        this.size = size;
        textAlign(RIGHT);

        if (this.ativo) {
            strokeWeight(4)
            stroke(80, 50, 255, 200);
            fill(cor)
        } else if (this.recorded) {
            strokeWeight(1)
            stroke(cor);
            fill(80, 50, 255, 150);
        } else {
            strokeWeight(1)
            stroke(cor);
            fill(cor, 50)
        }

        textSize(size)
        text(this.symb, this.x, this.y)

        strokeWeight(0)
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
                faderRange.fmin_map = this.rDown;
                faderRange.fmax_map = this.rUp;

                this.changed = true;
                console.log(this.ativo, this.changed)
            }

        }

    }
}

function criarPresets() {
    // constructor(symb, x, y, scale, nota, offset, timbre, ataque, rUp, rDown)
    preset[0] = new Preset(simboloP[0], width - width / 22, height - 100, 0, -3.8, -1.6, -3.8, -3.8, 0, 7);
    preset[0].ativo = true;
    preset[1] = new Preset(simboloP[1], width - width / 22, height - 100 - tSize * 3, 0, 2.48, -3, -1.6, 3, -2, 7);
    preset[2] = new Preset(simboloP[2], width - width / 22, height - 100 - tSize * 6, 3, -1.8, -1.5, 2.8, -1.8, -14, 5);
    preset[3] = new Preset(simboloP[3], width - width / 22, height - 100 - tSize * 9, 4, -0.1, -3, 2.8, -3, -3, 13);
}

function atualizarPosPresets() {
    for (let i = 0; i < preset.length; i++) {

        preset[i].x = width - width / 22
        preset[i].y = height - 100 - tSize * (i * 3)
    }
}

function presetsDisplay() {
    for (let i = 0; i < preset.length; i++) {
        preset[i].display(coresInterface.texto, tSize * 3);
    }
}

function presetsExect() {
    for (let i = 0; i < preset.length; i++) {
        preset[i].run();

        if (preset[i].changed == true) {
            sendPresRNBO()
            for (let j = 0; j < preset.length; j++) {
                if (i != j)
                    preset[j].ativo = false;
                else
                    preset[j].ativo = true;
            }

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
    rangeDownSend.value = faderRange.fmin_map;
    faderRange.mappingvaluesPreset();

    const rangeUpSend = device.parametersById.get("síntese/range_up");
    rangeUpSend.value = faderRange.fmax_map;
    faderRange.mappingvaluesPreset();

    console.log(faderRange.fmin_map, faderRange.fmax_map)
}


function recordPresets() {
    textSize(tSize)
    textAlign(RIGHT);
    fill(coresInterface.texto)
    let textoRec = 'gravar preset'
    text(textoRec, width - width / 22, height - 30);

    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX < width - width / 22 && mouseX > width - width / 22 - textWidth(textoRec) && start) {
        cursor(HAND)
        if (mouseIsPressed) {
            for (let i = 0; i < preset.length; i++) {
                if (preset[i].ativo) {
                    preset[i].scale = escalaVal;

                    preset[i].nota = knobNotas.writtenValue + 60;
                    preset[i].offset = knobOffset.writtenValue - 12;
                    preset[i].timbre = knobTimbreAtq.writtenValue * 0.1;
                    preset[i].ataque = map(knobTimeAtq.writtenValue, 1, 10, 1, 1000);;

                    preset[i].rDown = faderRange.fmin_map;
                    preset[i].rUp = faderRange.fmax_map;

                    preset[i].recorded = true
                }
            }
        }
    }

}

