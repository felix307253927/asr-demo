function writeString(data, offset, str) {
  for (let i = 0; i < str.length; i++) {
    data.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function createWavHeader(sampleRate = 44100, sampleBits = 16, channelCount = 1) {
  let view = new DataView(new ArrayBuffer(44));
  let dataLength = 0
  let offset = 0;
  /* 资源交换文件标识符 */
  writeString(view, offset, 'RIFF'); offset += 4;
  /* 下个地址开始到文件尾总字节数,即文件大小-8 */
  view.setUint32(offset, /*32这里地方栗子中的值错了,但是不知道为什么依然可以运行成功*/ 36 + dataLength, true); offset += 4;
  /* WAV文件标志 */
  writeString(view, offset, 'WAVE'); offset += 4;
  /* 波形格式标志 */
  writeString(view, offset, 'fmt '); offset += 4;
  /* 过滤字节,一般为 0x10 = 16 */
  view.setUint32(offset, 16, true); offset += 4;
  /* 格式类别 (PCM形式采样数据) */
  view.setUint16(offset, 1, true); offset += 2;
  /* 通道数 */
  view.setUint16(offset, channelCount, true); offset += 2;
  /* 采样率,每秒样本数,表示每个通道的播放速度 */
  view.setUint32(offset, sampleRate, true); offset += 4;
  /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
  view.setUint32(offset, sampleRate * channelCount * (sampleBits / 8), true); offset += 4;
  /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
  view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
  /* 每样本数据位数 */
  view.setUint16(offset, sampleBits, true); offset += 2;
  /* 数据标识符 */
  writeString(view, offset, 'data'); offset += 4;
  /* 采样数据总数,即数据总大小-44 */
  view.setUint32(offset, dataLength, true); offset += 4;

  return view;
}

export function setSize(view, bufSize) {
  view.setUint32(4, 36 + bufSize, true);
  view.setUint32(40, bufSize, true);
}

export function encodeWAV(samples, sampleRate = 44100) {
  var dataLength = samples.length;
  var buffer = new ArrayBuffer(44 + dataLength);
  var view = new DataView(buffer);

  var sampleRateTmp = sampleRate;
  var sampleBits = 16;
  var channelCount = 1;
  var offset = 0;
  /* 资源交换文件标识符 */
  writeString(view, offset, 'RIFF'); offset += 4;
  /* 下个地址开始到文件尾总字节数,即文件大小-8 */
  view.setUint32(offset, /*32这里地方栗子中的值错了,但是不知道为什么依然可以运行成功*/ 36 + dataLength, true); offset += 4;
  /* WAV文件标志 */
  writeString(view, offset, 'WAVE'); offset += 4;
  /* 波形格式标志 */
  writeString(view, offset, 'fmt '); offset += 4;
  /* 过滤字节,一般为 0x10 = 16 */
  view.setUint32(offset, 16, true); offset += 4;
  /* 格式类别 (PCM形式采样数据) */
  view.setUint16(offset, 1, true); offset += 2;
  /* 通道数 */
  view.setUint16(offset, channelCount, true); offset += 2;
  /* 采样率,每秒样本数,表示每个通道的播放速度 */
  view.setUint32(offset, sampleRateTmp, true); offset += 4;
  /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
  view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset += 4;
  /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
  view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
  /* 每样本数据位数 */
  view.setUint16(offset, sampleBits, true); offset += 2;
  /* 数据标识符 */
  writeString(view, offset, 'data'); offset += 4;
  /* 采样数据总数,即数据总大小-44 */
  view.setUint32(offset, dataLength, true); offset += 4;

  /* 采样数据 */
  /*   offset = 44;
    for (var i = 0; i < samples.length; i++ , offset += 2) {
      var s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    } */

  return view;
}