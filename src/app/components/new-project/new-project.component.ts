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
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})

export class NewProjectComponent implements OnInit {
  user: User;
  description: string;
  task: AngularFireUploadTask;
  taskPromises = [];

  showScreen = false;
  bannerURLPromise: Promise<any>;
  imagesURLPromises = [];
  bannerFile: File;
  imageFiles: File[];
  projectID: string;
  selectedCategories: string[];
  selectedMembers: string[];
  isPurpose: string;

  editorStyle = {
    justifyContent: 'center',
    alignContent: 'center',
    height: '200px',
    width: '100%',
    backgroundColor: 'white',
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'size'],
      ['blockquote', 'code-block', 'link'],
    ]
  };

  constructor(public authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule, public activeModal: NgbActiveModal, private modalService: NgbModal,
              private storage: AngularFireStorage) {
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
    if (this.isPurpose === 'tags') {
      this.selectedCategories = message;
    }
    if (this.isPurpose === 'members')
      this.selectedMembers = message;
  }

  getPurposeMessage(message: string) {
    this.isPurpose = message;
  }

  getBannerFile(message: any) {
    this.bannerFile = message;
  }

  getImageFiles(message) {
    this.imageFiles = message;
  }

  uploadBannerImage(): Promise<any> {
    if (this.pservice.getProjectID()) {
      this.projectID = this.pservice.getProjectID();
      if (this.bannerFile) {
        const URL = `project/${this.user.uid}/${this.projectID}/banner/${this.bannerFile.name}`;

        this.task = this.storage.upload(URL, this.bannerFile);
        return this.task.snapshotChanges().pipe(
          finalize(() => {
            this.bannerURLPromise = this.storage.ref(URL).getDownloadURL().toPromise();
          }),
        ).toPromise();
      } else {
        alert('Please select a banner picture');
      }
    } else {
      alert('Could not upload banner');
    }
  }

  async uploadImages(): Promise<any> {
    if (this.pservice.getProjectID()) {
      this.projectID = this.pservice.getProjectID();
      if (this.imageFiles) {
        this.imageFiles.forEach((myFile) => {
          if (myFile) {
            const URL = `project/${this.user.uid}/${this.projectID}/images/${myFile.name}`;
            this.task = this.storage.upload(URL, myFile);

            this.taskPromises.push(this.task.snapshotChanges().pipe(
              finalize(() => {
                this.imagesURLPromises.push(this.storage.ref(URL).getDownloadURL().toPromise());
              })
            ).toPromise());
          }
        });
      }
    } else {
      alert('Could not upload images');
    }
  }

  async Submit(name: string) {
    if (name && this.user) {

      await this.pservice.addData(this.user.uid, name, this.description, this.selectedCategories, this.selectedMembers);

      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';

      await this.uploadBannerImage();
      const bannerURL =  await this.bannerURLPromise;

      const imagesURLs = [];
      this.uploadImages();
      await Promise.all(this.taskPromises);
      for (const URL of this.imagesURLPromises) {
        imagesURLs.push(await URL);
      }

      this.pservice.uploadPictures(bannerURL, imagesURLs);
      this.activeModal.close();
    } else {
      document.getElementById('fillCorrectly').style.display = 'block';
    }
  }
}
