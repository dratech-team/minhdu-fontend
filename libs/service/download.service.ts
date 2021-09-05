
export class DownloadService {
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'XML' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
}
