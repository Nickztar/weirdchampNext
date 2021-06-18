import { serializeAudioBuffer } from './audio-helper';

const workerScript = document.querySelector<HTMLScriptElement>(
  '[x-audio-encode]'
);

if (!workerScript) {
  console.error('Missing worker script tag.');
}

export const worker = new Worker(workerScript && workerScript.src);

/**
 * use worker to encode audio
 */
export const encode = (
  audioBuffer: AudioBuffer,
  type: string
): Promise<Blob> => {
  const id = Math.random();

  return new Promise((resolve, reject) => {
    const audioData = serializeAudioBuffer(audioBuffer);
    worker.postMessage({
      type,
      audioData,
      id,
    });

    /**
     * Worker message event listener
     */
    const listener = ({ data }: MessageEvent) => {
      if (!data || data.id !== id) return;

      if (data.error) {
        reject(new Error(data.message));
      } else {
        resolve(data.blob);
      }

      worker.removeEventListener('message', listener);
    };

    worker.addEventListener('message', listener);
  });
};
