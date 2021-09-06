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
    this.forceDownload(url,filename)
    window.open(url)
  }
  forceDownload(blob:string, filename?: string) {
    const a = document.createElement('a');
    a.download = filename? filename: 'data';
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
