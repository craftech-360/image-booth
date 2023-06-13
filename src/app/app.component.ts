import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { NgxCaptureService } from 'ngx-capture';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement> ;
  @ViewChild('screen', { static: true }) screen: any;
  generatedImage: string;

  imgBase64:any=''


  constructor(@Inject(PLATFORM_ID) private _platform: Object, private captureService:NgxCaptureService) {

    if(isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({video: true}).then((ms: MediaStream) => {
        const _video = this.video.nativeElement;
        _video.srcObject = ms;
        _video.play();
      });
    }
  }


  title = 'image-logo-merge-ang';


  getPhoto(){
    this.captureService.getImage(this.screen.nativeElement, true).subscribe(x=>{
      console.log(x);
      this.imgBase64=x;
      this.save();
    })
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)
    const imageBlob: Blob = new Blob([ia], { type: "image/jpeg" });;
      const imageName: string = this.generateName();
      const imageFile: File = new File([imageBlob], imageName, {
        type: "image/jpeg"
      });
      this.generatedImage = window.URL.createObjectURL(imageFile);
      window.open(this.generatedImage);
  }

  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = "";
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + "." + text + ".jpeg";
  }

  save(){
    const file = this.DataURIToBlob(this.imgBase64)
    const formData = new FormData();
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}


