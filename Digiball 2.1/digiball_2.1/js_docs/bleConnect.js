// The serviceUuid must match the serviceUuid of the device you would like to connect
const serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
let myBLE;
let lastTime = 0;
let latency;
var isConnected;
let string;
let highestLat = 0;
let timer = 0;

let varsBLE = [];



let stringCharacteristic;


function connectToBle() {
    // Connect to a device by passing the service UUID
    myBLE.connect(serviceUuid, gotCharacteristics);
}

function onDisconnected() {
    console.log("Device got disconnected.");
    myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
    if (error) console.log("error: ", error);

    stringCharacteristic = characteristics[0];
    // Read the value of the first characteristic
    myBLE.startNotifications(stringCharacteristic, stringNotifications, 'string');
    myBLE.onDisconnected(onDisconnected);
}

function stringNotifications(data) {
    //console.log("data: ", data);

    // os dados estão dentro desta variável "string"
    // são 6 valores, 3 valores de giroscópio (pitch, roll, heading) e 3 valores de acelerómetro (x, y, z);
    // estão separados por vírgulas e era fixe entrarem como parâmetros no rnbo

    string = data;

    varsBLE = float(split(string, ','));
    updateIMUparameters();
    //estes parâmetros são para enviar para o rnbo: criar no rnbo parametros com os ids correspondentes


    // isto é só para fazer debugging das latências entre dados
    latency = millis() - lastTime;
    lastTime = millis();
    if (latency > highestLat) highestLat = latency;


}


function drawBLE() {
    // Isto é só para desenhar as latências, para debugging — !!Apagar/comentar na versão final
    // text(round(latency), 100, 150);
    // text(round(highestLat), 100, 180);
    // text(string, 100, 80);
    // for (let i = 0; i < varsBLE.length; i++) {
    //     text(varsBLE[i], 100 + i * 80, 100)
    // }


    // if (millis() % 5000 > 4000) highestLat = 0;


    // DISPLAY PARA RECONECTAR AO BLE – local para mousepressed
    textSize(tSize)
    textAlign(RIGHT);
    fill(coresInterface.texto);

    text("reconectar", width - width / 44, height / 20);

    if (mouseY < height / 20 + tSize && mouseY > height / 20 - tSize * 1.2 && mouseX < width - width / 40 && mouseX > width - width / 40 * 5)
        cursor(HAND)
}

// PARA RECONECTAR AO BLE ATRAVÉS DE MOUSEPRESSED (em cima do texto "reconectar")
function BLEMousecheck() {
    if (mouseY < height / 20 + tSize && mouseY > height / 20 - tSize * 1.2 && mouseX < width - width / 40 && mouseX > width - width / 40 * 5) {
        connectToBle()
    }
}

function updateIMUparameters() {


    let messageEvent = new RNBO.MessageEvent(RNBO.TimeNow, "in1", varsBLE);
    device.scheduleEvent(messageEvent);

    // const pitchSend = device.parametersById.get("pitch");
    // pitchSend.value = float(varsBLE[0]);


    // const rollSend = device.parametersById.get("roll");
    // rollSend.value = float(varsBLE[1]);


    // const headingSend = device.parametersById.get("heading");
    // headingSend.value = float(varsBLE[2]);

    // const xSend = device.parametersById.get("x");
    // xSend.value = float(varsBLE[3]);

    // const ySend = device.parametersById.get("y");
    // ySend.value = float(varsBLE[4]);

    // const zSend = device.parametersById.get("z");
    // zSend.value = float(varsBLE[5]);

}