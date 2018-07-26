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
          const _results = []
          const REG = /[。；，？！.,;?!]$/
          const DOTREG = /[,，]$/
          fs.createReadStream(filepath, {
            highWaterMark
          })
            .pipe(this.transStream)
            .on('result', (text, isEnd) => {
              if (text) {
                if (!isEnd) {
                  let idx = _results.length - 1
                  idx = idx >= 0 ? idx : 0
                  const last = _results[_results.length - 1] || ''
                  if (idx === 0 && !last.length) {
                    _results.push(`  ${text}`)
                  } else if (last.length >= 300 && REG.test(text)) {
                    if (DOTREG.test(last)) {
                      _results[idx] = `${last.substr(0, last.length - 1)}。\r\n`
                    } else {
                      _results[idx] = `${last}${REG.test(last) ? "" : "。"}\r\n`
                    }
                    _results.push(`  ${text}`)
                  } else {
                    _results[idx] = `${last}${text}`
                  }
                  this.transResult = _results.join('')
                } else {
                  this.transResult = text
                }
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