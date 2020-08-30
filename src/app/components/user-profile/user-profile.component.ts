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

  changeMenuItem(event) {
    this.posts = this.postService.getPosts(event);
  }

  ngOnInit(): void {
    this.activeMenu = '';
    this.changeMenuItem(this.activeMenu);

    this.sub = this.route.params.subscribe(params => {
      this.searchedUserId = params.user;

      this.authservice.afs.collection('mainFeed').doc('allPosts').collection('post').valueChanges()
        .subscribe((val) => {
          this.posts = [];
          val.forEach((value) => {
            this.postId = value.postId;
            let mytime = new Date();
            let theuserid = value.uid;
            let username = value.displayName;
            let photoURL = '';
            let postText = value.post;
            let type = value.postType;
            let typeImage = 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Exclamation_mark.png';
            if (value.postType === 'project') {
              mytime = ((value.projectTimeStamp) as unknown as Timestamp).toDate();
              theuserid = value.uid;
              username = '';
              photoURL = '';
              postText = value.projectDescription;
              typeImage = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/project-management-2-536854.png';
            }
            if (value.postType === 'question') {
              typeImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1200px-Question_mark_%28black%29.svg.png';
            }

            this.authservice.afs.collection('users').doc(theuserid).get().toPromise()
              .then((userdoc) => {
                if (userdoc.data()) {
                  const myuser = userdoc.data();
                  photoURL = myuser.photoURL;
                  username = myuser.displayName ? myuser.displayName : myuser.lastname + ' ' + myuser.firstname;
                }
              })
              .then(() => {

                this.projectObject = {
                  type: type,
                  typeImage: typeImage,
                  postDate: mytime,
                  postText: postText,
                  postId: value.postId,
                  displayName: username ? username : 'Anonym',
                  projectName: value.projectName,
                  projectBanner: value.projectBanner,
                  projectId: value.projectId,
                  projectCategories: value.projectCategories,
                  projectMembers: value.projectMembers,
                  userPhotoURL: photoURL,
                  comments: [
                    {
                      commentName: '',
                      comment: ''
                    }
                  ],
                  likes: value.likes
                };

                if (this.searchedUserId === theuserid) {
                  this.posts.push(this.projectObject);
                }
              });
          });
        });
    });
  }

  toggleProject() {
    this.newproject.toggleScreen();
  }

}
