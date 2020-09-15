import {Component, OnInit} from '@angular/core';
import {NewProjectComponent} from '../../new-project/new-project.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Posts} from '../../../shared/services/posts';
import {AuthService} from '../../../shared/services/auth.service';
import {PostsService} from '../../../services/posts.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public uid: any;
  userObject = history.state.data;
  posts: any[];
  projectObject: Posts;
  postId: string;
  private sub: any;
  searchedUserId;
  profile_id_meber = history.state.profile_id_meber;

  // filtering
  activeMenu: string;
  activeFilter: string;

  private navigationSubscription: any;

  // posts
  // activeMenu: string;

  constructor(
    public newproject: NewProjectComponent,
    private route: ActivatedRoute,
    public authservice: AuthService, private postService: PostsService
  ) {
  }

  async changeMenuItem(postType) {
    this.posts = [];
    this.activeMenu = postType;

    if (postType === '') {
      this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
        this.posts = posts;
        this.changeFilterType(this.activeFilter);
      });
    } else {
      this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
        this.posts = posts;
        this.changeFilterType(this.activeFilter);
      });
    }
  }

   ngOnInit() {    
    this.activeMenu = '';
    this.activeFilter = 'recent';
    this.posts = [];

    this.sub = this.route.params.subscribe(params => {
      this.searchedUserId = params.user;
      this.changeFilterType(this.activeFilter);
    });
  }

  changeFilterType(type: string) {
    this.posts = [];
    this.activeFilter = type;

    if (type === 'recent') {
      if (this.activeMenu === '') {
        this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
        });
      } else {
        this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
          this.posts = posts.sort(this.sortAfterDate);
        });
      }
    } else if (type === 'popular') {
      if (this.activeMenu === '') {
        this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
          this.posts = posts.sort(this.sortByPopularity);
        });
      } else {
        this.postService.getPosts(this.activeMenu, this.searchedUserId).then(posts => {
          this.posts = posts.sort(this.sortByPopularity);
        });
      }
    }
  }

  sortAfterDate(a, b) {
    let date1 = a.timestamp ? a.timestamp : a.date;
    let date2 = b.timestamp ? b.timestamp : b.date;

    if (date1 && date2) {
      date1 = Date.parse(date1);
      date2 = Date.parse(date2);

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

    if (like1 > like2) {
      return -1;
    }
    if (like1 < like2) {
      return 1;
    }
    return 0;
  }

  toggleProject() {
    this.newproject.toggleScreen();
  }
}
