"use strict";
const chartID = "myCanvas";
const chartID2 = "myCanvas2";
const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const myCanvas = document.getElementById("myCanvas");
const myCanvas2 = document.getElementById("myCanvas2");
const ctx = myCanvas.getContext("2d");
const ctx2 = myCanvas2.getContext("2d");
let numberOfLine;
let canvasArr = [];
const selectElement = document.getElementById('SDE');
const options = Array.from(selectElement.options);

/* ascending aplhabetic order */
options.sort((a, b) => a.textContent.localeCompare(b.textContent));
options.forEach(option => selectElement.appendChild(option));

function destroyCanvas() {
  for (let c of canvasArr) c.destroy();
  canvasArr.shift();
}
document.getElementById("SDE").addEventListener("change", function () {
  destroyCanvas();
  let selectedAlg = this.value;
  let inputForms = document.getElementsByClassName("input-form");
  for (let i = 0; i < inputForms.length; i++) {
    inputForms[i].style.display = "none";
  }

  switch (selectedAlg) {
    case "empty":
      console.log("No algorithm selected");
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "AB":
      console.log("Arithmetic Brownian selected");
      document.getElementById("ABInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "GB":
      console.log("Geometric Brownian selected");
      document.getElementById("GBInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "OU":
      console.log("Ornstein-Uhlenbeck selected");
      document.getElementById("OUInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "V":
      console.log("Vasicek selected");
      document.getElementById("VInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "HW":
      console.log("Hull-White selected");
      document.getElementById("HWInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "CIR":
      console.log("Cox-Ingersoll-Ross selected");
      document.getElementById("CIRInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "BK":
      console.log("Black-Karasinski selected");
      document.getElementById("BKInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "H":
      console.log("Heston selected");
      document.getElementById("HInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;

    case "CM":
      console.log("Chen model selected");
      document.getElementById("CInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;
    case "MANUAL-SDE":
      console.log("Manuel SDE selected");
      document.getElementById("SDEInputs").style.display = "block";
      canvas1.style.display = "none";
      canvas2.style.display = "none";
      break;
  }
});

myCanvas.addEventListener("mousedown", () => {
  myCanvas.addEventListener("mousemove", update1);
  window.addEventListener("mouseup", () => {
    myCanvas.removeEventListener("mousemove", update1);
  });
});

function update1(ev) {
  canvas1.style.setProperty("left", `${ev.x - 1}px`);
  canvas1.style.setProperty("top", `${ev.y - 1}px`);
}

myCanvas2.addEventListener("mousedown", () => {
  myCanvas2.addEventListener("mousemove", update2);
  window.addEventListener("mouseup", () => {
    myCanvas2.removeEventListener("mousemove", update2);
  });
});

function update2(ev) {
  canvas2.style.setProperty("left", `${ev.x - 200}px`);
  canvas2.style.setProperty("top", `${ev.y - 25}px`);
}

function getRandomRGBAColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function generateArithmeticBrownianMotion(methodFlag) {
  numberOfLine = parseInt(document.getElementById("ABinstances").value);

  const numSteps = parseInt(document.getElementById("ABnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  const labelGraph = "Arithmetic Brownian Motion";
  if (methodFlag == 0) {
    initializeGraph(labelGraph);
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2(labelGraph);
    canvas2.style.display = "block";
  }
  const mu = parseFloat(document.getElementById("ABmu").value);
  const sigma = parseFloat(document.getElementById("ABsigma").value);
  const X0 = parseInt(document.getElementById("ABX0").value);
  const dt = parseFloat(document.getElementById("ABdt").value);
  let yValues = [X0];
  let newValue = 0;

  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        // Euler method
        newValue = mu * dt + sigma * dW;
      } else if (methodFlag == 1) {
        // Runge kutta method
        const k = mu * dt + sigma * dW;
        newValue = mu * dt * k + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues, methodFlag);
    yValues = [X0];
  }
}

function clickArithmeticBrownianMotion() {
  destroyCanvas();
  generateArithmeticBrownianMotion(0);
  generateArithmeticBrownianMotion(1);
}

function generateGeometricBrownianMotion(methodFlag) {
  numberOfLine = parseInt(document.getElementById("GBinstances").value);
  const numSteps = parseInt(document.getElementById("GBnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  let labelGraph = "Geometric Brownian Motion";
  if (methodFlag == 0) {
    initializeGraph(labelGraph);
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2(labelGraph);
    canvas2.style.display = "block";
  }

  const mu = parseFloat(document.getElementById("GBmu").value);
  const sigma = parseFloat(document.getElementById("GBsigma").value);
  const dt = parseFloat(document.getElementById("GBdt").value);
  const S0 = parseInt(document.getElementById("GBS0").value);
  let yValues = [S0];
  let newValue = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        // Euler method
        newValue = mu * yValues[i] * dt + sigma * yValues[i] * dW;
      } else if (methodFlag == 1) {
        // Runge kutta method
        const k = mu * yValues[i] * dt + sigma * yValues[i] * dW;
        newValue = mu * yValues[i] * dt * k + sigma * yValues[i] * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [S0];
  }
}

function clickGeometricBrownianMotion() {
  destroyCanvas();
  generateGeometricBrownianMotion(0);
  generateGeometricBrownianMotion(1);
}

function generateOU(methodFlag) {
  numberOfLine = parseInt(document.getElementById("OUinstances").value);
  let numSteps = parseInt(document.getElementById("OUnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (methodFlag == 0) {
    initializeGraph("Ornstein-Uhlenbeck");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Ornstein-Uhlenbeck");
    canvas2.style.display = "block";
  }
  const theta = parseInt(document.getElementById("OUtheta").value);
  const sigma = parseFloat(document.getElementById("OUsigma").value); //Math.sqrt(2)
  const X0 = parseInt(document.getElementById("OUX0").value);
  const mu = parseInt(document.getElementById("OUmu").value);
  const dt = parseFloat(document.getElementById("OUdt").value);
  let yValues = [X0];
  let newValue = 0;

  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      const k = theta * (mu - yValues[i]) * dt + sigma * dW;
      if (methodFlag == 0) {
        // Euler method
        newValue = theta * (mu - yValues[i]) * dt + sigma * dW;
      } else if (methodFlag == 1) {
        // Runge kutta method
        const k = theta * (mu - yValues[i]) * dt + sigma * dW;
        newValue = theta * (mu - yValues[i] * k) * dt + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [X0];
  }
}

function clickOU(methodFlag) {
  destroyCanvas();
  generateOU(0);
  generateOU(1);
}

function generateVasicek(methodFlag) {
  numberOfLine = parseInt(document.getElementById("Vinstances").value);
  let numSteps = parseInt(document.getElementById("VnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (methodFlag == 0) {
    initializeGraph("Vasicek");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Vasicek");
    canvas2.style.display = "block";
  }
  const k = parseFloat(document.getElementById("Vk").value);
  const theta = parseFloat(document.getElementById("Vtheta").value);
  const sigma = parseFloat(document.getElementById("Vsigma").value);
  const R0 = parseInt(document.getElementById("VR0").value);
  const dt = parseFloat(document.getElementById("Vdt").value);
  let yValues = [R0];
  let rt = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        rt = k * (theta - yValues[i]) * dt + sigma * Math.sqrt(dt) * dW;
      } else if (methodFlag == 1) {
        let val = k * (theta - yValues[i]) * dt + sigma * Math.sqrt(dt) * dW;
        rt = k * (theta - yValues[i] * val) * dt + sigma * Math.sqrt(dt) * dW;
      }
      yValues.push(yValues[i] + rt);
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function clickVasicek(methodFlag) {
  destroyCanvas();
  generateVasicek(0);
  generateVasicek(1);
}

function generateHullWhite(methodFlag) {
  numberOfLine = parseInt(document.getElementById("HWinstances").value);
  const numSteps = parseInt(document.getElementById("hwNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  const theta1 = parseFloat(document.getElementById("hwTheta1").value);
  const theta2 = parseFloat(document.getElementById("hwTheta2").value);
  const a = parseFloat(document.getElementById("hwA").value);
  const sigma = parseFloat(document.getElementById("hwSigma").value);
  const R0 = parseFloat(document.getElementById("hwR0").value);
  const dt = parseFloat(document.getElementById("hwDt").value);
  let yValues = [R0];
  let newValue = 0;
  if (methodFlag == 0) {
    initializeGraph("Hull-White");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Hull-White");
    canvas2.style.display = "block";
  }
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        newValue = (theta1 + theta2 * i - a * yValues[i]) * dt + sigma * dW;
      } else if (methodFlag == 1) {
        const k = (theta1 + theta2 * i - a * yValues[i]) * dt + sigma * dW;
        newValue = (theta1 + theta2 * i * k - a * yValues[i]) * dt + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function clickHullWhite(methodFlag) {
  destroyCanvas();
  generateHullWhite(0);
  generateHullWhite(1);
}

function generateCoxIngersollRoss(methodFlag) {
  numberOfLine = parseInt(document.getElementById("CIRinstances").value);
  const numSteps = parseInt(document.getElementById("CIRNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (methodFlag == 0) {
    initializeGraph("Cox-Ingersoll-Ross");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Cox-Ingersoll-Ross");
    canvas2.style.display = "block";
  }
  const k = parseFloat(document.getElementById("CIRK").value);
  const theta = parseFloat(document.getElementById("CIRTheta").value);
  const sigma = parseFloat(document.getElementById("CIRSigma").value);
  const R0 = parseFloat(document.getElementById("CIRR0").value);
  const dt = parseFloat(document.getElementById("CIRdt").value);
  let yValues = [R0];
  let newValue = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();

      if (methodFlag == 0) {
        newValue =
          k * (theta - yValues[i]) * dt + sigma * Math.sqrt(yValues[i]) * dW;
      } else if (methodFlag == 1) {
        let val =
          k * (theta - yValues[i]) * dt + sigma * Math.sqrt(yValues[i]) * dW;
        newValue =
          k * (theta - yValues[i] * val) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function clickCoxIngersollRoss() {
  destroyCanvas();
  generateCoxIngersollRoss(0);
  generateCoxIngersollRoss(1);
}

function generateBlackKarasinski(methodFlag) {
  numberOfLine = parseInt(document.getElementById("BKinstances").value);
  const numSteps = parseInt(document.getElementById("bkNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (methodFlag == 0) {
    initializeGraph("Black-Karasinski");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Black-Karasinski");
    canvas2.style.display = "block";
  }
  const theta1 = parseFloat(document.getElementById("BKTheta1").value);
  const theta2 = parseFloat(document.getElementById("BKTheta2").value);
  const a = parseFloat(document.getElementById("BKA").value);
  const sigma = parseFloat(document.getElementById("BKSigma").value);
  const R0 = parseFloat(document.getElementById("BKR0").value);
  const dt = parseFloat(document.getElementById("BKDt").value);
  let yValues = [R0];
  let newValue = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        newValue =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      } else if (methodFlag == 1) {
        let val =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
        newValue =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * val * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function clickBlackKarasinski() {
  destroyCanvas();
  generateBlackKarasinski(0);
  generateBlackKarasinski(1);
}

function generateHeston(methodFlag) {
  numberOfLine = parseInt(document.getElementById("Hinstances").value);
  let numSteps = parseInt(document.getElementById("hNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (methodFlag == 0) {
    initializeGraph("Heston");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Heston");
    canvas2.style.display = "block";
  }

  const mu = parseFloat(document.getElementById("HMu").value);
  const k = parseFloat(document.getElementById("HK").value);
  const theta = parseFloat(document.getElementById("HTheta").value);
  const sigma = parseFloat(document.getElementById("HSigma").value);
  const S0 = parseInt(document.getElementById("HS0").value);
  const v0 = parseFloat(document.getElementById("HV0").value);
  const dt = parseFloat(document.getElementById("HDt").value);
  let yValues = [S0];
  let v_t = [v0];
  let S_t = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      v_t.push(
        k * (theta - v_t[i]) * dt + sigma * Math.sqrt(v_t[i]) * dW1 + v_t[i]
      );
      const dW2 = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        S_t = mu * yValues[i] * dt + Math.sqrt(v_t[i]) * yValues[i] * dW2;
      } else if (methodFlag == 1) {
        let val = (S_t =
          mu * yValues[i] * dt + Math.sqrt(v_t[i]) * yValues[i] * dW2);
        S_t = mu * yValues[i] * dt * val + Math.sqrt(v_t[i]) * yValues[i] * dW2;
      }
      yValues.push(yValues[i] + S_t);
    }
    addLine(xValues, yValues);
    yValues = [S0];
    v_t = [v0];
    S_t = 0;
  }
}

function clickHeston() {
  destroyCanvas();
  generateHeston(0);
  generateHeston(1);
}

function generateChen(methodFlag) {
  numberOfLine = parseInt(document.getElementById("Cinstances").value);
  let numSteps = parseInt(document.getElementById("cNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (methodFlag == 0) {
    initializeGraph("Chen");
    canvas1.style.display = "block";
  } else if (methodFlag == 1) {
    initializeGraph2("Chen");
    canvas2.style.display = "block";
  }
  const R0 = parseFloat(document.getElementById("CR0").value);
  const theta0 = parseFloat(document.getElementById("CTheta0").value);
  const sigma0 = parseFloat(document.getElementById("CSigma0").value);
  const a = parseFloat(document.getElementById("CA").value);
  const b = parseFloat(document.getElementById("CB").value);
  const m = parseFloat(document.getElementById("CM").value);
  const mu = parseFloat(document.getElementById("CMu").value);
  const v = parseFloat(document.getElementById("CV").value);
  const g = parseFloat(document.getElementById("CG").value);
  const dt = parseFloat(document.getElementById("CDt").value);
  const k = parseFloat(document.getElementById("CK").value);
  let yValues = [R0];
  let theta_t = [theta0];
  let sigma_t = [sigma0];
  let r_t = 0;
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      sigma_t.push(
        mu * (b - sigma_t[i]) * dt +
          m * Math.sqrt(sigma_t[i]) * dW1 +
          sigma_t[i]
      );
      const dW2 = Math.sqrt(dt) * normalDistribution();
      theta_t.push(
        theta_t[i] +
          (v * (g - theta_t[i]) * dt + a * Math.sqrt(theta_t[i]) * dW2)
      );
      const dW3 = Math.sqrt(dt) * normalDistribution();
      if (methodFlag == 0) {
        r_t =
          k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
      } else if (methodFlag == 1) {
        let val =
          k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
        r_t =
          val * k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
      }
      yValues.push(yValues[i] + r_t);
    }
    addLine(xValues, yValues);
    yValues = [R0];
    theta_t = [theta0];
    sigma_t = [sigma0];
    r_t = 0;
  }
}

function clickChen() {
  destroyCanvas();
  generateChen(0);
  generateChen(1);
}

function stochasticEulerMethod() {
  numberOfLine = parseInt(document.getElementById("SDEinstances").value);
  const numSteps = parseInt(document.getElementById("SDENumSteps").value);
  const a = parseFloat(document.getElementById("SDEB").value);
  const b = parseFloat(document.getElementById("SDEB").value);
  const X0 = parseFloat(document.getElementById("SDEX0").value);
  const sigma = parseFloat(document.getElementById("SDESigma").value);
  const dt = parseFloat(document.getElementById("SDEDt").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  let yValues = [X0];
  initializeGraph("Euler General Method");
  canvas1.style.display = "block";
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      const k = a * (b - yValues[i]) * dt + sigma * dW;
      yValues.push(yValues[i] + k);
    }
    console.log(yValues);
    addLine(xValues, yValues);
    yValues = [X0];
  }
}

function stochasticRungeKuttaMethod() {
  numberOfLine = parseInt(document.getElementById("SDEinstances").value);
  const numSteps = parseInt(document.getElementById("SDENumSteps").value);
  const a = parseFloat(document.getElementById("SDEB").value);
  const b = parseFloat(document.getElementById("SDEB").value);
  const X0 = parseFloat(document.getElementById("SDEX0").value);
  const sigma = parseFloat(document.getElementById("SDESigma").value);
  const dt = parseFloat(document.getElementById("SDEDt").value);
  let X = [X0];
  initializeGraph2("Runge kutta general method");
  canvas2.style.display = "block";
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  for (let j = 0; j < numberOfLine; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      const k1 = a * (b - X[i]) * dt + sigma * dW1;
      const dW2 = Math.sqrt(dt) * normalDistribution();
      const k2 = a * (b - (X[i] + 0.5 * k1)) * dt + sigma * dW2;

      const increment = k2;
      X.push(X[i] + increment);
    }
    addLine(xValues, X);
    X = [X0];
  }
}

function clickSDE() {
  destroyCanvas();
  stochasticEulerMethod();
  stochasticRungeKuttaMethod();
}

function normalDistribution() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function initializeGraph(labelGraph) {
  ctx.clearRect(0, 0, chartID.width, chartID.height);

  const myChart = new Chart(chartID, {
    type: "line",
    data: {
      labels: [], // xValues
      datasets: [
        {
          label: labelGraph,
          data: [], // yValues
          borderColor: "#1E1E1E",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Euler Method",
      },
      elements: {
        line: {
          tension: 0.1,
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  canvasArr.push(myChart);
}

function initializeGraph2(labelGraph) {
  ctx2.clearRect(0, 0, chartID2.width, chartID2.height);

  const myChart2 = new Chart(chartID2, {
    type: "line",
    data: {
      labels: [], // xValues
      datasets: [
        {
          label: labelGraph,
          data: [], // yValues
          borderColor: "#1E1E1E",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      responsive: true,
      title: {
        display: true,
        text: "Runge Kutta Method",
      },
      elements: {
        line: {
          tension: 0.1,
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  canvasArr.push(myChart2);
}

function addLine(xValues, yValues) {
  const color = getRandomRGBAColor();
  let newDataset = {
    fill: false,
    lineTension: 0,
    backgroundColor: "#2F3527",
    borderColor: color,
    data: yValues,
  };
  canvasArr[canvasArr.length - 1].data.datasets.push(newDataset);
  canvasArr[canvasArr.length - 1].data.labels = xValues;
  canvasArr[canvasArr.length - 1].update();
}