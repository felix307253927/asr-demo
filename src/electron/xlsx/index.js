/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-17 11:24:31 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-17 11:24:31 
 */
'use strict';
const XLSX = require('xlsx')
const path = require('path')
const task = require('../task')
const { dialog, ipcMain } = require('electron')

class Excel {
  constructor(win) {
    ipcMain.on('open-xlsx', (e) => {
      this.open(win, e)
    })
  }

  open(win, e) {
    dialog.showOpenDialog(win, {
      title: "选择要导入的excel文件",
      properties: ['openFile'],
      filters: [
        { name: 'excel', extensions: ['xlsx'] }
      ]
    }, (o) => {
      if (o) {
        if (/\.xlsx$/.test(o[0])) {
          const name = path.basename(o[0], '.xlsx')
          try {
            const workbook = XLSX.readFile(o[0]);
            const data = this.sheet2json(workbook.Sheets.Sheet1)
            if (data.length) {
              const taskInfo = {
                id: Date.now(),
                name,
                data: data.filter(d => d.id && d.text)
              }
              task.createTask(taskInfo, (err) => {
                if (!err) {
                  e.sender.send("open-xlsx", taskInfo)
                } else {
                  this.showError(win, '导入失败', '请检查excel文件是否正确')
                }
              })
            } else {
              this.showError(win, '导入失败', '未能读取到任务内容')
            }
          } catch (e) {
            this.showError(win, '导入失败', '请检查excel文件是否正确')
          }
        } else {
          this.showError(win, '导入失败', '请选择excel文件')
        }
      }
    });
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

  readLine(sheet, line) {
    return {
      id: sheet[`A${line}`].v,
      text: sheet[`B${line}`].v
    }
  }

  sheet2json(sheet, start = 2) {
    const ret = [];
    for (let i = start; true; i++) {
      if (!sheet[`A${i}`]) {
        return ret
      }
      ret.push(this.readLine(sheet, i))
    }
  }
}

module.exports = Excel