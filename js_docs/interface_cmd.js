//cores interface
let coresInterface = { background: 0, texto: 180, infotexto: 0, infobackground: 180 }
let tSize; // para o tamanho do texto da interface, definina na função interfaceSetup()

//knobs
let knobNotas;
let knobNotasVals = [
    "dó",
    "dó♯",
    "ré",
    "ré♯",
    "mi",
    "fá",
    "fá♯",
    "sol",
    "sol♯",
    "lá",
    "lá♯",
    "si",
];

let knobOffset;
let knobOffsetVals = ['-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10', '+11', '+12'];

let knobTimbreAtq;
let knobTimbreAtqVals = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

let knobTimeAtq;
let knobTimeAtqVals = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

let knobRangeDown;
let knobRangeDownVals = ['-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0'];

let knobRangeUp;
let knobRangeUpVals = ['0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10', '+11', '+12', '+13'];



//escalas
let escalaVal = 0;
let escalaDisplay = ["diatónica", "pentatónica", "octatónica", 'tons inteiros', 'gunkali'];

//começa na escala 0
let escala = 0;



/* esta função serve para fazer reset de valores caso se mexa nos knobs antes do start e no resize */
function interfaceSetup() {

    //counter a usar para não acontecerem mudanças no modo trigger demasiado rápido
    counter = millis();
    prevCounter = counter;

    tSize = constrain(width / 70, 12, 20);

    knobNotas = new Knob(constrain(width / 22, 30, 100), height - 50);
    knobNotas.angle = -3.8;

    knobOffset = new Knob(constrain(width / 22, 30, 100), height - 50 - constrain((tSize * 3.5), 60, height / 8))
    knobOffset.angle = -1.6;

    knobTimbreAtq = new Knob(constrain(width / 22, 30, 100), height - 50 - constrain((tSize * 3.5), 60, height / 8) * 2);
    knobTimbreAtq.angle = -3.8;

    knobTimeAtq = new Knob(constrain(width / 22, 30, 100), height - 50 - constrain((tSize * 3.5), 60, height / 8) * 3);
    knobTimeAtq.angle = -3.8;

    knobRangeDown = new Knob(constrain(width / 22, 30, 100), height - 50 - constrain((tSize * 3.5), 60, height / 8) * 4);
    knobRangeDown.angle = 0.7;

    knobRangeUp = new Knob(constrain(width / 22, 30, 100), height - 50 - constrain((tSize * 3.5), 60, height / 8) * 5);
    knobRangeUp.angle = -1.4;
}


function interfaceInterativa() {

    /* KNOBS – cada um tem um conjunto de funções: 
    1) o changeValue acontece quando o mousePressed está on
    2) o display é o que o nome indica
    3) o mousehover muda o cursor

    4) condicional para enviar valores para o RNBO
    */

    knobNotas.changeValue();
    knobNotas.display(0, 11, knobNotasVals, 'fundamental');
    knobNotas.mousehover();

    if (knobNotas.dragging && start) {
        const fundamentalSend = device.parametersById.get("síntese/fundamental");
        fundamentalSend.value = knobNotas.writtenValue + 60;
    }

    knobOffset.changeValue();
    knobOffset.display(0, 24, knobOffsetVals, 'offset');
    knobOffset.mousehover();

    if (knobOffset.dragging && start) {
        const offsetSend = device.parametersById.get("síntese/offset");
        offsetSend.value = knobOffset.writtenValue - 12;
    }

    knobTimbreAtq.changeValue();
    knobTimbreAtq.display(0, 9, knobTimbreAtqVals, 'timbre');
    knobTimbreAtq.mousehover();

    if (knobTimbreAtq.dragging && start) {
        const timbreAtqSend = device.parametersById.get("síntese/timbre_ataque");
        timbreAtqSend.value = knobTimbreAtq.writtenValue * 0.1;
    }

    knobTimeAtq.changeValue();
    knobTimeAtq.display(0, 9, knobTimeAtqVals, 'ataque');
    knobTimeAtq.mousehover();

    if (knobTimeAtq.dragging && start) {
        const timeAtqSend = device.parametersById.get("síntese/time_ataque");
        timeAtqSend.value = map(knobTimeAtq.writtenValue, 1, 10, 1, 1000);
    }

    knobRangeDown.changeValue();
    knobRangeDown.display(0, 14, knobRangeDownVals, 'tessitura ↓');
    knobRangeDown.mousehover();

    if (knobRangeDown.dragging && start) {
        const rangeDownSend = device.parametersById.get("síntese/range_down");
        rangeDownSend.value = knobRangeDown.writtenValue - 14;
    }

    knobRangeUp.changeValue();
    knobRangeUp.display(0, 13, knobRangeUpVals, 'tessitura ↑');
    knobRangeUp.mousehover();

    if (knobRangeUp.dragging && start) {
        const rangeUpSend = device.parametersById.get("síntese/range_up");
        rangeUpSend.value = knobRangeUp.writtenValue + 1;
    }

    /* esta função contém o display e mouse hove
       o send para o RNBO acontece quando o mousePressed está on
       — o mesmo acontece quanto ao BLE */

    escalaDraw();
    drawBLE();

    maisInfo();
}


function mousePressed() {
    knobNotas.mousecheck();
    knobOffset.mousecheck();
    knobTimbreAtq.mousecheck();
    knobTimeAtq.mousecheck();
    knobRangeDown.mousecheck();
    knobRangeUp.mousecheck();


    escalaMousecheck()
    BLEMousecheck()
    maisInfoBtn_mousechecked()
}

function mouseReleased() {
    knobNotas.dragging = false;
    knobOffset.dragging = false;
    knobTimbreAtq.dragging = false;
    knobTimeAtq.dragging = false;
    knobRangeDown.dragging = false;
    knobRangeUp.dragging = false;

    console.log(`escala: ${escalaVal}, nota: ${knobNotas.angle}, 
        offset: ${knobOffset.angle}, timbre: ${knobTimbreAtq.angle}, 
        ataque: ${knobTimeAtq.angle}, range down: ${knobRangeDown.angle}, 
        range up: ${knobRangeUp.angle}`)
}

