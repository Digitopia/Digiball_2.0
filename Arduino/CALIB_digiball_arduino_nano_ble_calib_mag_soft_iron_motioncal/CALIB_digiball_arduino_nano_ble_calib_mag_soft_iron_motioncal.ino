#include <SPI.h>
#include <stdlib.h>

#include "Arduino_BMI270_BMM150.h"

float gyrox, gyroy, gyroz;
float x, y, z;
float magx, magy, magz;



void setup() {

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    // wait for Serial to become active
  }


  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1)
      ;
  }


}


void loop() {


  if (IMU.gyroscopeAvailable()) {
    IMU.readGyroscope(gyrox, gyroy, gyroz);
  }

  //ACCEL check
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);
  }

  //Magneto check
  if (IMU.magneticFieldAvailable()) {
    IMU.readMagneticField(magx, magy, magz);
    printMotionCal();
  }



}

void printMotionCal() {

  Serial.print("Raw:");
  Serial.print(int(x * 8192 / 9.805));
  Serial.print(",");
  Serial.print(int(y * 8192 / 9.805));
  Serial.print(",");
  Serial.print(int(z * 8192 / 9.805));
  Serial.print(",");
  Serial.print(int(gyrox * 16));
  Serial.print(",");
  Serial.print(int(gyroy * 16));
  Serial.print(",");
  Serial.print(int(gyroz * 16));
  Serial.print(",");
  Serial.print(int(magx * 10));
  Serial.print(",");
  Serial.print(int(magy * 10));
  Serial.print(",");
  Serial.print(int(magz * 10));
  Serial.println("");

  Serial.print("Uni:");
  Serial.print(x);
  Serial.print(",");
  Serial.print(y);
  Serial.print(",");
  Serial.print(z);
  Serial.print(",");
  Serial.print(gyrox, 4);
  Serial.print(",");
  Serial.print(gyroy, 4);
  Serial.print(",");
  Serial.print(gyroz, 4);
  Serial.print(",");
  Serial.print(magx);
  Serial.print(",");
  Serial.print(magy);
  Serial.print(",");
  Serial.print(magz);
  Serial.println("");
}


