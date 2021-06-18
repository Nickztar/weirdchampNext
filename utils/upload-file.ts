// helper function: generate a new file from base64 String
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

export const UseUploadFile = (
  dataurl: string,
  filename: string,
  uploadUrl: string
): Promise<Response> => {
  // generate file from base64 string
  const file = dataURLtoFile(dataurl, filename);
  // put file into form data
  const data = new FormData();
  data.append('img', file, file.name);

  // now upload
  const config: RequestInit = {
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'POST',
    body: data,
  };
  return new Promise((resolve, reject) => {
    fetch(uploadUrl, config)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
