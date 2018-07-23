/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-17 10:50:30 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-17 10:50:30 
 */
'use strict';
const { BrowserWindow, app } = require('electron')
const path = require('path')

class MainView {
  constructor() {
    app.on('ready', () => {
      console.log('app is ready');
      this.init()
    })
  }

  init() {
    this.win = new BrowserWindow({
      minWidth: 1024,
      minHeight: 600,
      center: true,
      resizable: true,
      title: "录音系统",
      show: true,
      icon: 'resources/icon/icon.png',
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true,
        webSecurity: false,
        // preload: '../preload.js'
      }
    })
    this.win.loadURL('http://localhost:3000')
    console.log('load http://localhost:3000');
    this.win.on('close', (e) => {
      if (this.win.isVisible()) {
        e.preventDefault()
        this.hide()
        app.exit(0)
      }
    })
  }

  show() {
    this.win.show()
  }

  hide() {
    this.win.hide()
  }
}

new MainView()