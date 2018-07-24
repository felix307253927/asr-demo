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
const { Transform } = require("stream")
const Resampler = require('../../utils/Resampler')

function int16ToFloat32BitPCM(input) {
  let i = input.length;
  let output = new Float32Array(i);
  while (i--) {
    let v = input[i];
    output[i] = (v >= 0x8000) ? -(0x10000 - v) / 0x8000 : v / 0x7FFF;
  }
  return output;
}

function floatTo16BitPCM(input) {
  let i = input.length;
  let output = Buffer.alloc(i * 2);
  while (i--) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.writeInt16LE(Math.round(s < 0 ? s * 0x8000 : s * 0x7FFF), i * 2);
  }
  return output;
}

class TransStream extends Transform {

  constructor(options = {}) {
    super(options)
    this.sampleRate = options.sampleRate || 16000
    this.servUrl = options.service || "https://demo-edu.hivoice.cn:10443/asr/pcm"
    this.appkey = options.appkey || "45gn7md5n44aak7a57rdjud3b5l4xdgv75saomys"
    this.XNumber = 0
    this.sid = uuid()
  }

  _transform(chunck, encoding, next) {
    const int16 = new Int16Array(chunck.buffer)
    const res = new Resampler(this.sampleRate, 16000, 1, int16.length)
    const pcm = floatTo16BitPCM(res.resampler(int16ToFloat32BitPCM(int16)))
    this.send(pcm)
    setTimeout(() => {
      next()
    }, 250)
  }

  _final() {
    this.send(null, true)
  }

  stop() {
    this._isStop = true
  }

  send(stream, isEnd) {
    if (this._isStop) {
      return
    }
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
      if (res.data && !this._isStop) {
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
      if (!this._isStop) {
        this.hasError = true
        if (isEnd) {
          this.emit('result-error', err.toString())
        }
      }
    })
  }
}

module.exports = TransStream