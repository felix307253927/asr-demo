/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-24 09:38:55 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-24 09:38:55 
 */
'use strict';
const { app, Menu, Tray, nativeImage } = require('electron')
const path = require('path')

class AppTray {
  constructor(mainView) {
    this.mainView = mainView
    this.createTray("云知声ASR DEMO")
  }

  createTray(name) {
    let image = nativeImage.createFromPath(path.join(__dirname, 'resources/icon/icon32x32.ico'))
    image.setTemplateImage(true)
    this.tray = new Tray(image)
    this.tray.setToolTip(name)
    let contextMenu = Menu.buildFromTemplate([{
      label: 'Show',
      click: () => {
        this.mainView.show();
      }
    }, {
      label: 'Exit', click: () => {
        app.exit(0)
      }
    }])
    this.tray.setContextMenu(contextMenu)
    this.tray.on('click', (e) => {
      e.preventDefault();
      this.mainView.show();
    })
  }

  destroy() {
    this.tray.destroy()
  }
}

module.exports = AppTray