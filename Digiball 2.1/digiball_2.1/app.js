let start = false;
let firstClick = false;

let counter;
let prevCounter;

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

    //Recebe do RNBO (modulos.js)
    eventosOuts();

    //envios para o RNBO
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
    frameRate(60);
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

function draw() {
    cursor(ARROW)
    background(coresInterface.background);
    counter = millis();

    if (firstClick) {
        //simulação visual do drone – tem de estar desativada para simular a bola
        // sim_Drone()

        //simulação da bola com o rato
        sim_Full()

        interfaceInterativa();
        presetsDisplay();
        presetsExect()

        if (!maisInfoDisplay) {
            drone();
            triggerNotas();

        }

    } else {
        textAlign(CENTER);
        textSize(38)
        fill(coresInterface.texto)
        text('D I G I B A L L  W E B . A P P', width / 2, height / 2 - 26);
        textSize(24)
        text('CONECTAR & COMEÇAR', width / 2, height / 2 + 26);
    }


}


