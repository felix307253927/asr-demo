/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-13 16:29:48 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-13 16:29:48 
 */
'use strict';
const fs = require('fs')
const path = require('path')
const { app, BrowserWindow } = require('electron')
global.recentlyUsedPath = app.getPath('documents')
global.userDataPath = app.getPath('userData')
if (!fs.existsSync(global.userDataPath)) {
  fs.mkdirSync(global.userDataPath)
}
// require('./task')
const MainView = require('./MainView')
const Tray = require('./Tray')
// const Splash = require('./Splash')

class App {
  constructor() {
    app.once('ready', () => {
      this.initApp()
    })
    app.on('quit', ()=>{
      this.tray.destroy()
    })
  }

  initApp() {
    let url
    if (process.env.NODE_ENV === 'development') {
      url = 'http://localhost:3000'
      this.registerDevTool()
    }
    this.main = new MainView()
    this.tray = new Tray(this.main)
    // this.splash = new Splash()
    this.main.loadURL(url)
    // this.main.win.once('ready-to-show', () => {
    //   this.main.show()
    //   this.splash.destroy()
    //   this.splash = null
    // })
  }

  registerDevTool() {
    const configPath = app.getPath('appData')
    const reactTool = path.join(configPath, 'google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi')
    if (fs.existsSync(reactTool)) {
      fs.readdir(reactTool, (err, files) => {
        if (!err && files.length) {
          console.log('addDevToolsExtension...')
          BrowserWindow.addDevToolsExtension(path.join(reactTool, files[0]));
        }
      })
    }
  }
}

new App()