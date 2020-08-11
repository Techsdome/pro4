import {Component, OnInit, Input, ChangeDetectorRef, Inject} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {AuthService} from '../../../shared/services/auth.service';
import {ProjectPageComponent} from '../../project-page/project-page.component';
import FieldValue = firebase.firestore.FieldValue;
import * as firebase from 'firebase';
import {formatDate} from '@angular/common';
import { LOCALE_ID} from '@angular/core';


@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  file: File;
  task: AngularFireUploadTask;
  path: string;
  projectID: string;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Promise<any>;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore,
              public authService: AuthService) {
  }

  setPath(path: string) {
    this.path = path;
  }

  setProjectID(id) {
    this.projectID = id;
  }

  setFileToUpload(file) {
    this.file = file;
  }

  ngOnInit() {
    this.startUpload();
  }

  async startUpload() {
    await this.upload();
    // this.afs.doc(`project/${this.project.projectID}`).update(  {
    //   projectImages: FieldValue.arrayUnion(await this.downloadURL)
    // });
  }

  upload() {
    // The storage path
    if (this.file) {
      const uid = this.authService.userData.uid;
      const date = new Date();
      const today = `${date.getFullYear()}${date.getMonth()}${date.getDate()}|${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      if (!this.path) {
        this.path = `project/${uid}/${this.projectID}/images/${today}_${this.file.name}`;
      }

      // Reference to storage bucket
      const ref = this.storage.ref(this.path);

      // The main task
      this.task = this.storage.upload(this.path, this.file);
      return this.task.snapshotChanges().pipe(
        // The file's download URL
        finalize(() => {
          this.downloadURL = ref.getDownloadURL().toPromise();
        }),
      ).toPromise();
    }
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
