import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;
import {PostsService} from '../../services/posts.service';

@Component({
    selector: 'app-show-projects',
    templateUrl: './show-projects.component.html',
    styleUrls: ['./show-projects.component.css']
})
export class ShowProjectsComponent implements OnInit {

    user: any;
    posts: any[] = [];

    edit = false;
    comment: string;
    allComments: {}[];
    showCommentSection = false;
    commentsLenght: number;
    postId: string;

    activeMenu: string;
    filter: boolean;

    constructor(public authservice: AuthService, private postService: PostsService) {
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
                    this.authservice.afs.doc(`mainFeed/allPosts/post/${this.postId}`).collection('comments').add({
                        comment: this.comment,
                        commentName: val.firstname + val.lastname
                    });
                    this.comment = '';
                });
        });
    }

  setActive(link) {
    this.activeMenu = link;
    this.posts = this.postService.getPosts(link);
  }

  toggle() {
    this.filter = !this.filter;
  }

    ngOnInit(): void {
      this.posts = this.postService.getPosts();
    }
}
