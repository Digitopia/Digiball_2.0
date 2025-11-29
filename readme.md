### Digiball 2.1

Digiball 2.1 is an updated and improved version of Digiball, a website based instrument. 
This version is currently under development.

This is an website based instrument which connects to an Arduino MKR 1010 WiFi with an IMU shield, through BLE, enabling the user to use a ball and it's movement to control sound production. In the future the site will be able to run in mobile devices,  this enabling anyone with a cellphone to produce sound through movement.


This version comprises a Website running:

- p5.js for interface;
- p5.js.BLE for BLE connection with arduino MKR 1010 WiFi
- RNBO web export for sensors processing and audio engine

Be sure to use Google Chrome. It's not working on other browsers at the moment.

For running a local version of the website, make sure to change your directory to "digiball_2.0_Demo_PEMS", and run an http server on terminal, such as

```python3 -m http.server```

Export your RNBO code into this directory.