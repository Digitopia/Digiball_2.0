let start = false;
let firstClick = false;

let counter;
let prevCounter;

//começa na escala 0
let escala = 0;

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

//escalas

let escalaVal = 0;
let escalaDisplay = ["diatónica", "pentatónica", "octatónica", 'tons inteiros', 'gunkali'];

//video 
let vid;
let playing = true;
let videoAlpha = 0;

// Create AudioContext
let WAContext = window.AudioContext || window.webkitAudioContext;
let context;
let device;


//vai ser ativado com mouse clicked
const setupRNBO = async () => {

    context = new WAContext();

    let rawPatcher = await fetch("patch.export.json");
    let patcher = await rawPatcher.json();

    let dependencies = await fetch("dependencies.json");
    dependencies = await dependencies.json();

    device = await RNBO.createDevice({ context, patcher });

    // This connects the device to audio output, but you may still need to call context.resume()
    // from a user-initiated function.
    device.node.connect(context.destination);

    // Load the exported dependencies.json file


// Load the dependencies into the device
const results = await device.loadDataBufferDependencies(dependencies);
results.forEach(result => {
    if (result.type === "success") {
        console.log(`Successfully loaded buffer with id ${result.id}`);
    } else {
        console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
    }
});

    eventosOuts();
    const granGain = device.parametersById.get("granGain");
    granGain.value = -13.2;
    const notesGain = device.parametersById.get("notesGain");
    notesGain.value = -5;
    const droneGain = device.parametersById.get("droneGain");
    droneGain.value = -2;
    const onsetSensitivity = device.parametersById.get("onset/sensitivity");
    onsetSensitivity.value = 0.20;


    //para imprimir os parâmetros de controlo do rnbo: a forma assíncrona fá-lo automáticamente
    printParams();
};

const printParams = async () => {
    // Print the names of all the top-level parameters in the device.
    device.parameters.forEach(parameter => {
        // Each parameter has an ID as well as a name. The ID will include
        // the full path to the parameter, including the names of any parent
        // patchers if the parameter is in a subpatcher. So if the path contains
        // any "/" characters, you know that it's not a top level parameter.

        // Uncomment this line to include only top level parameters.
        // if (parameter.id.includes("/")) return;

        console.log(parameter.id);
        console.log(parameter.name);
    });

    //para fazer reset aos parâmetros dos knobs e fazer start
    interfaceSetup();
    start = true;
};

//Ativar o RNBO e BLE
function mouseClicked() {
    if (!firstClick) {
        connectToBle();
        context.resume()
        
    }
    firstClick = true;
}


function setup() {
    canvasCreation();
    textFont('Courier Prime');

    // Create a p5ble class
    myBLE = new p5ble();

    interfaceSetup();
    setupRNBO();
    

}

// WINDOW — CANVAS
function canvasCreation() {
    canvas = createCanvas(windowWidth, windowHeight); // actualiza o tamanho da janela caso se diminua ou aumente
    canvas.position(0, 0);
}


function windowResized() {
    canvasCreation();
    interfaceSetup();
}

function interfaceSetup() {
    //para fazer reset de valores caso se mexa nos knobs antes do start e no resize

    //video setup
    // vid = createVideo("./media/noiseVideo_2.mp4");
    // vid.size(windowWidth * 2, windowHeight * 1.5);
    // vid.volume(0);
    // vid.loop();
    // vid.hide();

    //counter a usar para não acontecerem mudanças no modo trigger demasiado rápido
    counter = millis();
    prevCounter = counter;

    knobNotas = new Knob(constrain(width / 22, 30, 100), height - constrain(width / 20, 50, 100) - 30);
    knobNotas.angle = -3.8;

    knobOffset = new Knob(constrain(width / 22, 30, 100), height - constrain(width / 20, 50, 100) * 2 - 30);
    knobOffset.angle = -1.6;
}

function draw() {
    background(255);
    counter = millis();

    if (firstClick) {
        drone();
        triggerNotas();

    } else {
        textAlign(CENTER);
        textSize(24)
        text('CONECTAR & COMEÇAR', width / 2, height / 2 - 26);
    }

    knobNotas.changeValue();
    knobNotas.display(0, 11, knobNotasVals);

    if (knobNotas.dragging && start) {
        const fundamentalSend = device.parametersById.get("síntese/fundamental");
        fundamentalSend.value = knobNotas.writtenValue + 60;
    }

    knobOffset.changeValue();
    knobOffset.display(0, 24, knobOffsetVals);

    if (knobOffset.dragging && start) {
        const offsetSend = device.parametersById.get("síntese/offset");
        offsetSend.value = knobOffset.writtenValue - 12;
    }

    escalaDraw();
    drawBLE();
}


function mousePressed() {
    knobNotas.mousecheck();
    knobOffset.mousecheck();

    escalaMousecheck()
    BLEMousecheck()
}

function mouseReleased() {
    knobNotas.dragging = false;
    knobOffset.dragging = false;
}




