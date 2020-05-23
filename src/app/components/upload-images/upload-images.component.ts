import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit {

  constructor() { }

  @Input() addButton: string;
  @Output() imagesMessage = new EventEmitter<File[]>();
  imageFiles: File[] = [];

  public uploader: FileUploader = new FileUploader({
    url: ' ',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image']
  });

  ngOnInit(): void {
  }

  public onFilesSelected(event: EventEmitter<File[]>) {
    let it = 0;
    this.uploader.queue.forEach((myfile) => {
      const file: File = event[it];
      this.imageFiles.push(file);
      it++;
    });
    this.sendFilesToParent();
  }

  sendFilesToParent() {
    this.imagesMessage.emit(this.imageFiles);
  }

}
