import {Component, ElementRef, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {NewProjectService} from '../../shared/services/new-project.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from "firebase";
import { MatTabGroup } from "@angular/material/tabs";



@Component({
  selector: 'app-create-post-new',
  templateUrl: './create-post-new.component.html',
  styleUrls: ['./create-post-new.component.css']
})
export class CreatePostNewComponent implements OnInit {

  showScreen = false;
  items: Item[];
  user: User;
  posts: string[];
  post: string;

  postType: string;

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
  public type: string;
  public tabIndex = 0;

  clickElement: string;

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

  changePostTypeNormalPost() {
    this.postType = 'post';
  }

  constructor(private dataService: DataServiceService, private authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule, public activeModal: NgbActiveModal, private modalService: NgbModal,
              private storage: AngularFireStorage) {}

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
      const bannerURL = await this.bannerURLPromise;

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

  getExtendedData(item) {
    for (const it in item) {
      if (this.user.uid === item[it].uid) {
        this.posts = item[it].posts;
      }
    }
  }

  savePost(postType) {
    this.updatePostsFirebase(this.post, postType);
  }

  updatePostsFirebase(postParam, postType) {
    const date: Date = new Date();
    this.authService.afs.doc(`users/${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').add({
      post: this.post,
      date: date.toLocaleString('en-GB'),
      timeStamp: firebase.firestore.Timestamp.now(),
      day: date.getUTCDate(),
      month: (date.getUTCMonth() + 1),
      year: date.getUTCFullYear(),
      hour: date.getHours(),
      minutes: date.getMinutes(),
      second: date.getSeconds()
    });
    let tempPhotoUrl: string;
    let tempDisplayName: string;
    let tempFirstName: string;
    let tempLastName: string;

    this.authService.getCurrentUser().subscribe((result) => {
      this.user = result;
      this.authService.afs.collection('users').doc(result.uid).valueChanges()
        .subscribe((val: any) => {
          tempFirstName = val.firstname;
          tempLastName = val.lastname;
          if (this.authService.afAuth.auth.currentUser.photoURL === undefined ||
            this.authService.afAuth.auth.currentUser.photoURL === null) {
            tempPhotoUrl = 'https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png';
          } else {
            tempPhotoUrl = this.authService.afAuth.auth.currentUser.photoURL;
          }
          if (this.authService.afAuth.auth.currentUser.displayName === undefined ||
            this.authService.afAuth.auth.currentUser.displayName === null) {
            tempDisplayName = tempFirstName + ' ' + tempLastName;
          } else {
            tempDisplayName = this.authService.afAuth.auth.currentUser.displayName;
          }

          this.authService.afs.doc(`mainFeed/allPosts`).collection('post').add({
            post: postParam,
            date: date.toLocaleString('en-GB'),
            timeStamp: firebase.firestore.Timestamp.now(),
            day: date.getUTCDate(),
            month: (date.getUTCMonth() + 1),
            year: date.getUTCFullYear(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            second: date.getSeconds(),
            uid: this.authService.afAuth.auth.currentUser.uid,
            photoURL: tempPhotoUrl,
            displayName: val.lastname === 'Last Name' ? `${val.firstname}` : `${val.firstname} ${val.lastname}`,
          }).then(docRef => {
            this.authService.afs.doc(`mainFeed/allPosts`).collection('post').doc(docRef.id).update({
              postId: docRef.id,
              postType: '' + postType
            });
          });
        });
    });
  }

  toggleScreen() {
    this.showScreen = !this.showScreen;
    this.post = '';
  }



  ngOnInit(): void {

    if (this.type === "post") {
      this.tabIndex = 0;
    }
    else if (this.type === "question") {
      this.tabIndex = 1;
    }
    else if (this.type === "project") {
      this.tabIndex = 2;
    }

    (<HTMLInputElement>document.getElementById('create-post-form')).click();

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
