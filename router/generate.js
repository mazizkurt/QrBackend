const express = require("express");
const router = express.Router();
var QRCode = require("qrcode");
var toSJIS = require("qrcode/helper/to-sjis");
const imageToBase64 = require("image-to-base64");
var fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
router.post("/generate", (req, res) => {
  var { margin, scale, small, width, dark, light, text } = req.body;
  var fileName = Date.now();
  if (text) {
    QRCode.toFile(
      `images/${fileName}.png`,
      text,
      {
        errorCorrectionLevel: "H",
        toSJISFunc: toSJIS,
        margin: margin ? margin : 4,
        scale: scale ? scale : 4,
        small: small ? small : false,
        width: width ? width : 300,
        quality: 1,
        color: {
          dark: dark ? dark : "#000000ff", // Blue dots
          light: light ? light : "#ffffffff", // Transparent background
        },
      },
      function (err, url) {
        if (err) res.json({ success: false, message: err });
        imageToBase64(`images/${fileName}.png`)
          .then((response) => {
            res.json({ success: true, message: fileName, base64: response });
          })
          .catch((err) => {
            res.json({ success: false, message: err });
          });
      }
    );
  } else {
    res.json({ success: false, message: "Please enter text" });
  }
});
router.post("/generate/vcard", (req, res) => {
  var {
    margin,
    scale,
    small,
    width,
    dark,
    light,
    fn,
    ln,
    email,
    phone,
    url,
    company,
    companyPos,
    country,
    city,
    street,
    zip,
  } = req.body;
  var vcard =
    "BEGIN:VCARD\r\n" +
    "FN:" +
    fn +
    " " +
    ln +
    "\r\n" +
    "N:" +
    ln +
    ";" +
    fn +
    ";;;\r\n" +
    "EMAIL:" +
    email +
    "\r\n" +
    "ADR;WORK:;;" +
    company +
    " " +
    companyPos +
    " " +
    country +
    " " +
    city +
    " " +
    street +
    " " +
    zip +
    ";;;;\r\n" +
    "TEL;TYPE=CELL:" +
    phone +
    "\r\n" +
    "\r\n" +
    "TITLE:" +
    companyPos +
    "\r\n" +
    "\r\n" +
    "URL:" +
    url +
    "\r\n" +
    "END:VCARD\r\n";
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});

async function create(
  dataForQRcode,
  center_image,
  width,
  cwidth,
  margin,
  scale,
  small,
  dark,
  light
) {
  var fileName = Date.now();
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, dataForQRcode, {
    errorCorrectionLevel: "H",
    margin: margin ? margin : 4,
    scale: scale ? scale : 4,
    small: small ? small : false,
    color: {
      dark: dark ? dark : "#000000ff", // Blue dots
      light: light ? light : "#ffffffff", // Transparent background
    },
  });

  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  const center = (width - cwidth) / 2;
  ctx.drawImage(img, center, center, cwidth, cwidth);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`images/${fileName}.png`, buffer);
  var obj = {
    dataUrl: canvas.toDataURL("image/png"),
    image: `images/${fileName}.png`,
  };
  return obj;
}
router.post("/generate/message", (req, res) => {
  var { margin, scale, small, width, dark, light, message, phone } = req.body;
  var vcard = `smsto:${phone}:${message}`;
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});

router.post("/generate/email", (req, res) => {
  var { margin, scale, small, width, dark, light, email, subject, message } =
    req.body;
  var vcard = `MATMSG:TO:${email};SUB:${subject};BODY:${message};;`;
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});
router.post("/generate/phone", (req, res) => {
  var { margin, scale, small, width, dark, light, phone } = req.body;
  var vcard = `"TEL:"${phone}`;
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});
router.post("/generate/link", (req, res) => {
  var { margin, scale, small, width, dark, light, link } = req.body;
  var vcard = link;
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});
router.post("/generate/wifi", (req, res) => {
  var { margin, scale, small, width, dark, light, value, network, password,hidden } =
    req.body;
  var vcard = `WIFI:T:${value};S:${network};${value !== 'nopass' ? `P:${password};` : ''}H:${hidden};`;
  var fileName = Date.now();

  QRCode.toFile(
    `images/${fileName}.png`,
    vcard,
    {
      errorCorrectionLevel: "H",
      toSJISFunc: toSJIS,
      margin: margin ? margin : 4,
      scale: scale ? scale : 4,
      small: small ? small : false,
      width: width ? width : 300,
      quality: 1,
      color: {
        dark: dark ? dark : "#000000ff", // Blue dots
        light: light ? light : "#ffffffff", // Transparent background
      },
    },
    function (err, url) {
      if (err) res.json({ success: false, message: err });
      imageToBase64(`images/${fileName}.png`)
        .then((response) => {
          res.json({ success: true, message: fileName, base64: response });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  );
});
async function create(
  dataForQRcode,
  center_image,
  width,
  cwidth,
  margin,
  scale,
  small,
  dark,
  light
) {
  var fileName = Date.now();
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, dataForQRcode, {
    errorCorrectionLevel: "H",
    margin: margin ? margin : 4,
    scale: scale ? scale : 4,
    small: small ? small : false,
    color: {
      dark: dark ? dark : "#000000ff", // Blue dots
      light: light ? light : "#ffffffff", // Transparent background
    },
  });

  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  const center = (width - cwidth) / 2;
  ctx.drawImage(img, center, center, cwidth, cwidth);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`images/${fileName}.png`, buffer);
  var obj = {
    dataUrl: canvas.toDataURL("image/png"),
    image: `images/${fileName}.png`,
  };
  return obj;
}

router.post("/generate/logo", async (req, res) => {
  var { margin, scale, small, width, dark, light, center_image, url } =
    req.body;
  if (url) {
    if (center_image) {
      const qrCode = await create(
        url,
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABEVBMVEX/////vgCfB6khKzb/vAD+vxf/ugCYAKP/1oacAKaXALD/uQCcAKf///3/8M7/wQDw3fEbJjL/13/z5PT/8tb/5Kr68vr/+u3nzOm5YsD//P/MkdH//PTr1e3cteD16vbWqdrIh83gvOOpMrL/5rP/6bzlxuf/9d+zUrv/ykf/35z/0mvDfcn/3ZQAFjgOHCrQm9WvRbf/xTP/8dK9bMT/1HXJi8//xjv/zVrAdMayTrqsObT/z2Dv7/AAFSUABhxES1Pg4OIAABSChooAHTi4jhvMzc+mIa+0trh/g4ifoaVdYmkxOUNiZ27lrA27vb/SnxREQTFVSy+xiR0AEDkBIjZoVyyJbibuswk2ODOceiJEw5mmAAAMzElEQVR4nO2d+1viOBfHCxZqhwLCiChUxQsgCIq38S46zgwzzm1335l5Z/f//0O2RaFJe5ImaVJcn35/2We0SD57kpNzTtJE0xIlSpQoUaJEiRIlSpQoUaJEiRIlSgRpvX4w2tpp1GbdDmXaMEzLkWFtzrolinRgpB9lGYNZt0WJjs30VEZr1q1RoGXDA0xb6Vk3R4FWLIQwbbzAoWiigGnzfNbtka51AyO0DmbdIOnyE45m3SDpqvkIL2bdIPlKY57mBY5D7QInfIFz/gbmTI3lWbdHvjaxgWguzbo98oU50xc4WTjaQgaiWZ91a1Sojkbeq7NujQoteN30RQbeGtpNX2Yn1bTBtJsar2fdFkj56lFzu9vvz8+Xy+e9jY36Wmt1iaviUpsQWiuqGikmu73dvTotZnNZV7qj1CvTlWEY1uVOfW2BlXMy6T8jP2MXurvFJ66Up8yrqcuwLJf0oL7MQlmzxiPRfCYmtJvlwzFbKiCPcAJqGtbOYCH0b47jGst6DvHMYv8wB8LBhE+Uo0GYBxkYjs19/yfWW5trm/G6nqNyhkxHJHyEvFij/+3WSm8d+efqYCftDGe3o8dWfVucT9HxKIQupGH2WO2xfG65JeLJB4+Vcj3JrhyG4tEJXUdirDD4yqV62sFDPxcD4uKJ41hC8UIJXXvshHmdgYnjjREVVxibp2x4DIQu48o65btejwzoQ0qrU5UMMx8LodtX3xC/bNUI2O/RiOHzjaDylRQHHxuhw2iR/OoIBkybDUWADh8HHjOhOxzBuX0d6qJjQjXlqWaGk4+Z0GVsQF+ZjtOG7Q5b/9R1JDRlJnSG1goQsLZI41B+AS5fztH5HCwnNs1lU5nD086pzk/ojEag2S3LBB5VkPk3aQPQZdMzu/OVwmI1n3cfX8wKEMILvkvHRpAR7tIRZJ/liHQOXGe+2c5jHygIEbo9Ffj2hZ5/zjd3JANWSOGZ7tB1j4BPiBKmzUvIpy41DkwvcLMMySVU+wzuoA7eSdOGPyNM6IwwOMJZ2jx3UotxvcBqyAUsgAbUs6mTAuVDwoRO1ksMxpeWG4P6QHbuNA+NQD3XaeZpn4pA6KSOcdZmqqdAD83q89WQz0UhdMZZfKtNQA91umeXMPjQD0YhjBGxEuyh2WKF5ZNHHqHhypwm6IyI8XTUcqCHZlOhfPZiodKfv5rGNLWl9dXlzUHPLbIEM1kiohlDvSkfmCT0bJ/mXqrN/m4nlctidcWM9/v1Vn3HZKW00srriPah7ufbJY6//FH3KgVWTDP4g7WWM6sxMVqXigGrGV9jsxnS9HfU7ejEqk0m+PzyOVB4CUpxubudwlvsdFDwuXzhhExHIHQsubbFYEil+y7bvu6WzSxCjzV3Q0saIKGjFgOjQocaACxDD5V1hoyYRKhpm6GMlqVqD3Qbb7mebQafaTIm/GRCTVtLQ8ltDEPRZ8HsYSBEs7vMBTcaoVbrhZjRCFnaEFMVdzLZ3cADTN2ThVDTVkd0M5q0YrGgbHyayHX9fCd89dKw7zsm1Qsfh6LsZN4RNtEHhqBd5uJjINQa1J4qv5+eYYC6b5LoM6w28RJqq6Sa6NiIsv0pFmzrKdzHUOtt4oTa0hZlMJo9qYAVDDCDxaHVM84OykyoaRcURKkbahbRfFA/xBKJrggfKyH2ColCZ2Oj8wQO2IaqGRIJtRUyosTg7RQFxLpoN6SiH52Qgihvg+k8YiY9hQBWO4IG5CHULokeVZYRC+ggzLaRX3BPEUKENdJiqKyRaKMcWSTbBQumCgi118ToRo47vUIAc169KVitUUbo28COSMqcuI1YCkkHA8UMlYRaj+RtjOhlKRt1o53pjyMNQX5CbAc7ZsRGZEKkjyJudDvSEBQgXCD0U2srKmATQclNvUw/OiAnoe9tGaSbRpww8kgw4xXVyhIAeQlJey+i+hoko9BPJz88ieZEBQkJ/jTizoQ26kcnCZMcQG5C7UDF7pIO0kcnRQtJgPyEq7ARzY0IgAWkjx4+/Sy47BQXobYDGjHSZkRkUp+Eo31ZgAKEBCNGiNyaHs0kmAFWRuMjJCQZESZ9xIT6Y9LblAcoQtgCjSj+8sw2YsLHgLstrYuKEcJzovh84U32T27GjhyLRiV8AwY2ogMRMWHusfrrX/uNnxCOTk3B2nDGb8IrmX1UjBDe+iwYuKGOdBxxV+QCihHWwS2lYkcreOW1x4B0UTKgGCE8JVoifwoBGq/B5KOm9MyEdx/vP326f/hwDf4W9KaGyErbrmfCDP5vtYQPt8ObfVc3w88fgN+vgIQCOaKNmHBbk5LTsxB+vLkpzU1UGn4JMg6ggSjiTBG34oYztnQLQoTXn4dziErDzw+BrroMDUSRt7q9qU93I9KzOAjvSvsY4O0d0LAl8F0n/lNcED+Ta8sNR4mE16USBvgFbho0IwpMF2VsqsinFJgwQHiLAc4NIQtqsKsR2OmG5IUViUkvjfDhBgMsfSU0DaoN85cUkdw+W8WKNYCKxaIEwuu3GODczUdC2xoQYZp3Sf/E66RnWLEG4vv2/v1vEUic8H7fR/id0LY1MG7jre177XU6KdXNFP/4c+/du72/vvEj4oT4IKTYECwq8h42dIR1Ulq4Vvzfj3HTSj/+4EbECD8MfYSlT4TGgZEp7/rMvNdJO2iaGAT8tjdp0M/fkQj9ndQxojfZX6OhDZgi8gamntWyXa1IM+Gvn5MG/fw/rxExws/+XjpX+jz95S3aY8HVUk4bVr2Bl23Ts8KfXoPmIhF+CRDO3Xx9cpBf3z5IJkT6pa5RJ/vfe16DfkQiDPA52t9/+HD34aG0v38fRsjpaZDEabdJNWEGIdyTbUOX8cZJpZz/oDYEPQ0nITIMK/TiU/HvacNKf0UivAUJJ6AoIZRccM74VaSThsRrxX/eTU34PhLhp4AvRUck6kvXIEK+pQt0eqCGM67+fvI1P7lNiBN+vKEQDtEsEYza+OLSMkciUfz9517JmQz3fvHy+Qjv/DM+otIt+iRUbePc/cVX9y2+/1Wa+8Uf0fijNspAvEGHIZg98RVM85ypUnEsfkAf4XeyEYfYg9BKMN9BEVJXX9gJCfNFwIRa9EoULQ5VSRiIvSejEK9mwGEpVzWxr6JiwUCoPcCIvmoGmB7yBW0qympMhNonCPGtr2QKFjH4FhDlLqHxEGr3AcTSjb8mDO1v41sEzscFCNW8v+/jFdPhrb8iDJ67Y5KPWgIUUnZSS+iYcVrWL+0PvwRrNfAw5DpLoRCXKyWszFx//Lo/dPXlnnlhhu8lr9gmC8r64fXd3R2cLNQknF8mb0eQOCFZUGLBu8jNE3fHT3gBrh7yHWkifyVUIiG8Z9/gK3iHZoSzJAT3CfMuPMU24QsQgn6Ge1tbXHwihOAKN3c1ODYT8hPWwGNeuN/uesaE4G4h7k6qYkuCJEJwBd8h5Fw6jC/w5iaEXybl36QwPi6dWTESgttMRHbqz/MoUgDESQi/gxj9pSC67CipFh8h4aUgNcdjeIqPkNBHlV/iEckv8RDWSC89Kb/wKcqWTB5CMKdwD45QRjZRlDidg3CD8PKh9NNYgzqJhbBBersyhqt0uhEqAsyE8HskMThSV0cxEBIBlZ9M54p3oUqAkHSodVwXzURwNWyExDfx47r8MMJLGEyEJCcjsh9RTFW1hG/Ih2HF4WbGEl+qCies7ZAB47sMib6lKBLhAuXEtrj6qCtRwFDCOu0sszjv5xSe9OmEC5e08+goV5fIV16FDWsb1MPopB+eT5fohEEhDDn6Ms5BOJZgCkUk3BzRz72M5TRoTAWxTB8mrDVC+GZyC7DYORIQ4ULPCj1iN4akMCihfhogfD3YYjjT25jJ7aNCb9BihOubvRHTkeWG3OMgmSVymMQT4dJ6q3E+Yj133pjZbeoCQzFzfn58sTWyDIP97oBZWdAVf6KYeWW5YmR7BIwzlPErf8qLyH+/hdKj2BkQeR0qL6Gl+mbDcEROK3ISWmllt/6xI/Id9clHCN/2FLt2eRB5CK1ZOlFMPCfSchBa5qyHoKdF9te+2QmNg2fRQ5+UZz7FhpXQVHbtpqi2GZf32QgtY+U5GfBR9hXTAd9MhMYo/mSQRQWWW3MZCE31a7zCYrhZNpTQNOsx12O4FH47MJ3Qcvie3wD0afuQykgjtIxRY9bNZ1LhjHLjE5HQMo2d2O65jyy7e5gjQMKEDt7lQMEVMirV7p5C164BhJaT718O4i6GSlG1eeKaEsfECC3HdsbofO3ZOxeK7EL/KqOPb9F7RHUIx2UM02EzRzv11n+Zbiq73az0T646Gfc65FdWOn25ctxrbC78xwZeokSJEiVKlChRokSJEiVKlChRokSJEiVKlChRIlj/ApgIIGDBCEskAAAAAElFTkSuQmCC",
        150,
        50,
        margin,
        scale,
        small,
        dark,
        light
      );
      res.json({ success: true, message: qrCode });
    } else res.json({ success: false, message: "center_image required !" });
  } else res.json({ success: false, message: "url required !" });
});
module.exports = router;
