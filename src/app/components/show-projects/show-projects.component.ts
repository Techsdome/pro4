import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;
import {Posts} from '../../shared/services/posts';
import {PostsService} from '../../services/posts.service';

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
  showCommentSection = false;
  commentsLenght: number;
  posts: any[] = [];

  activeMenu: string;
  filter: boolean;
  likes: number;


  constructor(public authservice: AuthService, private postService: PostsService) {
  }

  openCommentSection() {
    this.showCommentSection = !this.showCommentSection;
  }

  openComment() {
    this.edit = !this.edit;
    this.showCommentSection = !this.showCommentSection;
  }

  addComment() {
    this.authservice.getCurrentUser().subscribe((result) => {
      this.authservice.afs.collection('users').doc(result.uid).valueChanges()
        .subscribe((val: any) => {
          this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).collection('comments').add({
            comment: this.comment,
            commentName: val.firstname + ' ' + val.lastname
          });
          this.comment = '';
        });
    });
  }

  updateLikes(): void {
    this.likes++;
    this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).update({
      likes: this.likes
    });
  }

  ngOnInit(): void {
    this.authservice.afs.doc(`mainFeed/allPosts/post/${this.allPostsObject.postId}`).valueChanges().subscribe((values: any) => {
      this.likes = values.likes;
    });


    this.authservice.afs.collection(`mainFeed/allPosts/post/${this.allPostsObject.postId}/comments`).valueChanges()
      .subscribe((comment) => {
        this.commentsLenght = comment.length;
        comment.forEach(cmt => {
          this.comments.push(cmt);
        });
      });
  }

  toggle() {
    this.filter = !this.filter;
  }
}
