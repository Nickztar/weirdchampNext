import { range } from './utils';

export function decodeAudioArrayBuffer(
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> {
  return new AudioContext().decodeAudioData(arrayBuffer);
}

export function sliceAudioBuffer(
  audioBuffer: AudioBuffer,
  start = 0,
  end = audioBuffer.length
): AudioBuffer {
  const newBuffer = new AudioContext().createBuffer(
    audioBuffer.numberOfChannels,
    end - start,
    audioBuffer.sampleRate
  );

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    newBuffer.copyToChannel(audioBuffer.getChannelData(i).slice(start, end), i);
  }

  return newBuffer;
}

interface ISerializeAudioBuffer {
  channels: Float32Array[];
  sampleRate: number;
  length: number;
}

export function serializeAudioBuffer(
  audioBuffer: AudioBuffer
): ISerializeAudioBuffer {
  return {
    channels: range(0, audioBuffer.numberOfChannels - 1).map((i: number) =>
      audioBuffer.getChannelData(i)
    ),
    sampleRate: audioBuffer.sampleRate,
    length: audioBuffer.length,
  };
}
