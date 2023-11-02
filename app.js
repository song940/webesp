import { ready } from 'https://lsong.org/scripts/dom.js';
import { readAsBinaryString } from 'https://lsong.org/scripts/file.js';
import { WebESP } from './webesp.js';

const webesp = new WebESP();

ready(() => {
  const connect = document.getElementById('connect');
  const flash = document.getElementById('flash');
  const progressBar = document.querySelector('progress-bar');

  webesp.on('progress', (index, written, total) => {
    progressBar.value = (written / total) * 100;
  });
  connect.addEventListener('click', async () => {
    const baudrate = document.getElementById('baudrate').value;
    webesp.connect({ baudrate });
  });
  flash.addEventListener('click', async () => {
    const upload = document.getElementById('upload');
    const file = upload.files[0];
    if (!file) {
      console.error('No file selected');
      return
    }
    const data = await readAsBinaryString(file);
    webesp.flash([{ address: 0x00, data }]);
  });
});
