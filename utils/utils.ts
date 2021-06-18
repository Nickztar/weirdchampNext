/**
 * detect if a file is an audio.
 */
export const isAudio = (file: File | Blob) => file.type.indexOf('audio') > -1;

/**
 * create range [min .. max]
 */
export const range = (min: number, max: number) =>
  Array.apply(null, { length: max - min + 1 }).map(
    (_: any, i: number) => i + min
  );

/**
 * FileReader via promise
 */
export function readFile(
  file: Blob,
  dataType: string
): Promise<ArrayBuffer | string> {
  return new Promise<ArrayBuffer | string>((resolve, reject) => {
    const reader = new FileReader();
    reader['readAs' + dataType](file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Read File/Blob to ArrayBuffer
 */
export const readArrayBuffer = (file: Blob) => readFile(file, 'ArrayBuffer');

/**
 * Read File/Blob to Base64
 */
export const readDataURL = (file: Blob) => readFile(file, 'DataURL');

export const readBlobURL = (file: Blob) => URL.createObjectURL(file);

export const readBlobToBase64 = (file: Blob): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onloadend = function () {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.onerror = () => {
      reject('Failed!');
    };
  });
};

export const BlobToFile = (theBlob: Blob, fileName: string): File => {
  var b: any = theBlob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;
  //Cast to a File() type
  return <File>theBlob;
};

export const download = (url: string, name: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
};

export const rename = (filename: string, ext: string, stamp?: string) =>
  `${filename.replace(/\.\w+$/, '')}${stamp || ''}.${ext}`;

/**
 * format seconds to [minutes, integer, decimal(2)]
 */
export const formatSeconds = (seconds: number) => [
  Math.floor(seconds / 60),
  Math.floor(seconds % 60),
  Math.round((seconds % 1) * 100),
];

export const leftZero = (num: number, count: number) => {
  return ('000000' + num).slice(-count);
};
