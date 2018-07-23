/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-19 08:51:26 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-19 08:51:26 
 */
'use strict';
const electron = require('electron')
const { Menu } = electron
const task = require('./task')

module.exports = class MyMenu {
  constructor(win) {
    const menus = [
      {
        label: "文件",
        submenu: [
          {
            label: "导入",
            click() {
              win.webContents.send('open-xlsx')
            }
          },
          {
            label: "导出",
            click() {
              task.zip(win)
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
    if (1 ||process.env.NODE_ENV === 'development') {
      menus[1].submenu.push({ role: 'toggledevtools' })
      menus[1].submenu.push({ role: 'reload' })
    }
    const menu = Menu.buildFromTemplate(menus)
    Menu.setApplicationMenu(menu)
  }
}

