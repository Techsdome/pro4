import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

    showScreen = false;
    items: Item[];
    user: User;
    posts: string[];
    post: string;

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

    constructor(private dataService: DataServiceService, private authService: AuthService) {
    }

    getExtendedData(item) {
        for (const it in item) {
            if (this.user.uid === item[it].uid) {
                this.posts = item[it].posts;
            }
        }
    }

    savePost() {
        this.updatePostsFirebase(this.post);
    }

    updatePostsFirebase(postParam) {
        const date: Date = new Date();
        this.authService.afs.doc(`users/${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').add({
            post: this.post,
            date: date.toUTCString(),
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

                    this.authService.afs.doc(`generalPosts/allPosts`).collection('post').add({
                        post: postParam,
                        date: date.toUTCString(),
                        day: date.getUTCDate(),
                        month: (date.getUTCMonth() + 1),
                        year: date.getUTCFullYear(),
                        hour: date.getHours(),
                        minutes: date.getMinutes(),
                        second: date.getSeconds(),
                        uid: this.authService.afAuth.auth.currentUser.uid,
                        photoURL: tempPhotoUrl,
                        displayName: `${val.firstname} ${val.lastname}`
                    }).then(docRef => {
                        this.authService.afs.doc(`generalPosts/allPosts`).collection('post').doc(docRef.id).update({
                            postId: docRef.id
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
