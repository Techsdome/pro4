import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {AngularFireUploadTask} from '@angular/fire/storage';
import * as firebase from 'firebase';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PostsService} from "../../services/posts.service";


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
  projectID: string;
  selectedCategories: string[] = [];
  public type: string;
  public tabIndex = 0;
  editorForm: FormGroup;

  // tags variables
  selectableTag = true;
  removableTag = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  isShow = false;


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

  constructor(private dataService: DataServiceService, private authService: AuthService,
              public form: FormsModule, public activeModal: NgbActiveModal, private postsService: PostsService) {
  }

  ngOnInit(): void {

    if (this.type === 'post') {
      this.tabIndex = 0;
    } else if (this.type === 'question') {
      this.tabIndex = 1;
    } else if (this.type === 'project') {
      this.tabIndex = 2;
    }

    (document.getElementById('create-post-form') as HTMLInputElement).click();

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
    }).then(r => {});

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
      likes: [],
      uid: this.authService.afAuth.auth.currentUser.uid,
      photoURL: this.user.photoURL,
      displayName: this.user.displayName,
    }).then(docRef => {
      this.authService.afs.doc(`mainFeed/allPosts`).collection('post').doc(docRef.id).update({
        postId: docRef.id,
        tags: this.selectedCategories,
        postType: '' + postType
      }).then(r => {
        this.postsService.setViewed(docRef.id, this.authService.afAuth.auth.currentUser.uid);
        this.activeModal.close();
      });
    });
    /*      loading Time
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
              tags: this.selectedCategories,
              postType: '' + postType
            });
          });
        })
    });;*/
  }

  toggleScreen() {
    this.showScreen = !this.showScreen;
    this.post = '';
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.selectedCategories.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedCategories.indexOf(tag);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

  maxLength(e) {
    if (e.editor.getLength() > 1000) {
      e.editor.deleteText(10, e.editor.getLength());
    }
  }
}
