import {Component, OnInit} from '@angular/core';
import {NewProjectComponent} from '../new-project/new-project.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Posts} from '../../shared/services/posts';
import {AuthService} from '../../shared/services/auth.service';
import {PostsService} from '../../services/posts.service';
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
  activeMenu: string;
  postId: string;
  private sub: any;
  searchedUserId;

  private navigationSubscription: any;

  constructor(
    public newproject: NewProjectComponent,
    private route: ActivatedRoute,
    public authservice: AuthService, private postService: PostsService
  ) {
  }

  async changeMenuItem(postType) {
    this.posts = [];
    if (postType === '') {
      this.posts = await this.postService.getPosts('', this.searchedUserId);
    } else {
      this.posts = await this.postService.getPosts(postType, this.searchedUserId);
    }
  }

  async ngOnInit() {
    this.activeMenu = '';

    this.sub = this.route.params.subscribe(params => {
      this.searchedUserId = params.user;
      this.postService.getPosts(this.activeMenu, this.searchedUserId).then((posts) => {
        this.posts = posts;
      });
    });
  }

  toggleProject() {
    this.newproject.toggleScreen();
  }

}
