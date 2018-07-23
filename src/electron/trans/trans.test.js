/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-23 14:49:44 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-23 14:49:44 
 */
'use strict';

const fs = require("fs")
const TransStream = require('./TransStream')
const highWaterMark = 16 * 1024

fs.createReadStream("/home/felix/Music/16K-wav.wav", {
  highWaterMark
}).pipe(new TransStream({
  service: "https://demo-edu.hivoice.cn:10443/asr/pcm"
})).on('result', (text, isEnd) => {
  console.log("result:", text, isEnd);
})

