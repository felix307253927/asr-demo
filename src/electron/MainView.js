/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-13 17:16:19 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-13 17:16:19 
 */
'use strict';
const { BrowserWindow, app } = require('electron')
const path = require('path')
const Menu = require('./Menu')
const Trans = require('./trans')

class MainView {
  constructor() {
    this.init()
    new Menu(this.win)
    new Trans(this.win)
  }

  init() {
    this.win = new BrowserWindow({
      width: 1366,
      height: 768,
      minWidth: 1366,
      minHeight: 768,
      // useContentSize: true,
      center: true,
      resizable: true,
      title: "ASR DEMO",
      show: true,
      icon: path.join(__dirname, 'resources/icon/icon.ico '),
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true,
        webSecurity: false,
        // preload: '../preload.js'
      }
    })
    this.win.once('show', () => {
      setTimeout(() => {
        this.win.maximize()
      })
    })
    this.win.on('close', (e) => {
      if (this.win.isVisible()) {
        e.preventDefault()
        this.hide()
        app.exit(0)
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