import { Input } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

interface IFilePicker {
  OnChange: (file: File) => void;
}

export const FilePicker: React.FC<IFilePicker> = (props) => {
  const [keyState, setKeyState] = useState<number>(0);
  const fileInput = useRef<HTMLInputElement>();

  const handleChange = () => {
    const file = fileInput.current?.files[0];
    if (file != null) {
      props.OnChange(file);
      setKeyState(keyState + 1);
    }
  };

  return (
    <label
      className="file"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {props.children}
      <Input
        type="file"
        width="100%"
        height={8}
        top="-6px"
        left="0"
        ref={fileInput}
        key={keyState}
        onChange={(e) => handleChange()}
      />
    </label>
  );
};
