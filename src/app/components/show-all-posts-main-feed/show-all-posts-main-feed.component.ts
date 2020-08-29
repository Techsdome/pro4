import {Component, OnInit, TrackByFunction} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
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

  loadPosts() {
    this.authservice.afs.collection(`mainFeed/allPosts/post`).get().toPromise().then((querySnapshot) => {
      querySnapshot.forEach((value) => {
        this.postId = value.data().postId;
        let mytime = new Date();
        let theuserid = value.data().uid;
        let username = value.data().displayName;
        let photoURL = '';
        let postText = value.data().post;
        const type = value.data().postType;

        let typeImage = '../../../assets/icons/em.svg';
        if (value.data().postType === 'project') {
          mytime = ((value.data().projectTimeStamp) as unknown as Timestamp).toDate();
          theuserid = value.data().uid;
          username = '';
          photoURL = '';
          postText = value.data().projectDescription;
          typeImage = '../../../assets/icons/project.svg';
        }
        if (value.data().postType === 'question') {
          typeImage = '../../../assets/icons/q2.svg';
        }
  ngOnInit(): void {
    this.activeMenu = '';
    this.posts = [];

    this.postService.getPosts().then( posts => {
      this.posts = posts;
    });
  }

  sortByRecentness() {

  }

  changeMenuItem(postType) {
    this.posts = [];
    if (postType === '') {
       this.postService.getPosts().then( posts => {
         this.posts = posts;
      });
    } else {
      this.postService.getPosts(postType).then( posts => {
        this.posts = posts;
      });
    }
  }
}
