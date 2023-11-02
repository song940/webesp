import { EventEmitter } from 'https://lsong.org/scripts/events.js';
import { ESPLoader, Transport } from './esptool.min.js';

export class WebESP extends EventEmitter {
  async connect({ baudrate = 9600 }) {
    const device = await navigator.serial.requestPort({
      usbVendorId: '',
      usbProductId: ''
    });
    const transport = new Transport(device);
    const deviceInfo = await transport.get_info();
    console.log('deviceInfo:', deviceInfo);
    const espLoaderTerminal = {
      clean: () => console.log('-------------'),
      write: data => console.log(data),
      writeLine: data => console.log(data),
    };
    const loaderOptions = {
      baudrate,
      transport,
      terminal: espLoaderTerminal,
    };
    this.esploader = new ESPLoader(loaderOptions);
    const chip = await this.esploader.main_fn();
    console.log('Connected to chip:', chip);
  }
  async erase() {
    if (!this.esploader) {
      console.error('Device is not connected.');
      return;
    }
    await this.esploader.erase_flash();
  }
  async flash(data) {
    if (!this.esploader) {
      console.error('Device is not connected.');
      return;
    }
    const flashOptions = {
      fileArray: data,
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      reportProgress: (index, written, total) => {
        this.emit('progress', index, written, total);
      },
      calculateMD5Hash: image =>
        CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)).toString(),
    };
    await this.esploader.write_flash(flashOptions);
    console.log('Flash complete');
  }
}
