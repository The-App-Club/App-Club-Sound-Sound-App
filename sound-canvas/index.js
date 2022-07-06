function convertSound2Base64(audioFile) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (event) => {
      resolve(event.target.result);
    };
    fileReader.onerror = (event) => {
      reject(error);
    };
    fileReader.readAsDataURL(audioFile);
  });
}

function analyserInitialize() {
  if (!audioDomContext) {
    audioDomContext = new AudioContext();
  }
  analyser = audioDomContext.createAnalyser();
  analyser.fftSize = 64;
  if (MEDIA_ELEMENT_NODES.has(audioDom)) {
    audioSource = MEDIA_ELEMENT_NODES.get(audioDom);
  } else {
    audioSource = audioDomContext.createMediaElementSource(audioDom);
    MEDIA_ELEMENT_NODES.set(audioDom, audioSource);
  }
  audioSource.connect(analyser);
  analyser.connect(audioDomContext.destination);
}

function handleSoundPlay() {
  if (audioDom) {
    audioDom.play();
    console.log("play");
    audioDom.addEventListener("playing", handleSoundPlaying);
    audioDom.addEventListener("ended", handleSoundEnded);

    analyserInitialize();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasDom = document.querySelector(".reflector");
    const barWidth = canvasDom.width / bufferLength;
    let barHeight;
    let x = 0;

    function animate() {
      x = 0;
      const canvasDomContext = canvasDom.getContext("2d");
      canvasDomContext.clearRect(0, 0, canvasDom.width, canvasDom.height);
      analyser.getByteFrequencyData(dataArray);
      for (let index = 0; index < bufferLength; index++) {
        barHeight = dataArray[index];
        canvasDomContext.fillStyle = `black`;
        canvasDomContext.fillRect(
          x,
          canvasDom.height - barHeight,
          barWidth,
          barHeight
        );
        x = x + barWidth;
      }
      requestAnimationFrame(() => {
        animate();
      });
    }

    animate();

    // const oscillator = audioDomContext.createOscillator();
    // oscillator.connect(audioDomContext.destination);
    // oscillator.type = "triangle"; // sine, square, trianglem sawtooth
    // oscillator.start();
    // setTimeout(() => {
    //   console.log(audioDomContext);
    //   oscillator.stop();
    // }, audioDom.duration * 1000);
  }
}

function handleSoundPlaying() {
  console.log("playing");
}

function handleSoundEnded() {
  console.log("ended");
}

async function handleFileUpload(event) {
  const fileObject = event.target.files[0];

  const base64 = await convertSound2Base64(fileObject);
  audioDom = new Audio(base64);

  for (let i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }
}

let audioDom;
let audioDomContext;
let audioSource;
let analyser;
let stats;
// https://stackoverflow.com/questions/35492397/remove-createmediaelementsource
let MEDIA_ELEMENT_NODES = new WeakMap();

stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

let parameter = {
  workspaceWidth: 700,
  workspaceHeight: 700,
};

// https://github.com/GRI-Inc/App-Club-Image-Clean-App/blob/main/image-proportion/index.js#L251
let controllerInfo = {
  "File Upload": () => {
    // http://zhangwenli.com/blog/2015/05/29/upload-images-with-dat-gui/
    const fileDom = document.querySelector(".file");
    fileDom.addEventListener("change", handleFileUpload);
    fileDom.click();
  },
  "Sound Play": handleSoundPlay,
  "Workspace Width": 700,
  "Workspace Height": 700,
};

const gui = new dat.GUI();
gui.width = 300;
gui.add(controllerInfo, "File Upload");
gui.add(controllerInfo, "Sound Play");
gui.add(controllerInfo, "Workspace Width", 1, 1000, 1).onChange((event) => {
  detectChangeParameter(event, "Workspace Width");
});
gui
  .add(controllerInfo, "Workspace Height", 1, window.innerHeight, 1)
  .onChange((event) => {
    detectChangeParameter(event, "Workspace Height");
  });

function detectChangeParameter(event, keyName) {
  if (keyName === "Workspace Width") {
    parameter.workspaceWidth = event;
  }
  if (keyName === "Workspace Height") {
    parameter.workspaceHeight = event;
  }

  initialize();
}

function initialize() {
  const canvasDom = document.querySelector(".reflector");
  canvasDom.width = parameter.workspaceWidth;
  canvasDom.height = parameter.workspaceHeight;
}

function loop() {
  requestAnimationFrame(loop);
  stats.begin();
  stats.end();
}

initialize();
loop();
