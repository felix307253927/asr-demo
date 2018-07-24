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
    this.name = ''
    this.transResult = ''
    this.registerIpc(win)
  }

  registerIpc(win) {
    ipcMain.on('open-file', (e, sample) => {
      this.open(win, e, sample)
    })
    ipcMain.on('trans-result', (e) => {
      e.sender.send('trans-result', this.transResult)
    })
  }

  open(win, event, sampleRate = 16000) {
    if (this.transStream) {
      this.transStream.stop()
      this.transStream = null
    }
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
          this.name = path.basename(filepath)
          this.transResult = ''
          this.transStream = new TransStream({
            service: global.config.service,
            sampleRate,
            highWaterMark
          })
          fs.createReadStream(filepath, {
            highWaterMark
          })
            .pipe(this.transStream)
            .on('result', (text, isEnd) => {
              if (!isEnd) {
                this.transResult += text
              } else {
                this.transResult = text
              }
              event.sender.send('trans-result', this.transResult, isEnd)
            })
            .on('result-error', (e, err) => {
              this.transResult = ''
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