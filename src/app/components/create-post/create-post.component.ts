import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {DocumentChangeAction} from "@angular/fire/firestore";
import DocumentData = firebase.firestore.DocumentData;

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
    postsFetched: DocumentChangeAction<DocumentData>[];


//    this.afs.collection('users').doc(this.userData.uid).update({});

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
        // this.posts.push(this.post);
        this.updatePostsFirebase();
    }

    updatePostsFirebase() {
        const date: Date = new Date();
        this.authService.afs.doc(`users/${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').add({
            post: this.post,
            date: date.toLocaleDateString(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            second: date.getSeconds()
        });
    }

    getAllPosts() {
        const uid = this.authService.afAuth.auth.currentUser.uid;
        // const test = this.authService.afs.collection(`users`).doc(`${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').snapshotChanges();
        this.authService.afs.doc(`users/${uid}`).collection('posts').snapshotChanges().subscribe(item => {
            this.postsFetched = item;
            console.log(item);
            for (let i = 0; i < item.length; i++) {
                // console.log(item[i].payload.doc.um.Gw.zh.persistence.so.docs.root.value.bc);
            }
        });
    }

    toggleScreen() {
        this.showScreen = !this.showScreen;
    }


    ngOnInit(): void {
        this.dataService.getItems().subscribe(items => {
            this.items = items;
            this.getExtendedData(items);
            console.log(this.items);
            this.getAllPosts();
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
        });
    }
}
