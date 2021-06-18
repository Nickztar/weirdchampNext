import React, { useEffect, useRef, useState } from 'react';
import getPeaks from '../../utils/peaks';

// const dpr = window.devicePixelRatio || 1;

interface IWaver {
  className?: string;
  audioBuffer: AudioBuffer;
  width: number;
  height: number;
  color1: string;
  color2: string;
}

export const Waver: React.FC<IWaver> = (props) => {
  const [peaks, setPeaks] = useState<Array<number[]>>(null);
  const [dpr, setDpr] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>();

  let ctx: CanvasRenderingContext2D = null;

  const handleSetPeaks = (channelData: Float32Array) => {
    if (peaks != null) return;
    const newPeaks = getPeaks(props.width, channelData);
    setPeaks(newPeaks);
    repaint(newPeaks);
  };

  const repaint = (newPeaks: Array<number[]>) => {
    const count = newPeaks.length;
    const height = props.height * 1.5;
    const centerY = props.height / 2;

    ctx.lineWidth = 1.5;
    ctx.clearRect(0, 0, props.width, props.height);

    for (let i = 0; i < count; i++) {
      const [min, max] = newPeaks[i];
      let x = i - 0.5;
      ctx.beginPath();
      ctx.strokeStyle = props.color1;
      ctx.moveTo(x, centerY + min * height);
      ctx.lineTo(x, centerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = props.color2;
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + max * height);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const newCtx = canvas.getContext('2d');
    ctx = newCtx;
    setDpr(window.devicePixelRatio);
    handleSetPeaks(props.audioBuffer.getChannelData(0));
  }, []);

  useEffect(() => {
    if (peaks != null) {
      const canvas = canvasRef.current;
      const newCtx = canvas.getContext('2d');
      ctx = newCtx;
      setDpr(window.devicePixelRatio);
      repaint(peaks);
    }
  }, [props.color1, props.color2]);

  return (
    <canvas
      ref={canvasRef}
      className={'wave-canvas ' + props.className}
      style={{
        width: props.width + 'px',
        height: props.height + 'px',
      }}
      width={props.width}
      height={props.height}
    />
  );
};
