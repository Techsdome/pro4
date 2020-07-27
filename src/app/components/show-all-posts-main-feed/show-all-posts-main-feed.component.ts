import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {take} from 'rxjs/operators';
import * as path from 'path';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;
import {Posts} from '../../shared/services/posts';
import {PostsService} from '../../services/posts.service';


@Component({
  selector: 'app-show-all-posts-main-feed',
  templateUrl: './show-all-posts-main-feed.component.html',
  styleUrls: ['./show-all-posts-main-feed.component.css']
})
export class ShowAllPostsMainFeedComponent implements OnInit {
  user: any;
  posts: any[];
  photoURL: string;
  edit = false;
  postLenght: any;

  postId: string;
  projectObject: Posts;

  activeMenu: string;

  commentObject = {
    commentName: '',
    comment: ''
  };

  constructor(public authservice: AuthService, private postService: PostsService) {
  }


  ngOnInit(): void {
    this.activeMenu = '';
    this.changeMenuItem(this.activeMenu);
  }

  changeMenuItem(event) {
    this.posts = this.postService.getPosts(event);
  }
}
