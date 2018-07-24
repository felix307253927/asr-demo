/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-19 08:51:26 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-19 08:51:26 
 */
'use strict';
const electron = require('electron')
const path = require('path')
const fs = require('fs')
const { app, Menu, dialog } = electron
const downloads = app.getPath('downloads')

module.exports = class MyMenu {
  constructor(main) {
    const self = this
    const menus = [
      {
        label: "文件",
        submenu: [
          {
            label: "导出",
            click() {
              self.exportTrans(main.win, main.trans)
            }
          },
          {
            label: "退出",
            role: "quit"
          }
        ]
      },
      {
        label: '视图',
        submenu: [
          { label: "刷新", role: 'forcereload' },
          { label: "还原", role: 'resetzoom' },
          { label: "缩小", role: 'zoomout' },
          { label: "放大", role: 'zoomin' }
        ]
      },
      {
        label: '窗口',
        submenu: [
          { label: "最小化", role: 'minimize' },
          { label: "关闭", role: 'close' }
        ]
      },
      {
        label: '帮助',
        role: "help",
        submenu: [
          { label: "关于", click() { electron.shell.openExternal('http://www.unisound.com') } },
        ]
      }
    ]
    if (process.env.NODE_ENV === 'development') {
      menus[1].submenu.push({ role: 'toggledevtools' })
      menus[1].submenu.push({ role: 'reload' })
    }
    const menu = Menu.buildFromTemplate(menus)
    Menu.setApplicationMenu(menu)
  }

  exportTrans(win, trans) {
    const defaultName = trans.name.replace(/\..*$/, '') || "识别文本"
    if (trans.transResult) {
      dialog.showSaveDialog(win, {
        title: "导出识别文本",
        defaultPath: path.join(downloads, `${defaultName}.txt`),
        filters: [{ name: '文本', extensions: ['txt'] }]
      }, (name) => {
        if (name) {
          const out = fs.createWriteStream(name)
          out.write(trans.transResult, 'utf-8')
          out.end()
          out.on('error', () => {
            dialog.showErrorBox("导出文件失败", "导出文件失败, 请重试")
          })
        }
      })
    } else {
      dialog.showMessageBox(win, {
        title: "提示",
        message: "未发现转写文本, 请先转写后再导出"
      })
    }
  }
}

