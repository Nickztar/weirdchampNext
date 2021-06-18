import { EventEmitter } from 'events';
import { readArrayBuffer } from './utils';

export default class WebAudio extends EventEmitter {
  audioContext = new AudioContext();

  startRunetime: number = null;

  startTime: number = null;

  _playing: boolean = false;

  audioBuffer: AudioBuffer = null;

  gainNode: GainNode = null;

  scriptNode: ScriptProcessorNode = null;

  source: AudioBufferSourceNode = null;

  constructor(audioBuffer: AudioBuffer) {
    super();

    this.audioBuffer = audioBuffer;
    this._initAudioComponent();
  }

  _initAudioComponent() {
    const { audioContext } = this;

    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const scriptNode = audioContext.createScriptProcessor(4096);
    scriptNode.onaudioprocess = this.onprocess;

    this.gainNode = gainNode;
    this.scriptNode = scriptNode;
  }

  get currentPosition() {
    return this.audioContext.currentTime - this.startRunetime + this.startTime;
  }

  get paused() {
    return !this._playing;
  }

  _beforePlay() {
    const { audioContext, audioBuffer, gainNode, scriptNode } = this;
    if (!this.paused) {
      this.pause();
    }

    scriptNode.connect(audioContext.destination);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);
    source.onended = this.onended;

    this.source = source;
    this._playing = true;
  }

  _afterStop() {
    this.source.disconnect();
    this.scriptNode.disconnect();
    this._playing = false;
  }

  onended = () => {
    if (!this._playing) return;
    this.pause();
    this.pause();
    this.pause();
    this.emit('end');
  };

  onprocess = () => {
    if (!this._playing) return;
    this.emit('process', this.currentPosition);
  };

  play = (start = this.currentPosition) => {
    this._beforePlay();

    const source = this.source;
    this.startRunetime = this.audioContext.currentTime;
    this.startTime = start;

    source.start(0, start);
  };

  pause() {
    this.source.stop();

    this._afterStop();
  }

  destroy() {
    this._afterStop();

    this.gainNode.disconnect();
    this.removeAllListeners();
  }

  /**
   * decode blob to audio data
   */
  static async decode(blob: Blob) {
    const arrayBuffer = await readArrayBuffer(blob);
    const audioBuffer = await new AudioContext().decodeAudioData(
      arrayBuffer as ArrayBuffer
    );

    return audioBuffer;
  }
}
