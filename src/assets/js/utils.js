/*
 * Created by jitianxiang on 2018/7/9
 */
var jsonData = require('../json/people.json')
var returnData = []

export function getContacts() {
  return new Promise((resolve, reject) => {
    recursive(jsonData).then(() => {
      const index = returnData.findIndex((item) => {
        return item.id === '1_001'
      })
      returnData.splice(index, 1)
      resolve(returnData)
    })
  })
}

function recursive(arr) {
  //递归的promise化
  return Promise.resolve().then(() => {
    return Promise.all(arr.map((item) => {
      if (item.hasOwnProperty('manager')) {
        returnData = returnData.concat(item.manager)
        return recursive(item.children)
      } else {
        returnData.push(item)
        return Promise.resolve()
      }
    }))
  })
}

export function uuid() {
  const alps = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = [];
  for (let i = 0; i < 7; i++) {
    s[i] = alps.substr(Math.floor(Math.random() * 62), 1);
  }
  return s.join("");
}

/*判断文件类型的正则表达式*/
export const suffixRegex = {
  image: '(.jpg|.png|.gif|.ps|.jpeg|.svg)$',
  /*图片*/
  excel: '(.xls|.xlsx|.xlsm|.xltx|.xltm|.xlsb|.xlam)$',
  /*excel文件*/
  pdf: '(.pdf)$',
  /*pdf*/
  audio: '(.mp3|.aac|.ogg|.wav|.amr)$',
  /*音频文件*/
  word: '(.doc|.docx)$',
  /*word文件*/
  compressed: '(.zip|.rar|.7z|.iso)$',
  /*压缩文件*/
  video: '(.mp4|.avi|.mkv|.rm|.wmv|.mov)$',
  /*视频文件*/
  powerpoint: '(.ppt|.pptx)$',
  /*ppt*/
  situation: '(.json)$' /*态势文件*/
}

export function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}
