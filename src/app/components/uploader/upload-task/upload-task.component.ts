import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {AuthService} from '../../../shared/services/auth.service';


@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  task: AngularFireUploadTask;
  path: string;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    // The storage path
    const uid = this.authService.userData.uid;
    this.path = `project/${uid}/${this.file.name}`;
    
    // Reference to storage bucket
    const ref = this.storage.ref(this.path);

    // The main task
    this.task = this.storage.upload(this.path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        // this.db.collection('projects').doc().update({ downloadURL: this.downloadURL, path });
        // this.authService.afs.collection('users').doc(this.user.uid).set({
        //
        // });
      }),
    );
  }

  getDownloadURL() {
    return this.downloadURL;
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
