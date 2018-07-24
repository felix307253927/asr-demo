/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-24 13:54:29 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-24 13:54:29 
 */
'use strict';
const path = require('path');
const { BrowserWindow } = require('electron');

class ConfWindow {
  constructor(win) {
    this.conf = new BrowserWindow({
      parent: win,
      width: 600,
      height: 400,
      title: "unisound",
      resizable: false,
      center: true,
      show: false,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      icon: path.join(__dirname, 'resources/icon/icon.ico '),
      titleBarStyle: 'hidden',
    });
    this.conf.loadURL('file://' + path.join(__dirname, 'config.html'));
  }

  show() {
    this.conf.center()
    this.conf.show();
  }

  hide() {
    this.conf.hide();
  }

  destroy() {
    this.conf.destroy()
  }
}

module.exports = ConfWindow;