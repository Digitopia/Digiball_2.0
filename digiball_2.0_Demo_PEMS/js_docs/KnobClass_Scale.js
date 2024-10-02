class Knob {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.raio = width / 30;
        this.r = constrain(this.raio, 30, 60)
        this.dragging = false;

        this.angle = 0;
        this.newAngle = -2;
        this.calcAngle = 0;
        this.newCalcAngle = 0;
        this.writtenValue = 0;

        this.dx = 0;
        this.dy = 0;
    }

    mousecheck() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.r) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
        }
    }

    changeValue() {
        // Is it being dragged?
        if (this.dragging) {
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
            let mouseAngle = atan2(this.dy, this.dx);
            // angle = mouseAngle - offsetAngle;
            this.angle = mouseAngle;
        }

        this.calcAngle = int(degrees(this.angle)) + 179 + 90;

        if (this.calcAngle > 360) this.calcAngle -= 360;

        if (this.calcAngle <= 315 && this.calcAngle >= 45) {
            if (
                (this.newCalcAngle >= 50 && this.newCalcAngle <= 310) ||
                (this.newCalcAngle <= 50 && this.calcAngle <= 310) ||
                (this.newCalcAngle >= 310 && this.calcAngle >= 50)
            ) {
                this.newAngle = this.angle;
                this.newCalcAngle = this.calcAngle;
            }
        }
    }

    display(minVal, maxVal, nomes) {

        noFill(0);
        drawingContext.filter = "blur(0px)";
        stroke(150);
        // Draw ellipse for knob
        push();
        strokeWeight(1.5);
        translate(this.x, this.y);
        rotate(0);

        arc(0, 0, this.r, this.r, -4, 7.2);
        rotate(this.newAngle);
        line(this.r / 5, 0, this.r / 2 + this.r / 5, 0);
        pop();

        let min = minVal;
        let max = maxVal;
        let displayValue = nomes;

        this.writtenValue = round(map(this.newCalcAngle, 45, 315, min, max));

        textAlign(CENTER);
        fill(150)
        noStroke()
        textSize(this.r / 4.2)
        text(displayValue[this.writtenValue], this.x, this.y + this.r / 2);


    }
}

// FUNÇÕES ESCALA
function escalaDraw() {

    let tSize = constrain(width / 70, 12, 20)
    textSize(tSize)
    textAlign(LEFT);

    text(escalaDisplay[escalaVal] + ' →', width / 44, height - 30);

    if (height > 200) {
        textSize(tSize / 1.5)
        text('DIGIBALL WEBAPP', width / 44, 30)
    }

}

// para mudar a escala -- através de mousepressed
function escalaMousecheck() {
    if (mouseY < height && mouseY > height - 30 * 1.5 && mouseX > width / 40 && mouseX < width / 40 * 10 && start) escalaVal++;
    // if (mouseY < height - height / 15 && mouseY > height - height / 15 * 1.5 && mouseX > width / 2 + width / 100 && mouseX < width / 2 + width / 100 * 10) escalaVal++;
    if (escalaVal >= escalaDisplay.length) escalaVal = 0;
    if (escalaVal < 0) escalaVal = escalaDisplay.length - 1;

    const escalaSend = device.parametersById.get("síntese/escala");
    escalaSend.value = escalaVal;

}