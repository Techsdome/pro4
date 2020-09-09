import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {User} from '../../shared/services/user';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {AuthService} from '../../shared/services/auth.service';
import {NewProjectService} from '../../shared/services/new-project.service';
import {AngularFireStorage} from 'angularfire2/storage';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {

  constructor(public authService: AuthService, public pservice: NewProjectService, private storage: AngularFireStorage) {
  }

  @Input() addButton: string;
  @Output() childMessage = new EventEmitter<File>();
  URL: string;
  bannerFile: File;
  user: User;
  task: AngularFireUploadTask;
  bannerURL: string;

  public uploader: FileUploader = new FileUploader({
    url: ' ',
    queueLimit: 1,
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image']
  });

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    this.bannerFile = file;
    this.sendFileToParent();

    // this.task = this.storage.upload(this.bannerURL, file);
    // this.task.snapshotChanges().pipe(
    //   finalize(() => {
    //     this.storage.ref(this.bannerURL).getDownloadURL().subscribe(url => {
    //       this.bannerURL = url;
    //     });
    //   }),
    // ).subscribe();
  }

  sendFileToParent() {
    this.childMessage.emit(this.bannerFile);
  }
}
