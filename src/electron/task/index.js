/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-17 14:57:41 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-17 14:57:41 
 */
'use strict';

const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const { ipcMain, app, dialog } = require('electron')
const WavStream = require('./wav-stream')
const temp = app.getPath('temp')
const downloads = app.getPath('downloads')

class Task {
  constructor() {
    this.root = path.join(global.userDataPath, 'task')
    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root)
    }
    this.taskPath = path.join(this.root, 'task.json')
    this.audioTmp = path.join(temp, 'audioTmp.pcm')
    try {
      this.task = JSON.parse(fs.readFileSync(this.taskPath, { encoding: 'utf-8' }))
    } catch (e) {
      this.task = null
    }
    this.initIpc()
  }

  initIpc() {
    ipcMain.on('get-task', (e) => {
      e.returnValue = this.task
    })
    ipcMain.on('update-task', (e, data) => {
      this.updateTask(data, (err) => {
        e.sender.send('update-task', err)
      })
    })
    ipcMain.on('create-task', (e, data) => {
      this.createTask(data, (err) => {
        e.sender.send('create-task', err)
      })
    })
    ipcMain.on('pcm', (e, data) => {
      if (!this.audioStream) {
        this.pcmLength = 0
        this.audioStream = fs.createWriteStream(this.audioTmp, { start: 0 })
      }
      this.pcmLength += data.length
      this.audioStream.write(data)
    })
    ipcMain.on('pcm-end', (event) => {
      if(this.audioStream){
        this.audioStream.end()
        this.audioStream = null
      }

      fs.stat(this.audioTmp, (err, stats) => {
        if (!err) {
          const filePath = path.join(temp, 'audioTmp.wav')
          const readStream = fs.createReadStream(this.audioTmp)
          const writeStrem = fs.createWriteStream(filePath)
          readStream.on('error', () => {
            event.sender.send('pcm-error', '保存临时录音失败')
          })
          writeStrem.on('error', () => {
            event.sender.send('pcm-error', '保存临时录音失败')
          })
          writeStrem.on('finish', () => {
            event.sender.send('pcm-end', filePath)
          })
          try {
            readStream.pipe(new WavStream({
              bufSize: stats.size
            })).pipe(writeStrem)
          } catch (e) {
            event.sender.send('pcm-error', '保存临时录音失败')
          }
        } else {
          event.sender.send('pcm-error', '保存临时录音失败')
        }
      })
    })

    ipcMain.on('pcm-save', (event, id) => {
      const filePath = path.join(this.root, `${id}.wav`)
      const readStream = fs.createReadStream(path.join(temp, 'audioTmp.wav'))
      const writeStrem = fs.createWriteStream(filePath)
      readStream.on('error', () => {
        event.sender.send('pcm-error', '保存录音文件失败')
      })
      writeStrem.on('error', () => {
        event.sender.send('pcm-error', '保存录音文件失败')
      })
      writeStrem.on('finish', () => {
        for (let i = 0, len = this.task.data.length; i < len; i++) {
          const cur = this.task.data[i]
          if (id === cur.id) {
            cur.audio = filePath
            this.updateTask(this.task)
            event.sender.send('pcm-save', filePath)
          }
        }
      })
      readStream.pipe(writeStrem)
    })
  }

  updateTask(task, cb) {
    fs.writeFile(this.taskPath, JSON.stringify(task), (err) => {
      cb && cb(err)
    })
  }

  createTask(task, cb) {
    this.task = task;
    this.clearDir(this.root)
    this.updateTask(task, cb)
  }

  zip(win) {
    if (this.task) {
      dialog.showSaveDialog(win, {
        title: "导出任务",
        defaultPath: path.join(downloads, `${this.task.name}.zip`),
        filters: [{ name: 'zip', extensions: ['zip'] }]
      }, (name) => {
        if (name) {
          const archive = archiver('zip');
          const out = fs.createWriteStream(name)
          out.on('error', (err) => {
            this.showError(win, '导出错误', '导出的任务失败!')
          })
          archive.on('error', (err) => {
            this.showError(win, '导出错误', '导出的任务失败!')
          });
          archive.pipe(out)
          archive.directory(this.root, false)
          archive.finalize()
        }
      })
    } else {
      this.showError(win, '导出错误', '没有可导出的任务')
    }
  }

  showError(win, title, message) {
    try {
      dialog.showMessageBox(win, {
        type: 'error',
        buttons: ["关闭"],
        title,
        message
      })
    } catch (e) {
      console.log(e);
    }
  }

  clearDir(dir) {
    let files = [];
    if (fs.existsSync(dir)) {
      try {
        files = fs.readdirSync(dir);
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i]
          const curPath = path.join(dir, file)
          if (fs.statSync(curPath).isDirectory()) {
            this.clearDir(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

}

module.exports = new Task()