#include <SPI.h>
#include <WiFiNINA.h>
#include <WiFiUdp.h>
#include <MKRIMU.h>
#include <stdlib.h>
#include <ArduinoBLE.h>

#define NUMBER_OF_SENSORS 6

union multi_sensor_data
{
  struct __attribute__( ( packed ) )
  {
    float values[NUMBER_OF_SENSORS];
  };
  uint8_t bytes[ NUMBER_OF_SENSORS * sizeof( float ) ];
};

union multi_sensor_data multiSensorData;

#define UPDATE_INTERVALL 5
long previousMillis;

BLEService digiballService("19B10010-E8F2-537E-4F6C-D104768A1214"); // create service

// create switch characteristic and allow remote device to read and write
//BLEByteCharacteristic ledCharacteristic("19B10011-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
// create button characteristic and allow remote device to get notifications
BLEStringCharacteristic stringCharacteristic("19B10012-E8F2-537E-4F6C-D104768A1214", BLENotify, 35);
//BLECharacteristic multiSensorDataCharacteristic("19B10012-E8F2-537E-4F6C-D104768A1214", BLENotify, sizeof multiSensorData.bytes);



String heading_, roll_, pitch_;
String gyrox_, gyroy_, gyroz_;
String x_, y_, z_;
String magx_, magy_, magz_;

void setup() {

  //Initialize serial and wait for port to open:
  previousMillis = 0;
  Serial.begin(9600);


  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1)
      ;
  }

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
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


  float heading, roll, pitch;
  float gyrox, gyroy, gyroz;
  float x, y, z;
  float magx, magy, magz;

  if (IMU.eulerAnglesAvailable()) {
    IMU.readEulerAngles(heading, roll, pitch);
    
    heading_ = "/" + String(heading);
    roll_ = "/" + String(roll);
    pitch_ = "/euler/" + String(pitch);
  }


  if (IMU.gyroscopeAvailable()) {
    IMU.readGyroscope(gyrox, gyroy, gyroz);

    gyrox_ = "/gyro/" + String(gyrox);
    gyroy_ = "/" + String(gyroy);
    gyroz_ = "/" + String(gyroz);
  }

  //ACCEL check
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    x_ = "/accel/" + String(x);
    y_ = "/" + String(y);
    z_ = "/" + String(z);
  }

  //Magneto check
  if (IMU.magneticFieldAvailable()) {
    IMU.readMagneticField(magx, magy, magz);

    magx_ = "/mag/" + String(magx);
    magy_ = "/" + String(magy);
    magz_ = "/" + String(magz);
  }




unsigned long currentMillis = millis();
      if ( currentMillis - previousMillis > UPDATE_INTERVALL )
      {
        previousMillis = currentMillis;
        String values = String(pitch) + "," + String(roll) + "," + String(heading) + "," + String(x) + "," + String(y) + "," + String(z);
//String values = String(int(pitch*10));

// read the value from the sensor:
      stringCharacteristic.writeValue(values);
       
       BLE.poll();
      }

  // poll for BLE events
  

//multiSensorData.values[0] = pitch;
//multiSensorData.values[1] = roll;
//multiSensorData.values[2] = heading;
//multiSensorData.values[3] = x;
//multiSensorData.values[4] = y;
//multiSensorData.values[5] = z;

//String values = String(x) + "," + String(y) + "," + String(z);

  //multiSensorDataCharacteristic.writeValue( multiSensorData.bytes, sizeof multiSensorData.bytes );
  
//   BLEDevice central = BLE.central();
//   if (central)
//   {
//     digitalWrite(LED_BUILTIN, HIGH);
//     while (central.connected())
//     {
// //      BLE.poll(); // <- doesn't change anything
//       long currentMillis = millis();
//       if (currentMillis - previousMillis >= 10) {
//         previousMillis = currentMillis;
//         stringCharacteristic.writeValue(String(values));
//       }
//     }
//   }
  // Udp.print(pitch_);
  // Udp.print(roll_);
  // Udp.print(heading_);
  // Udp.print(gyrox_);
  // Udp.print(gyroy_);
  // Udp.print(gyroz_);
  // Udp.print(x_);
  // Udp.print(y_);
  // Udp.print(z_);
  // Udp.print(magx_);
  // Udp.print(magy_);
  // Udp.print(magz_);


}




