import {Component, EventEmitter, OnInit} from '@angular/core';
import {UploadTaskComponent} from './upload-task/upload-task.component';
import {ProjectPageComponent} from "../project-page/project-page.component";
import {finalize} from "rxjs/operators";
import {AuthService} from "../../shared/services/auth.service";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;
  task: AngularFireUploadTask;
  downloadURL: Promise<any>;

  constructor(public uploadTask: UploadTaskComponent, public project: ProjectPageComponent,
              public authService: AuthService, private storage: AngularFireStorage) {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  async onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      await this.tmpUpload(files.item(i));
      // this.uploadTask.file = files.item(i);
      // this.uploadTask.startUpload();
    }
  }

  tmpUpload(file){
    const uid = this.authService.userData.uid;
    const date = new Date();
    const today = `${date.getFullYear()}${date.getMonth()}${date.getDate()}|${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const URL = `project/${uid}/${this.project.projectID}/tmp/images/${today}_${file.name}`;

    const ref = this.storage.ref(URL);
    this.task = this.storage.upload(URL, file);
    return this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL().toPromise();
      }),
    ).toPromise().then( async () => {
      this.project.tmpAllImages.push(await this.downloadURL);
      this.project.tmpAddedImages.push(file);
      this.project.pictureChange = true;
    });
  }

  async onFilesSelected(input) {
    for (let i = 0; i < input.files.length; i++) {
      await this.tmpUpload(input.files.item(i));
      // this.uploadTask.file = input.files[i];
      // this.uploadTask.startUpload();
    }
  }

  ngOnInit(): void {
  }
}

