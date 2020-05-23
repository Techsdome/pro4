import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {AuthService} from '../../../shared/services/auth.service';
import {ProjectPageComponent} from '../../project-page/project-page.component';
import FieldValue = firebase.firestore.FieldValue;
import * as firebase from 'firebase';


@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  file: File;
  task: AngularFireUploadTask;
  path: string;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Promise<any>;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore,
              public authService: AuthService, private project: ProjectPageComponent) {
  }

  ngOnInit() {
    this.startUpload();
  }

  async startUpload() {
    await this.upload();
    this.afs.doc(`project/${this.project.projectID}`).update(  {
      projectImages: FieldValue.arrayUnion(await this.downloadURL)
    }).then((data) => {
      this.project.loadProject();
    });
  }

  upload() {
    // The storage path
    if (this.file) {
      const uid = this.authService.userData.uid;
      const URL = `project/${uid}/${this.project.projectID}/images/${this.file.name}`;

      // Reference to storage bucket
      const ref = this.storage.ref(URL);

      // The main task
      this.task = this.storage.upload(URL, this.file);
      return this.task.snapshotChanges().pipe(
        // The file's download URL
        finalize(() => {
          this.downloadURL = ref.getDownloadURL().toPromise();

          // this.db.collection('projects').doc().update({ downloadURL: this.downloadURL, path });
          // this.authService.afs.collection('users').doc(this.user.uid).set({
          //
          // });
        }),
      ).toPromise();
    }
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
