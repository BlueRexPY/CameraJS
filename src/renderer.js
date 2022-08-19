var video = document.querySelector("#video");
var textVideo = document.querySelector("#text-video");
var canvas = document.querySelector("#canvas-video");
var ctx = canvas.getContext("2d");
var width = 80
var height = 100

var gradientList = ["░▒▓█", ".:;-+"];
var gradient = gradientList[0];

var changeState = false;

const init = () => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

const render = (ctx) => {
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(video, 0, 0, width, height);
};

const getPixelsGreyScale = (ctx) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let row = 0;
  const res = new Array(height).fill(0).map(() => []);
  for (let i = 0, c = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    let curr = res[row];
    curr.push(avg);
    if (c < width) {
      c++;
    }
    if (c === width) {
      c = 0;
      row += 1;
    }
  }
  return res;
};

const getCharByScale = (scale) => {
  const val = Math.floor((scale / 255) * (gradient.length - 1));
  return gradient[val];
};

const renderText = (node, textDarkScale) => {
  let txt = `<div>`;
  for (let i = 0; i < textDarkScale.length; i++) {
    for (let k = 0; k < textDarkScale[i].length; k++) {
      txt = `${txt}${getCharByScale(textDarkScale[i][k])}`;
    }
    txt += `<br>`;
  }
  txt += `</div>`;
  node.innerHTML = txt;
};

init();
const interval = setInterval(() => {
  requestAnimationFrame(() => {
    render(ctx);
    const chars = getPixelsGreyScale(ctx);
    renderText(textVideo, chars);
  });
});

document.querySelector("#change").addEventListener("click", (e) => changeStyle());
document.querySelector("#copy").addEventListener("click", (e) => copyAscii());

const changeStyle = () => {
  if (!changeState) {
    width = 200
    changeState = !changeState;
    gradient = gradientList[1];
  } else {
    width = 80
    changeState = !changeState;
    gradient = gradientList[0];
  }
};

const copyAscii = () =>{
  navigator.clipboard.writeText(textVideo.innerText)
}