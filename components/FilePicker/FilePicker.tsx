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
    <label className="file">
      {props.children}
      <input
        type="file"
        ref={fileInput}
        key={keyState}
        onChange={(e) => handleChange()}
      />
    </label>
  );
};
