import React from 'react';
import { IOnDrag } from '../../types/generalTypes';

interface IDragger {
  x: number;
  y?: number;
  onDrag: (e: IOnDrag) => void;
  className?: string;
}

export const Dragger: React.FC<IDragger> = (props) => {
  let _screenX: number = null;
  let _screenY: number = null;
  let _ox: number = null;
  let _oy: number = null;
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    _screenX = e.screenX;
    _screenY = e.screenY;
    _ox = props.x;
    _oy = props.y;

    window.addEventListener('mousemove', handleMouseMove, false);
    window.addEventListener('mouseup', handleMouseUp, false);
  };
  const handleMouseMove = (e: MouseEvent) => {
    props.onDrag({
      x: e.screenX - _screenX + _ox,
      y: e.screenY - _screenY + _oy,
    });
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  return (
    <div
      className={'dragger ' + props.className}
      onMouseDown={handleMouseDown}
      style={{
        left: props.x + 'px',
        top: props.y + 'px',
      }}
    >
      {props.children}
    </div>
  );
};
