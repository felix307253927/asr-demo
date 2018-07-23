import React, { PureComponent } from 'react';
import { Progress, message } from 'antd';
import Wavesurfer from 'wavesurfer.js';
import CursorPlugin from './plugins/wavesurfer.cursor';
import './index.scss'

export default class Wave extends PureComponent {

  static defaultProps = {
    onEnd() { }
  }

  constructor(props) {
    super(props)
    this.src = ''
    this.preload = props.preload
    this.playPause = this.playPause.bind(this)
    this.el = React.createRef()
    this.state = {
      finish: false
    }
  }

  initWave() {
    this.el.current.innerHTML = ''
    this.wave = Wavesurfer.create({
      container: this.el.current,
      height: 64,
      waveColor: 'rgba(27, 184, 250, 0.6)',
      progressColor: '#1890ff',
      normalize: true,
      partialRender: true,
      hideScrollbar: true,
      plugins: [
        CursorPlugin.create(),
      ]
    })
    this.wave.on('ready', () => {
      if (this.preload) {
        this.setState({ finish: false })
        this.wave.play()
      }
    })
    this.wave.on('error', () => {
      message.error('解析音频文件失败')
      this.props.onEnd()
    })
    this.wave.on('finish', () => {
      this.setState({ finish: true })
      this.props.onEnd()
    })
    this.wave.on('seek', () => {
      this.setState({ finish: false })
    })
    this.wave.on('pause', this.props.onEnd)
  }

  componentDidMount() {
    this.load(this.props.src)
  }

  componentDidUpdate() {
    this.load(this.props.src)
  }

  get isPlaying() {
    if (this.wave) {
      return this.wave.isPlaying()
    }
    return false
  }

  load(src) {
    if (src && src != this.src) {
      this.src = src
      this.wave = null
      this.initWave()
      this.wave.load(this.src)
      this.setState({ finish: false })
    }
  }

  playPause() {
    if (this.src) {
      this.setState({ finish: false })
      this.wave.playPause();
    } else {
      message.error('音频文件未加载')
    }
  }

  componentWillUnmount() {
    this.wave.stop()
  }

  render() {
    const { finish } = this.state
    return (
      <div className={finish ? "wave end" : "wave"} ref={this.el} />
    )
  }
}