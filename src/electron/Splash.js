/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-13 16:33:58 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-13 16:33:58 
 */
'use strict';
const path = require('path');
const { BrowserWindow } = require('electron');

class SplashWindow {
  constructor() {
    this.splashWindow = new BrowserWindow({
      width: 380,
      height: 125,
      title: "unisound",
      resizable: false,
      center: true,
      show: false,
      frame: false,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      icon: path.join(__dirname, 'resources/icon/icon.ico '),
      titleBarStyle: 'hidden',
    });
    this.splashWindow.loadURL('file://' + path.join(__dirname, 'splash.html'));
    this.splashWindow.on('ready-to-show', () => {
      this.splashWindow.show();
    })
  }

  show() {
    this.splashWindow.show();
  }

  hide() {
    this.splashWindow.hide();
  }

  destroy() {
    this.splashWindow.destroy()
  }
}

module.exports = SplashWindow;
