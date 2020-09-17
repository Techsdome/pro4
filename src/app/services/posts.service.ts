import {Injectable} from '@angular/core';
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import {AuthService} from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(public authService: AuthService) {
  }

  async getPosts(filter?: string, userid?: string): Promise<any[]> {
    const posts: any[] = [];

    const documentSnapshot = await this.authService.afs.collection(`mainFeed/allPosts/post`).get().toPromise();
    const documentArray = documentSnapshot.docs;

    for (const doc of documentArray) {
      if (filter) {
        if (doc.data().postType === filter) {
          const postId = doc.data().postId;
          const date = doc.data().date;
          const timestamp = ((doc.data().timeStamp) as unknown as Timestamp).toDate();
          let theuserid = doc.data().uid;
          let username = doc.data().displayName;
          let photoURL = '';
          let postText = doc.data().post;
          let typeImage = 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Exclamation_mark.png';

          if (doc.data().postType === 'project') {
            theuserid = doc.data().uid;
            username = '';
            photoURL = '';
            postText = doc.data().projectDescription;
            typeImage = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/project-management-2-536854.png';
          }

          if (doc.data().postType === 'question') {
            // tslint:disable-next-line:max-line-length
            typeImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/1200px-Question_mark_%28black%29.svg.png';
          }

          const userDoc = await this.authService.afs.collection('users').doc(theuserid).get().toPromise();

          if (userDoc.data()) {
            const myuser = userDoc.data();
            photoURL = myuser.photoURL;
            username = myuser.displayName ? myuser.displayName : myuser.lastname + ' ' + myuser.firstname;
          }

          const projectObject = {
            type: doc.data().postType,
            typeImage,
            postDate: date,
            timestamp,
            postText,
            postId: doc.data().postId,
            displayName: username ? username : 'Anonym',
            projectName: doc.data().projectName,
            projectBanner: doc.data().projectBanner,
            projectId: doc.data().projectId,
            projectCategories: doc.data().projectCategories,
            projectMembers: doc.data().projectMembers,
            userPhotoURL: photoURL,
            uid: doc.data().uid,
            likes: doc.data().likes,
            comments: [
              {
                commentName: '',
                comment: ''
              }
            ]
          };

          if (userid) {
            if (theuserid === userid) {
              posts.push(projectObject);
            }
          } else {
            posts.push(projectObject);
          }
        }
      } else {
        const postId = doc.data().postId;
        const date = doc.data().date;
        const timestamp = ((doc.data().timeStamp) as unknown as Timestamp).toDate();
        let theuserid = doc.data().uid;
        let username = doc.data().displayName;
        let photoURL = '';
        let postText = doc.data().post;
        let typeImage = '../../../assets/icons/em.svg';

        if (doc.data().postType === 'project') {
          theuserid = doc.data().uid;
          username = '';
          photoURL = '';
          postText = doc.data().projectDescription;
          typeImage = '../../../assets/icons/project.svg';
        }

        if (doc.data().postType === 'question') {
          typeImage = '../../../assets/icons/q2.svg';
        }
        const userDoc = await this.authService.afs.collection('users').doc(theuserid).get().toPromise();

        if (userDoc.data()) {
          const myuser = userDoc.data();
          photoURL = myuser.photoURL;
          username = myuser.displayName ? myuser.displayName : myuser.lastname + ' ' + myuser.firstname;
        }

        const projectObject = {
          type: doc.data().postType,
          typeImage,
          postDate: date,
          postText,
          timestamp,
          postId: doc.data().postId,
          displayName: username ? username : 'Anonym',
          projectName: doc.data().projectName,
          projectBanner: doc.data().projectBanner,
          projectId: doc.data().projectId,
          projectCategories: doc.data().projectCategories,
          projectMembers: doc.data().projectMembers,
          userPhotoURL: photoURL,
          uid: doc.data().uid,
          likes: doc.data().likes,
          comments: [
            {
              commentName: '',
              comment: ''
            }
          ]
        };

        if (userid) {
          if (theuserid === userid) {
            posts.push(projectObject);
          }
        } else {
          posts.push(projectObject);
        }
      }
    }
    return posts;
  }

  setViewed(postID: string, creatorID: string) {
    firebase.firestore().collection('users').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().hasOwnProperty('uid')) {
          if (doc.data().uid === creatorID) {
            firebase.firestore().collection(`users`).doc(doc.data().uid).collection('viewed').doc(postID).set({
              postId: postID,
              viewedTime: firebase.firestore.Timestamp.now()
            }, {merge: true}).then(r => {
            });
          }
        }
      });
    });
  }
}
