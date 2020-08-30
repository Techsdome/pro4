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
  activeFilter: string;

  commentObject = {
    commentName: '',
    comment: ''
  };

  constructor(public authservice: AuthService, private postService: PostsService) {
  }

  ngOnInit(): void {
    this.activeMenu = '';
    this.activeFilter = 'recent';
    this.posts = [];

    this.postService.getPosts().then(posts => {
      this.posts = posts;

      this.changeFilterType(this.activeFilter);
    });
  }

  changeFilterType(type: string) {
    this.posts = [];
    this.activeFilter = type;

    if (type === 'recent') {
      if (this.activeMenu === '') {
        this.postService.getPosts().then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
          this.posts.forEach((post) => {
            console.log(post.postDate);
          });
        });
      } else {
        this.postService.getPosts(this.activeMenu).then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
          this.posts.forEach((post) => {
            console.log(post.postDate);
          });
        });
      }
    } else if (type === 'popular') {
      if (this.activeMenu === '') {
        this.postService.getPosts().then(posts => {
          let tmpPost = posts;
          tmpPost.forEach((post) => {
            console.log(post.likes);
          });
          tmpPost = tmpPost.sort(this.sortByPopularity);
          console.log('tmp ' + tmpPost[0].likes);

          this.posts = this.moveZeros(tmpPost);
          this.posts.forEach((post) => {
            console.log(post.likes);
          });
        });
      } else {
        this.postService.getPosts(this.activeMenu).then(posts => {
          const tmpPost = posts.sort(this.sortByPopularity);
          console.log('tmp ' + tmpPost[0].likes);
          this.posts = this.moveZeros(tmpPost);
          this.posts.forEach((post) => {
            console.log(post.likes);
          });
        });
      }
    }
  }

  moveZeros(postArray) {
    const tmpArray = [];
    const zeroCounter = [];

    for (const index in postArray) {
      if (postArray[index].likes === 0) {
        zeroCounter.push(postArray[index]);
      } else {
        tmpArray.push(postArray[index]);
      }
    }

    if (zeroCounter.length > 0) {
      for (let i = 0; i < zeroCounter.length; i++) {
        tmpArray.push(zeroCounter[i]);
      }
    }

    return tmpArray;
  }

  sortAfterDate(a, b) {
    let date1 = a.timestamp ? a.timestamp : a.date;
    let date2 = b.timestamp ? b.timestamp : b.date;
    
    if (date1 && date2) {
      console.log(date1);
      console.log(date2);

      date1 = Date.parse(date1);
      date2 = Date.parse(date2);

      console.log(date1);
      console.log(date2);

      if (date1 > date2) {
        return -1;
      }
      if (date1 < date2) {
        return 1;
      }
      return 0;
    }
  }

  sortByPopularity(a, b) {
    const like1 = a.likes;
    const like2 = b.likes;

    if (like1 && like2) {
      if (like1 > like2) {
        return -1;
      }
      if (like1 < like2) {
        return 1;
      }
      return 0;
    }
  }


  changeMenuItem(postType) {
    this.posts = [];
    this.activeMenu = postType;

    if (postType === '') {
      this.postService.getPosts().then(posts => {
        this.posts = posts;
        this.changeFilterType(this.activeFilter);
      });
    } else {
      this.postService.getPosts(postType).then(posts => {
        this.posts = posts;
        this.changeFilterType(this.activeFilter);
      });
    }
  }
}
