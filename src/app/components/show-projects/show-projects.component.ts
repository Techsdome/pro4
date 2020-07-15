import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;
import {Posts} from '../../shared/services/posts';

@Component({
    selector: 'app-show-projects',
    templateUrl: './show-projects.component.html',
    styleUrls: ['./show-projects.component.css']
})
export class ShowProjectsComponent implements OnInit {

    @Input() allPostsObject: Posts;
    user: any;
    comments: any[] = [];
    edit = false;
    comment: string;
    allComments: {}[];
    showCommentSection = false;
    commentsLenght: number;
    postId: string;

    constructor(public authservice: AuthService) {
    }

    openCommentSection() {
        this.showCommentSection = !this.showCommentSection;
    }

    openComment() {
        this.edit = !this.edit;
    }

    addComment() {
        this.authservice.getCurrentUser().subscribe((result) => {
            this.authservice.afs.collection('users').doc(result.uid).valueChanges()
                .subscribe((val: any) => {
                    this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).collection('comments').add({
                        comment: this.comment,
                        commentName: val.firstname + val.lastname
                    });
                    this.comments = [];
                });
        });
    }

    ngOnInit(): void {
        this.authservice.afs.collection(`mainFeed/allPosts/post/${this.allPostsObject.postId}/comments`).valueChanges()
            .subscribe((comment) => {
                this.commentsLenght = comment.length;
                comment.forEach(cmt => {
                    this.comments.push(cmt);
                    console.log(cmt)
                });
            });
    }
}
