/**
 * @author: 	felix 
 * @email: 	307253927@qq.com 
 * @date: 	2018-07-17 15:53:47 
 * @last Modified by:   felix 
 * @last Modified time: 2018-07-17 15:53:47 
 */
'use strict';
import React, { PureComponent } from 'react';
import { Button, Layout, List, Modal, message } from 'antd';
import Wave from '../../component/Wave';
import { ipcRenderer } from 'electron';

const { Header, Sider, Content } = Layout;

export default class DoTask extends PureComponent {
  constructor(props) {
    super(props)
    if (!global.task) {
      return props.history.replace('/index')
    }
    const cur = global.task.data[0]
    this.state = {
      cur,
      audioUrl: cur.audio || null,
      isRecorder: false,
      isPlaying: false,
      showSave: false
    }
    this.wave = React.createRef()
    this.handleRecorder = this.handleRecorder.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.handlePlayEnd = this.handlePlayEnd.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.registerListener()
    this.initRecorder()
  }

  componentWillReceiveProps(props) {
    const cur = global.task.data[0]
    this.setState({
      cur,
      audioUrl: cur.audio || null,
      isRecorder: false,
      isPlaying: false,
      showSave: false
    })
  }

  initRecorder() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      let context = new AudioContext();
      let microphone = context.createMediaStreamSource(stream);
      let processor = context.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        if (this._isRecording) {
          const f32 = event.inputBuffer.getChannelData(0)
          const buf = Buffer.alloc(f32.length * 2)
          for (let i = 0, offset = 0; i < f32.length; i++ , offset += 2) {
            const s = Math.max(-1, Math.min(1, f32[i]));
            buf.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, offset)
          }
          ipcRenderer.send('pcm', buf)
        }
      };
      this._start = (cb) => {
        if (processor && microphone) {
          this._isRecording = true
          microphone.connect(processor);
          processor.connect(context.destination);
          cb && cb()
        }

      };
      this._stop = (cb) => {
        if (processor && microphone) {
          microphone.disconnect();
          processor.disconnect();
          cb && cb()
          this._isRecording = false
          ipcRenderer.send('pcm-end')
        }
      };
    }).catch(e => {
      Modal.error({
        title: '启动录音失败',
        content: '启动录音失败,请确认您的麦克风是否正常,并且在弹出录音弹窗时选择允许',
      });
    })
  }

  registerListener() {
    let timer
    ipcRenderer.on('pcm-error', (e, msg) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        Modal.error({
          title: '录音文件错误',
          content: msg,
        })
      }, 1000)
    })
    ipcRenderer.on('pcm-end', (e, audioPath) => {
      this.setState({ audioUrl: `${audioPath}?t=${Date.now()}` })
    })
    ipcRenderer.on('pcm-save', (e, audioPath) => {
      this.state.cur.audio = audioPath
      message.success('音频保存成功')
    })
  }

  start() {
    if (this.wave.current && this.wave.current.isPlaying) {
      this.wave.current.playPause()
    }
    this._start && this._start(() => {
      this.setState({ isRecorder: true, isPlaying: false, showSave: false, audioUrl: null })
    })
  };
  stop() {
    this._stop && this._stop(() => {
      this.setState({ isRecorder: false, showSave: true })
    })
  };

  handleClick(cur) {
    if (this.state.isRecorder) {
      return message.info('请先停止录音')
    } else if (this.wave.current && this.wave.current.isPlaying) {
      return message.info('请先停止播放音频')
    }

    this.setState({ cur, audioUrl: cur.audio || null, isPlaying: false, showSave: false })
  }

  handleRecorder() {
    if (this.state.isRecorder) {
      this.stop()
    } else {
      this.start()
    }
  }
  handlePlay() {
    if (this.wave.current) {
      this.wave.current.playPause()
      this.setState({ isPlaying: !this.state.isPlaying })
    }
  }
  handlePlayEnd() {
    this.setState({ isPlaying: false })
  }

  handleSave() {
    const { cur } = this.state
    ipcRenderer.send('pcm-save', cur.id)
  }

  componentWillUnmount() {
    console.log('//TODO save task');
  }

  render() {
    const task = global.task
    const { cur, isPlaying, isRecorder, audioUrl, showSave } = this.state
    const src = audioUrl ? `file://${audioUrl}` : ''
    return (
      <Layout>
        <Sider>
          <List>
            <div>
              {task.data.map(d => {
                return (<List.Item className={d.id === cur.id ? 'active' : ''} onClick={() => this.handleClick(d)} key={d.id}>
                  <div className="text">{d.text}</div>
                </List.Item>)
              })}
            </div>
          </List>
        </Sider>
        <Layout>
          <Header><h1>{task.name}</h1></Header>
          <Content>
            <div className="container">
              <p className="task-text">{cur.text}</p>
              <div className="task-wave">
                {src && <Wave ref={this.wave} src={src} onEnd={this.handlePlayEnd} />}
              </div>
              <div className="btn-group">
                <Button onClick={this.handleRecorder} className="recorder" type={isRecorder ? 'danger' : 'primary'} shape="circle" ghost>
                  <svg className='mic-svg' t="1531819140660" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3191" xlink="http://www.w3.org/1999/xlink" width="28" height="28"><defs><style type="text/css"></style></defs><path d="M853.333333 426.666667a21.333333 21.333333 0 0 0-21.333333 21.333333v64h-42.666667V277.333333c0-152.917333-124.416-277.333333-277.333333-277.333333-152.938667 0-277.333333 124.416-277.333333 277.333333v234.666667H192v-64a21.333333 21.333333 0 1 0-42.666667 0v85.333333c0 196.138667 148.330667 350.869333 341.333334 361.621334V1024h42.666666v-129.045333c193.002667-10.752 341.333333-165.482667 341.333334-361.621334v-85.333333a21.333333 21.333333 0 0 0-21.333334-21.333333z m-576 42.666666h149.333334a21.333333 21.333333 0 1 0 0-42.666666h-149.333334v-42.666667h149.333334a21.333333 21.333333 0 1 0 0-42.666667h-149.333334v-42.666666h149.333334a21.333333 21.333333 0 1 0 0-42.666667h-148.245334c7.424-81.856 57.045333-151.573333 126.912-187.434667V149.333333a21.333333 21.333333 0 1 0 42.666667 0V51.776a230.848 230.848 0 0 1 42.666667-8.021333V149.333333a21.333333 21.333333 0 1 0 42.666666 0V43.754667c14.656 1.322667 28.906667 4.096 42.666667 8.021333V149.333333a21.333333 21.333333 0 1 0 42.666667 0V68.565333c69.866667 35.84 119.488 105.557333 126.912 187.434667H597.333333a21.333333 21.333333 0 1 0 0 42.666667h149.333334v42.666666h-149.333334a21.333333 21.333333 0 1 0 0 42.666667h149.333334v42.666667h-149.333334a21.333333 21.333333 0 1 0 0 42.666666h149.333334v42.666667H277.333333v-42.666667z m468.245334 85.333334C734.762667 674.090667 634.197333 768 512 768s-222.762667-93.909333-233.578667-213.333333h467.157334zM512 853.333333c-172.224 0-308.266667-129.6-318.954667-298.666666h42.709334c10.965333 142.954667 130.517333 256 276.245333 256 145.728 0 265.28-113.045333 276.245333-256h42.709334C820.266667 723.733333 684.224 853.333333 512 853.333333z" fill={isRecorder ? '#f5222d' : '#1890ff'} p-id="3192"></path></svg>
                </Button>
                {audioUrl && <Button onClick={this.handlePlay} type="primary" icon={isPlaying ? "pause" : "caret-right"} shape="circle" ghost />}
                {showSave && <Button onClick={this.handleSave} type="primary" icon="save" shape="circle" ghost />}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout >
    )
  }
}