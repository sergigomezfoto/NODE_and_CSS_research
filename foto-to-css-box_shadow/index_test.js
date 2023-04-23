const Jimp = require("jimp");
const fs = require("fs");

const rgba2hex = (rgba) =>
  `#${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    .slice(1)
    .map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, "0").replace("NaN", ""))
    .join("")}`;

const readImage = async () => {
  const rgbaColorTest = true;
  const img = await Jimp.read("./test-assets/christinasworld.png");
  const factor = 1;
  ////////////////////////////////////////////CGAP
  const horGap = 1;
  const verGap = 1;
  //////////////////////////////////////////
  const blurRadius = 0;
  const spreadRadius = 2;
  const imgWidth =1;
  const imgHeight = 1;
  const imgUnits = "px";


  let firstPixel;
  let textBlurAndColor_txt = "";
  let blurAndColor_txt = "";
  let textBlurAndColor_txt_shuffled = "";
  let blurAndColor_arr = [];
  let position_txt = "";
  let position_txt_sh = "";
  let position_arr = [];
  let shufled_arr = [];
  let position_arrShufled = [];
  let counti = 60;
  let countj = 0;

  for (let j = 0; j < img.bitmap.height - 1; j++) {
    for (var i = 0; i <= img.bitmap.width - 1; i++) {
      const rgba = Jimp.intToRGBA(img.getPixelColor(i, j));
      let rgbaColor = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a / 255})`;
      let hexColor = rgba2hex(rgbaColor);
      if (i === 0 && j === 0) {
        firstPixel = `${!rgbaColorTest ? rgbaColor : "greenyellow"};`;
      }
      if (i % factor === 0 && j % factor === 0) {
        if (i === 0) {
          counti = 0;
        }
        position_txt = `${horGap > 0 ? counti : i}${(horGap > 0 ? counti : i) > 0 ? "px" : ""} ${verGap > 0 ? countj : j}${
          (verGap > 0 ? countj : j) > 0 ? "px" : ""
        }`;
        position_txt_sh = `${horGap > 0 ? counti * 100 : i * 100}${(horGap > 0 ? counti * 100 : i * 100) > 0 ? "px" : ""} ${verGap > 0 ? countj * 100 : j * 100}${
          (verGap > 0 ? countj * 100 : j * 100) > 0 ? "px" : ""
        }`;
        position_arr.push(position_txt);
        shufled_arr.push(position_txt_sh);
        blurAndColor_txt = `${blurRadius > 0 ? " " + blurRadius + "px" : ""}${blurRadius > 0 ? " " + spreadRadius + "px " : ""}${hexColor}`;
        blurAndColor_arr.push(blurAndColor_txt);
        counti = horGap === 0 ? counti + 1 : counti + horGap;
      }
    }
    if (j % factor === 0) {
      countj = verGap === 0 ? countj + 1 : countj + verGap;
    }
  }

  position_arrShufled = shufled_arr.sort((a, b) => 0.5 - Math.random());
  for (let i = 0; i < position_arr.length; i++) {
    textBlurAndColor_txt += ` ${position_arr[i]}${blurAndColor_arr[i]},`;
    textBlurAndColor_txt_shuffled += ` ${position_arrShufled[i]}${blurAndColor_arr[i]},`;
  }
  let allCss = `
  #pictureID {position: relative;
    top: ${0 + spreadRadius}px;
    left: ${0 + spreadRadius}px;
    width:${imgWidth + imgUnits};
    height:${imgHeight + imgUnits};
    background-color:${firstPixel}

     transition:box-shadow 1s 
  }
  .mixed{
       box-shadow:${textBlurAndColor_txt_shuffled.replace(/.$/, ";")}
     }
     .change{
       box-shadow:${textBlurAndColor_txt.replace(/.$/, ";")}
     } 
    `
    ;
  fs.writeFileSync("../htmlimagetocss/imageId.css", allCss);
};

readImage();
