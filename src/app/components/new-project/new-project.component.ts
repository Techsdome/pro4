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
  bannerRef: string;
  bannerFile: File;
  bannerMetadata: any;
  bannerWidth: number;
  bannerHeight: number;

  imagesURLPromises = [];
  imageFiles: File[];
  imagesRef: string;

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

  async uploadBannerImage(): Promise<any> {
    if (this.pservice.getProjectID()) {
      this.projectID = this.pservice.getProjectID();
      if (this.bannerFile) {
        const date = new Date();
        const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;

        this.bannerRef = `project/${this.user.uid}/${this.projectID}/banner/${today}_${this.bannerFile.name}`;

        const reader = new FileReader();
        reader.readAsDataURL(this.bannerFile);
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            this.bannerWidth = img.width;
            this.bannerHeight = img.height;
          };
          img.src = (reader.result) as string;
        };

        this.task = this.storage.upload(this.bannerRef, this.bannerFile);
        return this.task.snapshotChanges().pipe(
          finalize(() => {
            this.bannerURLPromise = this.storage.ref(this.bannerRef).getDownloadURL().toPromise();
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
            const date = new Date();
            const today = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}`;

            const URL = `project/${this.user.uid}/${this.projectID}/images/${today}_${myFile.name}`;
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
      document.getElementsByClassName('saving-project').item(0).className += ' visible';

      await this.pservice.addData(this.user.uid, name, this.description, this.selectedCategories, this.selectedMembers);

      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';

      await this.uploadBannerImage();
      const bannerURL = await this.bannerURLPromise;

      if (this.bannerRef) {
        this.bannerMetadata = {
          customMetadata: {
            width: this.bannerWidth,
            height: this.bannerHeight
          }
        };

        await this.storage.storage.ref(this.bannerRef).updateMetadata(this.bannerMetadata);
      }

      const imagesURLs = [];
      await this.uploadImages();
      await Promise.all(this.taskPromises);
      for (const URL of this.imagesURLPromises) {
        imagesURLs.push(await URL);
      }

      await this.pservice.uploadPictures(bannerURL, imagesURLs).then(() => {
        document.getElementsByClassName('saving-project').item(0).className = 'saving-project';
      });

      if (!this.failed) {
        this.activeModal.close();
        this.router.navigate(['/project-page'], {state: {data: this.projectID}}).then();
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
