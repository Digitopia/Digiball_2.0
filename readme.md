### Digiball 2.1

Digiball 2.1 is an updated and improved version of Digiball, a website based instrument. 
This version is currently under development.

This is an website based instrument which connects to an Arduino Nano 33 Ble rev 2, through BLE, enabling the user to use a ball and it's movement to control sound production. In the future the site will be able to run in mobile devices,  this enabling anyone with a cellphone to produce sound through movement.

This version comprises a Website running:

- p5.js for interface;
- p5.js.BLE for BLE connection with Arduino Nano 33 Ble rev 2
- RNBO web export for sensors processing and audio engine

Be sure to use Google Chrome. It's not working on other browsers at the moment.

To run the website, run an http server on terminal from this root folder, such as

```python3 -m http.server```



The whole instructions for producing and running the instrument and website can be found in PRODUCTION_GUIDE.md.