import { Component, OnInit } from '@angular/core';
import {UploadTaskComponent} from './upload-task/upload-task.component';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;
  files: File[] = [];

  constructor(public uploadTask: UploadTaskComponent) {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.uploadTask.file = files.item(i);
      this.uploadTask.startUpload();

      // this.files.push(files.item(i));
    }
  }

  ngOnInit(): void {
  }
}

