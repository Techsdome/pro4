import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {NewProjectService} from '../../shared/services/new-project.service';
import {User} from '../../shared/services/user';
import {FormsModule} from '@angular/forms';
import {AngularFireStorage} from 'angularfire2/storage';
import {FileUploader} from 'ng2-file-upload';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})

export class NewProjectComponent implements OnInit {
  user: User;
  task: AngularFireUploadTask;
  showScreen = false;
  URL: string;
  bannerURL: string;
  imagesURL = [];
  @Input() selectedCategories: string[];
  @Input() selectedMembers: string;

  constructor(public authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule,
              private storage: AngularFireStorage) {
  }

  public uploader: FileUploader = new FileUploader({
    url: ' ',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image']
  });

  public uploader2: FileUploader = new FileUploader({
    url: ' ',
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image']
  });

  public onFileSelected(event: EventEmitter<File[]>) {
    if (this.uploader.queue.length < 2) {
      const file: File = event[0];
      this.bannerURL = `project/${this.user.uid}/banner/${file.name}`;
      this.uploader.queue[0].url = this.bannerURL;

      this.task = this.storage.upload(this.bannerURL, file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.storage.ref(this.bannerURL).getDownloadURL().subscribe(url => {
            this.bannerURL = url;
          });
        }),
      ).subscribe();
    }
  }

  public onFileSelected2(event: EventEmitter<File[]>) {
    let it = 0;

    this.uploader2.queue.forEach((myfile) => {
      const file: File = event[it];

      const URL = `project/${this.user.uid}/images/${file.name}`;
      console.log('file: ' + file.name);

      this.uploader2.queue[it].url = URL;
      this.task = this.storage.upload(URL, file);

      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.storage.ref(URL).getDownloadURL().subscribe(url => {
            this.imagesURL.push(url);
            console.log('finalize: ' + url);
          });
        }),
      ).subscribe();
      it++;
      console.log('iterator: ' + it);
    });
  }

  ngOnInit() {
    this.pservice.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  toggleScreen() {
    this.showScreen = !this.showScreen;
  }

  getChildMessage(message: any) {
    this.selectedCategories = message;
  }

  getPurposeMessage(message: string) {
    this.selectedMembers = message;
  }

  Submit(name: string, description: string) {
    if (name && description && this.user) {
      this.pservice.addData(this.user.uid, name, description, this.selectedCategories, this.bannerURL, this.imagesURL, this.selectedMembers);
      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';
    } else {
      document.getElementById('fillCorrectly').style.display = 'block';
    }
  }

}
