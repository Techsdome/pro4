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
              type,
              typeImage,
              postDate: mytime,
              postText,
              postId: value.data().postId,
              displayName: username ? username : 'Anonym',
              projectName: value.data().projectName,
              projectBanner: value.data().projectBanner,
              projectId: value.data().projectId,
              projectCategories: value.data().projectCategories,
              projectMembers: value.data().projectMembers,
              userPhotoURL: photoURL,
              likes: value.data().likes,
              comments: [
                {
                  commentName: '',
                  comment: ''
                }
              ]
            };
            this.posts.push(this.projectObject);
          });
      });
    });
  }

  ngOnInit(): void {
    this.activeMenu = '';
    this.changeMenuItem(this.activeMenu);
    this.posts = [];

    this.loadPosts();
  }

  changeMenuItem(event) {
    this.posts = [];
    if (event === '') {
      this.loadPosts();
    } else {
      this.posts = this.postService.getPosts(event);
    }
  }
}
