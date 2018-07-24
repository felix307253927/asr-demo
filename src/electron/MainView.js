/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-13 17:16:19 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-13 17:16:19 
 */
'use strict';
const { BrowserWindow, dialog, app } = require('electron')
const path = require('path')
const Menu = require('./Menu')
const Trans = require('./trans')

class MainView {
  constructor() {
    this.init()
    this.trans = new Trans(this.win)
    new Menu(this.win, this.trans)
  }

  init() {
    this.win = new BrowserWindow({
      width: 1366,
      height: 768,
      minWidth: 1200,
      minHeight: 768,
      // useContentSize: true,
      center: true,
      resizable: true,
      title: "云知声ASR DEMO",
      show: true,
      backgroundColor: "#ffffff",
      icon: path.join(__dirname, 'resources/icon/icon.ico '),
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true,
        webSecurity: false,
        // preload: '../preload.js'
      }
    })
    this.win.once('ready-to-show', () => {
      this.win.show()
      this.win.maximize()
    })
    this.win.on('close', (e) => {
      if (this.win.isVisible()) {
        e.preventDefault()
        dialog.showMessageBox(this.win, {
          title: "提示",
          message: "是否退出程序?",
          buttons: ["最小化", "退出"]
        }, (idx) => {
          if (idx == 0) {
            this.hide()
          } else {
            app.exit(0)
          }
        })
      }
    })
  }

  loadURL(url) {
    this.win.loadURL(url || `file://${path.join(__dirname, 'index.html')}`)
  }

  show() {
    this.win.show()
  }

  hide() {
    this.win.hide()
  }


}

module.exports = MainView