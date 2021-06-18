import React from 'react';
import { formatSeconds, leftZero } from '../../utils/utils';

interface ITimestamp {
  currentTime: number;
}

export const Timestamp: React.FC<ITimestamp> = (props) => {
  const formated = formatSeconds(props.currentTime);

  return (
    <div className="cursor-current" style={{ userSelect: 'none' }}>
      <span className="num">{formated[1]}</span>.
      <span className="num">{leftZero(formated[2], 2)}</span>
    </div>
  );
};
