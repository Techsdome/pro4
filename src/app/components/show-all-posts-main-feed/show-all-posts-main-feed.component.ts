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

  constructor(public authservice: AuthService, private postService: PostsService) {
  }


  ngOnInit(): void {
    this.activeMenu = '';
    this.changeMenuItem(this.activeMenu);
  }

  changeMenuItem(event) {
    this.posts = [];
    this.posts = this.postService.getPosts(event);
    console.log(this.posts);
  }
}
