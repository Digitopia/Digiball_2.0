#include <SPI.h>
#include <stdlib.h>

#include "Arduino_BMI270_BMM150.h"


float magx, magy, magz;

float min_x, max_x, mid_x;
float min_y, max_y, mid_y;
float min_z, max_z, mid_z;

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

  min_x = max_x = 0;
  min_y = max_y = 0;
  min_z = max_z = 0;

}



void loop() {


  //Magneto check
  if (IMU.magneticFieldAvailable()) {
    IMU.readMagneticField(magx, magy, magz);

    float x = magx;
  float y = magy;
  float z = magz;
  
  Serial.print("Mag: (");
  Serial.print(x); Serial.print(", ");
  Serial.print(y); Serial.print(", ");
  Serial.print(z); Serial.print(")");

  min_x = min(min_x, x);
  min_y = min(min_y, y);
  min_z = min(min_z, z);

  max_x = max(max_x, x);
  max_y = max(max_y, y);
  max_z = max(max_z, z);

  mid_x = (max_x + min_x) / 2;
  mid_y = (max_y + min_y) / 2;
  mid_z = (max_z + min_z) / 2;
  Serial.print(" Hard offset: (");
  Serial.print(mid_x); Serial.print(", ");
  Serial.print(mid_y); Serial.print(", ");
  Serial.print(mid_z); Serial.print(")");  

  Serial.print(" Field: (");
  Serial.print((max_x - min_x)/2); Serial.print(", ");
  Serial.print((max_y - min_y)/2); Serial.print(", ");
  Serial.print((max_z - min_z)/2); Serial.println(")");    
  delay(10); 


  }
}


