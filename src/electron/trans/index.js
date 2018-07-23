/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-23 14:30:46 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-23 14:30:46 
 */
'use strict';
const fs = require('fs')
const path = require('path')
const { dialog, ipcMain } = require('electron')
const TransStream = require('./TransStream')
const highWaterMark = 16 * 1024

class Trans {
  constructor(win) {
    this.registerIpc(win)
  }

  registerIpc(win) {
    ipcMain.on('open-file', (e) => {
      this.open(win, e)
    })
  }

  open(win, event) {
    dialog.showOpenDialog(win, {
      title: "请选择要转写的音频文件",
      properties: ['openFile'],
      filters: [
        { name: '音频文件', extensions: ['wav', 'pcm'] }
      ]
    }, (o) => {
      if (o) {
        const filepath = o[0]
        if (/\.(wav|pcm)$/.test(filepath.toLowerCase())) {
          // const name = path.basename(filepath)
          fs.createReadStream(filepath, {
            highWaterMark
          })
            .pipe(new TransStream())
            .on('result', (text, isEnd) => {
              event.sender.send('trans-result', text, isEnd)
            })
            .on('result-error', (e, err) => {
              event.sender.send('trans-error', err)
            })
          event.sender.send(filepath)
        } else {
          event.sender.send('open-file')
          this.showError(win, '打开音频文件失败', '请选择pcm或者wav文件')
        }
      } else {
        event.sender.send('open-file')
      }
    });
  }
}
module.exports = Trans