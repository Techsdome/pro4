import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
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
  postId: string;
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

    this.changeFilterType(this.activeFilter);

    // !!!!!!!!! LOADING DELAY PERHAPS !!!!!!!!!! 

    /*this.postService.getPosts().then(posts => {
      this.posts = posts;

      this.changeFilterType(this.activeFilter);
    });*/
  }

  changeFilterType(type: string) {
    this.posts = [];
    this.activeFilter = type;

    if (type === 'recent') {
      if (this.activeMenu === '') {
        this.postService.getPosts().then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
        });
      } else {
        this.postService.getPosts(this.activeMenu).then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
        });
      }
    } else if (type === 'popular') {
      if (this.activeMenu === '') {
        this.postService.getPosts().then(posts => {
          this.posts = posts.sort(this.sortByPopularity);
        });
      } else {
        this.postService.getPosts(this.activeMenu).then(posts => {
          this.posts = posts.sort(this.sortByPopularity);
        });
      }
    }
  }

  sortAfterDate(a, b) {
    const date1 = a.postDate;
    const date2 = b.postDate;

    if (date1 && date2) {
      if (date1 && date2) {
        if (date1 > date2) {
          return -1;
        }
        if (date1 < date2) {
          return 1;
        }
        return 0;
      }
    }
  }

  sortByPopularity(a, b) {
    const like1 = Object.keys(a.likes).length;
    const like2 = Object.keys(b.likes).length;

    if (like1 > like2) {
      return -1;
    }
    if (like1 < like2) {
      return 1;
    }
    return 0;
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
