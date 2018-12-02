// http://www.espruino.com/Stepper+Motors
let step = 0;
const steps = [0b0001, 0b0010, 0b0100, 0b1000];
const stepperPins = [D15, D13, D12, D14];

function doStep() {
  step++;
  digitalWrite(stepperPins, steps[step % steps.length]);
}

setInterval(doStep, 10);
