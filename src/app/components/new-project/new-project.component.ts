import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {NewProjectService} from '../../shared/services/new-project.service';
import {User} from '../../shared/services/user';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {AngularFireStorage} from 'angularfire2/storage';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Item} from '../../models/Item';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NewProjectComponent implements OnInit {
  showScreen = false;
  items: Item[];
  user: User;
  posts: string[];
  post: string;
  description: string;
  task: AngularFireUploadTask;
  taskPromises = [];
  bannerURLPromise: Promise<any>;
  imagesURLPromises = [];
  bannerFile: File;
  imageFiles: File[];
  projectID: string;
  selectedCategories: string[];
  selectedMembers: string[];
  isPurpose: string;
  failed = false;

  editorForm: FormGroup;

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

  constructor(private dataService: DataServiceService, private authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule, public activeModal: NgbActiveModal, private modalService: NgbModal,
              private storage: AngularFireStorage, private router: Router) {
  }

  getChildMessage(message: any) {
    if (this.isPurpose === 'tags') {
      this.selectedCategories = message;
    }
    if (this.isPurpose === 'members') {
      this.selectedMembers = message;
    }
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
      }
    } else {
      alert('Could not upload banner');
      this.failed = true;
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
      this.failed = true;
    }
  }

  async submit(name: string) {
    if (name && this.user) {
      document.getElementsByClassName('spinner-border').item(0).setAttribute('style', 'display: inline');

      await this.pservice.addData(this.user.uid, name, this.description, this.selectedCategories, this.selectedMembers);

      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';

      await this.uploadBannerImage();
      const bannerURL = await this.bannerURLPromise;

      const imagesURLs = [];
      this.uploadImages();
      await Promise.all(this.taskPromises);
      for (const URL of this.imagesURLPromises) {
        imagesURLs.push(await URL);
      }

      if (!(bannerURL == null) && !(imagesURLs == null || imagesURLs === undefined)) {
        document.getElementsByClassName('spinner-border').item(0).setAttribute('style', 'display: inline');
        await this.pservice.uploadPictures(bannerURL, imagesURLs).then(() => {
          document.getElementsByClassName('spinner-border').item(0).setAttribute('style', 'display: none');
        });
      }

      if (!this.failed) {
        this.router.navigate(['/project-page', {state: {data: this.projectID}}]).then();
        this.activeModal.close();
      }
    } else {
      document.getElementById('fillCorrectly').style.display = 'block';
    }
  }

  getExtendedData(item) {
    for (const it in item) {
      if (this.user.uid === item[it].uid) {
        this.posts = item[it].posts;
      }
    }
  }

  toggleScreen() {
    this.showScreen = !this.showScreen;
    this.post = '';
  }

  ngOnInit(): void {
    this.dataService.getItems().subscribe(items => {
      this.items = items;
      this.getExtendedData(items);
    });

    this.dataService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
    this.editorForm = new FormGroup({
      editor: new FormControl(null)
    });
  }

  maxLength(e) {
    if (e.editor.getLength() > 1000) {
      e.editor.deleteText(10, e.editor.getLength());
    }
  }
}
