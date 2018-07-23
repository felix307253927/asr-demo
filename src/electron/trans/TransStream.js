/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-23 14:30:46 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-23 14:30:46 
 */
'use strict';
const uuid = require('uuid/v1')
const axios = require('axios')
const FormData = require('form-data')
const { Transform, Readable } = require("stream")

class TransStream extends Transform {

  constructor(options = {}) {
    super(options)
    this.servUrl = options.service || "https://demo-edu.hivoice.cn:10443/asr/pcm"
    this.appkey = options.appkey || "45gn7md5n44aak7a57rdjud3b5l4xdgv75saomys"
    this.XNumber = 0
    this.sid = uuid()
  }

  _transform(chunck, encoding, next) {
    this.send(chunck)
    setTimeout(() => {
      next()
    }, 300)
  }

  _final() {
    this.send(null, true)
  }

  send(stream, isEnd) {
    let formData = new FormData()
    let headers = {
      'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary(),
      'Transfer-Encoding': 'chunked',
      'appkey': this.appkey,
      'session-id': this.sid,
      'X-EngineType': 'asr.zh_CH',
    }
    if (!isEnd) {
      headers["Connection"] = 'keep-alive'
      headers["X-Number"] = this.XNumber++
      formData.append('voice', stream, { filename: 'buffer' })
    } else {
      headers["Connection"] = 'close'
      headers["X-Number"] = `${this.XNumber}$`
    }

    axios.post(this.servUrl, formData, {
      headers
    }).then((res) => {
      if (res.data) {
        if (isEnd && res.data.allResult) {
          const result = []
          res.data.allResult.forEach(t => {
            if (t.text && t.text.status === 'const') {
              result.push(t.text.result)
            }
          })
          this.isEnd = true
          this.emit('result', result.join(''), this.isEnd)
        } else if (!this.isEnd && res.data.currResult && res.data.currResult.text && res.data.currResult.text.status === 'const') {
          this.emit('result', res.data.currResult.text.result)
        }
      }
    }).catch((err) => {
      this.hasError = true
      if (isEnd) {
        this.emit('result-error', err.toString())
      }
    })
  }
}

module.exports = TransStream