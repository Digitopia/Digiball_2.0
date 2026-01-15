#include <SPI.h>
#include <stdlib.h>
#include "Arduino_BMI270_BMM150.h"


#define GYRO_CAL_NUMBER_SAMPLES 1000

float gyrox, gyroy, gyroz;

float gyro_min_x, gyro_max_x, gyro_mid_x;
float gyro_min_y, gyro_max_y, gyro_mid_y;
float gyro_min_z, gyro_max_z, gyro_mid_z;
float currentGyroCalSample = 0; 
bool completed = false;



void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    // wait for Serial to become active
  }


  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1)
      ;
  }


  gyro_min_x = gyro_max_x = 0;
  gyro_min_y = gyro_max_y = 0;
  gyro_min_z = gyro_max_z = 0;

  Serial.println(F("Place gyro on flat, stable surface!"));

  Serial.print(F("Fetching samples in 3..."));
  delay(1000);
  Serial.print("2...");
  delay(1000);
  Serial.print("1...");
  delay(1000);
  Serial.println("NOW!");

}



void loop() {


  if (IMU.gyroscopeAvailable()) {
    IMU.readGyroscope(gyrox, gyroy, gyroz);
    gyroCal();
  }


}


void gyroCal() {
if (currentGyroCalSample < GYRO_CAL_NUMBER_SAMPLES) {

Serial.print(F("Gyro: ("));
    Serial.print(gyrox); Serial.print(", ");
    Serial.print(gyroy); Serial.print(", ");
    Serial.print(gyroz); Serial.print(")");

    gyro_min_x = min(gyro_min_x, gyrox);
    gyro_min_y = min(gyro_min_y, gyroy);
    gyro_min_z = min(gyro_min_z, gyroz);
  
    gyro_max_x = max(gyro_max_x, gyrox);
    gyro_max_y = max(gyro_max_y, gyroy);
    gyro_max_z = max(gyro_max_z, gyroz);
  
    gyro_mid_x = (gyro_max_x + gyro_min_x) / 2;
    gyro_mid_y = (gyro_max_y + gyro_min_y) / 2;
    gyro_mid_z = (gyro_max_z + gyro_min_z) / 2;

    Serial.print(F(" Zero rate offset: ("));
    Serial.print(gyro_mid_x, 4); Serial.print(", ");
    Serial.print(gyro_mid_y, 4); Serial.print(", ");
    Serial.print(gyro_mid_z, 4); Serial.print(")");  
  
    Serial.print(F(" rad/s noise: ("));
    Serial.print(gyro_max_x - gyro_min_x, 3); Serial.print(", ");
    Serial.print(gyro_max_y - gyro_min_y, 3); Serial.print(", ");
    Serial.print(gyro_max_z - gyro_min_z, 3); Serial.println(")");   
    currentGyroCalSample++;
  }

  else {
    if (completed == false) {
  Serial.println(F("\n\nFinal zero rate offset in radians/s: "));
  Serial.print(gyro_mid_x, 4); Serial.print(", ");
  Serial.print(gyro_mid_y, 4); Serial.print(", ");
  Serial.println(gyro_mid_z, 4);
    completed = true;
    }
}
}
