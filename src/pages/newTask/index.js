/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-17 13:52:17 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-17 13:52:17 
 */
'use strict';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import logo from '../../logo.svg';

class NewTask extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">欢迎使用录音系统</h1>
        </header>
        <p className="App-intro">
          您还没有任务, 请先 <a href="javascript:;" onClick={() => {
            ipcRenderer.send('open-xlsx')
          }}>导入</a> 任务!
        </p>
        <div>
        </div>
      </div>
    );
  }
}

export default NewTask;
