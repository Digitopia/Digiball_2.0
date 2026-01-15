### Digiball 2.1

Digiball 2.1 is an updated and improved version of Digiball, a website based instrument. 
This version is currently under development.

This is an website based instrument which connects to an Arduino Nano 33 Ble rev 2, through BLE, enabling the user to use a ball and it's movement to control sound production. In the future the site will be able to run in mobile devices,  this enabling anyone with a cellphone to produce sound through movement.

This version comprises a Website running:

- p5.js for interface;
- p5.js.BLE for BLE connection with Arduino Nano 33 Ble rev 2
- RNBO web export for sensors processing and audio engine

Be sure to use Google Chrome. It's not working on other browsers at the moment.

For running a local version of the website, make sure to change your directory to "digiball_2.0_Demo_PEMS", and run an http server on terminal, such as

```python3 -m http.server```

```

```



Export your RNBO code into this directory.

For the Arduino, there is the need to calibrate the magnetometer and gyroscope of the unit. The simpler way (which works for most cases) is to use the arduino sketches for the gyroscope calibration and manetometer hard iron calibration. The sketches will print calibration values than then you need to introduce in the RUN sketch, which should be loaded in the end. If you want to calibrate the soft iron component of the magnetometer, it is possible to use the respective sketch in articulation with MotionCal, which you can download [here](https://www.pjrc.com/store/prop_shield.html).