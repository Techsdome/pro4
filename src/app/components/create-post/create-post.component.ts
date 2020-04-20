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
        this.updatePostsFirebase();
    }

    updatePostsFirebase() {
        const date: Date = new Date();
        this.authService.afs.doc(`users/${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').add({
            post: this.post,
            date: date.toLocaleDateString(),
            day: date.getUTCDate(),
            month: (date.getUTCMonth() + 1),
            year: date.getUTCFullYear(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            second: date.getSeconds()
        });
        this.authService.afs.doc(`generalPosts/${this.authService.afAuth.auth.currentUser.uid}`).collection('posts').add({
            post: this.post,
            date: date.toLocaleDateString(),
            day: date.getUTCDate(),
            month: (date.getUTCMonth() + 1),
            year: date.getUTCFullYear(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            second: date.getSeconds(),
            uid: this.authService.afAuth.auth.currentUser.uid,
            photoURL: this.authService.afAuth.auth.currentUser.photoURL,
            displayName: this.authService.afAuth.auth.currentUser.displayName
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
    }
}
