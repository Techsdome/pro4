import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {PostsService} from "../../services/posts.service";

@Component({
  selector: 'app-suggested-project',
  templateUrl: './suggested-project.component.html',
  styleUrls: ['./suggested-project.component.css']
})
export class SuggestedProjectComponent implements OnInit {

  posts = [];
  topProject: any;

  constructor(public authservice: AuthService, private postService: PostsService) {
  }

  ngOnInit(): void {
    this.postService.getPosts('project').then(posts => {
      this.posts = posts.sort(this.sortAfterDate);
      this.getRandomProject();
    });
  }

  getRandomProject() {
    const randomIndex = Math.round(Math.random() * ((this.posts.length - 1)));
    this.topProject = this.posts[randomIndex];
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
}
