import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {ɵAnimationGroupPlayer} from '@angular/animations';
import * as admin from 'firebase-admin';

@Component({
    selector: 'app-show-post',
    templateUrl: './show-post.component.html',
    styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
    user: any;
    posts: any[] = [];
    photoURL: string;

    constructor(public authservice: AuthService) {
    }

    ngOnInit(): void {
        this.authservice.getCurrentUser().subscribe((result) => {
            this.user = result;
            this.photoURL = result.photoURL;
            console.log(result.photoURL);
            this.authservice.afs.collection('users').doc(result.uid)
                .collection('posts').valueChanges()
                .subscribe((val) => {
                    this.posts = [];
                    val.forEach((value) => {
                        this.posts.push(value.post);
                    });
                });
        });
    }

}
