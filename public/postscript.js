/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-24 13:39:21 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-24 13:39:21 
 */
'use strict';

const fs = require("fs")
const { remote } = require("electron")
const app = remote.app

const configPath = path.join(app.getPath('exe'), "config.json")
if (fs.existsSync(configPath)) {
  window.config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }))
} else {
  window.config = {
    service: "https://demo-edu.hivoice.cn:10443"
  }
}