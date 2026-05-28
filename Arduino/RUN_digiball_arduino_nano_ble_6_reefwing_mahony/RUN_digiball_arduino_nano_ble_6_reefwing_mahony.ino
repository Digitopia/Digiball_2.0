#include <SPI.h>
#include <stdlib.h>
#include <ArduinoBLE.h>
#include "Arduino_BMI270_BMM150.h"
#include "SensorFusion.h"
#include <ReefwingAHRS.h>


#define NUMBER_OF_SENSORS 6

// values for hard and soft iron correction of the magnetometer 
const float hard_iron[3] = { -30.13, 20.95, -20.51 };

const float soft_iron[3][3]{ { 0.000, 0.000, 0.000 },
                             { 0.000, 0.000, 0.000 },
                             { 0.000, 0.000, 0.000 } };

// values for the correction of the gyroscope and accelerometer
const float gyro_offset[3] = { -0.2747, -0.1221, 0.0610 };

const float accel_offset[3] = { 0, 0, 0. };


#define UPDATE_INTERVALL 10
long previousMillis;

BLEService digiballService("19B10010-E8F2-537E-4F6C-D104768A1214");  // create service


BLEStringCharacteristic stringCharacteristic("19B10012-E8F2-537E-4F6C-D104768A1214", BLENotify, 40);


float heading, roll, pitch;
float gyrox, gyroy, gyroz;
float x, y, z;
float magx, magy, magz;


String heading_, roll_, pitch_;
String gyrox_, gyroy_, gyroz_;
String x_, y_, z_;
String magx_, magy_, magz_;


ReefwingAHRS ahrs;
SensorData data;

//  Display and Loop Frequency
int loopFrequency = 0;
const long displayPeriod = 1000;
unsigned long previousMillis2 = 0;



void setup() {

  ahrs.begin();
  ahrs.setDOF(DOF::DOF_9);
  //ahrs.setImuType(ImuType::BMI270_BMM150);

  ahrs.setFusionAlgorithm(SensorFusion::MAHONY);
  //ahrs.setAlpha(0.6);
  ahrs.setKp(10);
  ahrs.setKi(0);
  ahrs.setDeclination(-1);
  ahrs.setBeta(3);  //  Sydney, Australia

  //Initialize serial and wait for port to open:
  previousMillis = 0;
  Serial.begin(115200);
  // while (!Serial) {
  //     // wait for Serial to become active
  // }

  Serial.print("Detected Board - ");
  Serial.println(ahrs.getBoardTypeString());


  if (IMU.begin()) {
    Serial.println("BMI270 & BMM150 IMUs Connected.");
    Serial.print("Gyroscope sample rate = ");
    Serial.print(IMU.gyroscopeSampleRate());
    Serial.println(" Hz");
    Serial.println();
    Serial.println("Gyroscope in degrees/second");
    Serial.print("Accelerometer sample rate = ");
    Serial.print(IMU.accelerationSampleRate());
    Serial.println(" Hz");
    Serial.println();
    Serial.println("Acceleration in G's");
    Serial.print("Magnetic field sample rate = ");
    Serial.print(IMU.magneticFieldSampleRate());
    Serial.println(" Hz");
    Serial.println();
    Serial.println("Magnetic Field in uT");
  } else {
    Serial.println("BMI270 & BMM150 IMUs Not Detected.");
    while (1)
      ;
  }

  // sensorRate = IMU.gyroscopeSampleRate();
  //sensorRate = 20;

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1)
      ;
  }


  // check for the WiFi module:

  // set the local name peripheral advertises
  BLE.setLocalName("Digiball");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(digiballService);

  // add the characteristics to the service
  //ledService.addCharacteristic(ledCharacteristic);
  digiballService.addCharacteristic(stringCharacteristic);


  // add the service
  BLE.addService(digiballService);

  //ledCharacteristic.writeValue(0);
  //gyroxCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}


void loop() {



  if (IMU.magneticFieldAvailable()) {
    IMU.readMagneticField(data.mx, data.my, data.mz);
    data.mx -= hard_iron[0];
    data.my -= hard_iron[1];
    data.mz -= hard_iron[2];


    data.mx = data.mx * soft_iron[0][0] + data.my * soft_iron[0][1] + data.mz * soft_iron[0][2];
    data.my = data.mx * soft_iron[1][0] + data.my * soft_iron[1][1] + data.mz * soft_iron[1][2];
    data.mz = data.mx * soft_iron[2][0] + data.my * soft_iron[2][1] + data.mz * soft_iron[2][2];

    //invert magnetometer x axis (problem of the IMU library. the axis in all sensors are not matched)
    data.mx *= -1;
    
    
  }


  if (IMU.gyroscopeAvailable() && IMU.accelerationAvailable()) {
    IMU.readGyroscope(data.gx, data.gy, data.gz);
    IMU.readAcceleration(data.ax, data.ay, data.az);

    // gyro compensation
    data.gx -= gyro_offset[0];
    data.gy -= gyro_offset[1];
    data.gz -= gyro_offset[2];
    data.gx *= DEG_TO_RAD;
    data.gy *= DEG_TO_RAD;
    data.gz *= DEG_TO_RAD;


    float gxTemp = data.gx;
    float gyTemp = data.gy;
    data.gx = gyTemp;
    data.gy = gxTemp;

    data.ax -= accel_offset[0];
    data.ay -= accel_offset[1];
    data.az -= accel_offset[2];

    float axTemp = data.ax;
    float ayTemp = data.ay;
    data.ax = ayTemp;
    data.ay = axTemp;

    ahrs.setData(data);
    ahrs.update();
  }


  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis > UPDATE_INTERVALL) {
    previousMillis = currentMillis;

    // switch pitch and roll values to match the axis of the previously used Arduino MKR 1010 Wifi. Maybe with all the switches it would be possible to simplify this. But maybe on a next version we can make that work, as it was hard to reach a working prototype.

    String values = String(-ahrs.angles.roll) + "," + String(-ahrs.angles.pitch) + "," + String(-ahrs.angles.yaw) + "," + String(data.ax) + "," + String(data.ay) + "," + String(data.az);

    stringCharacteristic.writeValue(values);
    //Serial.println (values);
    BLE.poll();
  }
}


void debugPrint() {

  if (millis() - previousMillis2 >= displayPeriod) {


    //      //Display sensor data every displayPeriod, non-blocking.
    //     // Serial.print("Roll: ");
    //     // Serial.print(ahrs.angles.roll, 2);
    //     // Serial.print("\tPitch: ");
    //     // Serial.print(ahrs.angles.pitch, 2);
    //     // Serial.print("\tYaw: ");
    //     // Serial.print(ahrs.angles.yaw, 2);
    //     // Serial.print("\tHeading: ");
    //     // Serial.print(ahrs.angles.heading, 2);
    //     // Serial.print("\tLoop Frequency: ");
    Serial.print(loopFrequency);
    Serial.print(" Hz");
    Serial.print("\tgyro data ");
    Serial.print("\t ");
    Serial.print(data.gx);
    Serial.print("\t ");
    Serial.print(data.gy);
    Serial.print("\t ");
    Serial.print(data.gz);
    Serial.println(" ");
    Serial.print("\taccel data ");
    Serial.print("\t ");
    Serial.print(data.ax);
    Serial.print("\t ");
    Serial.print(data.ay);
    Serial.print("\t ");
    Serial.print(data.az);
    Serial.println(" ");
    //     // Serial.print("\tmag data ");
    //     // Serial.print("\t ");
    //     // Serial.print(data.mx);
    //     // Serial.print("\t ");
    //     // Serial.print(data.my);
    //     // Serial.print("\t ");
    //     // Serial.print(data.mz);
    //     // Serial.println (" ");


    //     // Serial.print("Orientation: ");
    //     // Serial.print(ahrs.angles.heading);
    //     // Serial.print(" ");
    //     // Serial.print(ahrs.angles.pitch);
    //     // Serial.print(" ");
    //     // Serial.println(ahrs.angles.roll);

    loopFrequency = 0;
    previousMillis2 = millis();
  }
  loopFrequency++;
}