import React, { useEffect, useRef, useState } from 'react';
import getPeaks from '../../utils/peaks';

// const dpr = window.devicePixelRatio || 1;

interface IWaver {
  className?: string;
  audioBuffer: AudioBuffer;
  width: number;
  height: number;
  color: string;
  IsBackground: boolean;
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
    const eql = props.height * 1.2;
    const centerY = props.height / 2;

    ctx.strokeStyle = props.color;

    ctx.clearRect(0, 0, props.width, props.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(1000, centerY);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    for (let i = 0; i < count; i++) {
      const [min, max] = newPeaks[i];
      let x = i - 0.5;
      ctx.beginPath();
      ctx.moveTo(x, centerY + min * eql);
      ctx.lineTo(x, centerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + max * eql);
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
  }, [props.color]);

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => console.log(e)}
      className={'wave-canvas ' + props.className}
      style={{
        width: props.width + 'px',
        height: props.height + 'px',
        borderRadius: '4px',
        background: props.IsBackground
          ? '#293246b5'
          : 'linear-gradient(rgb(9, 74, 134), rgb(50, 64, 144))',
      }}
      width={props.width}
      height={props.height}
    />
  );
};
