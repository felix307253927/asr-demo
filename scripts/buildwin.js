/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-19 17:00:47 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-19 17:00:47 
 */
'use strict';

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')
const rootPath = path.join(__dirname, '../build')
const outPath = path.join(__dirname, '../out')

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig() {
  const icon = path.join(rootPath, 'resources', 'icon', 'icon.ico')
  return Promise.resolve({
    appDirectory: rootPath,
    exe: 'Recorder.exe',
    iconUrl: `file://${icon}`,
    // loadingGif: path.join(rootPath, 'assets', 'img', 'loading.gif'),
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    setupExe: 'RecorderSetup.exe',
    setupIcon: icon,
    skipUpdateIcon: true
  })
}

function deleteOutputFolder() {
  return new Promise((resolve, reject) => {
    rimraf(path.join(outPath, 'windows-installer'), (error) => {
      error ? reject(error) : resolve()
    })
  })
}