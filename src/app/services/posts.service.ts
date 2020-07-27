import {Injectable} from '@angular/core';
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import {AuthService} from '../shared/services/auth.service';
import {Posts} from "../shared/services/posts";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(public authservice: AuthService) {
  }


  projectObject: Posts;
  postId: string;

  getPosts(filter?: string) {
    const posts = [];

    this.authservice.afs.collection('mainFeed').doc('allPosts').collection('post').valueChanges()
      .subscribe((val) => {
        const parray = filter ? val.filter(value => value.postType === filter) : val;

        parray.forEach((value) => {
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
                likes: value.likes,
                comments: [
                  {
                    commentName: '',
                    comment: ''
                  }
                ]
              };
              posts.push(this.projectObject);
            });
        });
      });
    return posts;
  }
}

