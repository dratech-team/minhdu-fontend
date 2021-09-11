import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor() {
  }
  downloadFile(data: any, type: string, filename?:string) {
    const blob = new Blob([data], { type: type });
    const url= window.URL.createObjectURL(blob);
    const filenameConvert = this.regexFIleName(filename)
    this.forceDownload(url,filenameConvert)
  }
  forceDownload(blob:string, filename: string) {
    const a = document.createElement('a');
    a.download = filename
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  regexFIleName(fileName?: string): string{
    return 'data'
  }
}
