import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../models/Project';
import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'   // available to dependency injection, register to a provider
})
export class NewProjectService {
  public project: Observable<Project[]>;
  public ref: any;
  projectID: string;
  bannerURL: string;
  imageURL: string[];

  constructor(public afs: AngularFirestore, public authService: AuthService, private storage: AngularFireStorage) {
    // this.projectItem = this.afs.collection('project').valueChanges();
  }

  getProjectID() {
    return this.projectID;
  }

  getPItems() {
    return this.project;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  async addData(id, pname, pdescription, pcategories, members, bannerDefault, contributorPhotoURL): Promise<void> {
    let myuser: any;
    let username: string;

    const docID = this.afs.createId();
    this.projectID = docID;

    let tempPhotoUrl: string;
    const date: Date = new Date();
    if (this.authService.afAuth.auth.currentUser.photoURL === undefined ||
      this.authService.afAuth.auth.currentUser.photoURL === null) {
      tempPhotoUrl = 'https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png';
    } else {
      tempPhotoUrl = this.authService.afAuth.auth.currentUser.photoURL;
    }

    this.authService.getCurrentUser().subscribe((user) => {
      myuser = user;

      this.authService.afs.collection('users').doc(user.uid).valueChanges()
        .subscribe((val: any) => {
          username = val.displayName ? val.displayName : val.lastname + ' ' + val.firstname;

          this.authService.afs.doc('mainFeed/allPosts').collection('post').doc(this.projectID).set({
            post: pdescription ? pdescription : ' ',
            date: date.toLocaleString('en-GB'),
            day: date.getUTCDate(),
            month: (date.getUTCMonth() + 1),
            year: date.getUTCFullYear(),
            hour: date.getHours(),
            minutes: date.getMinutes(),
            second: date.getSeconds(),
            uid: id,
            likes: 0,
            photoURL: tempPhotoUrl,
            displayName: username ? username : 'Anonym',
            projectName: pname ? pname : 'Project Alpha',
            projectBanner: bannerDefault,
            projectImages: '',
            projectDescription: pdescription ? pdescription : ' ',
            projectCategories: pcategories ? pcategories : [],
            projectMembers: members ? members : [],
            projectMembersPhotoURL: contributorPhotoURL,
            timeStamp: firebase.firestore.Timestamp.now(),
            postId: docID,
            postType: 'project'
          }).then(() => {
            this.authService.afs.collection('users').doc(myuser.uid).update({
              pid: FieldValue.arrayUnion(this.projectID)
            });
          });
        });
    });
  }


  async getBannerDefault(): Promise<any> {
    return await this.storage.ref('project/Default_Banner/Default2.jpg').getDownloadURL().toPromise();
  }

  async uploadPictures(bannerURL: string, imageURL: string[]): Promise<any> {
    return this.authService.afs.doc(`mainFeed/allPosts/post/${this.projectID}`).get().toPromise().then((doc) => {
      if (doc.exists) {
        return this.authService.afs.doc(`mainFeed/allPosts/post/${this.projectID}`).update({
          projectBanner: bannerURL,
          projectImages: imageURL
        });
      }
    });
  }

  updateData(id: string, pname?: string, pdescription?: string, pcategories?: string[], pmembers?: string, photoURL?: string) {
    this.afs.collection(`project/${id}`).doc().update({
      projectName: pname ? pname : ' ',
      projectDescription: pdescription ? pdescription : ' ',
      projectCategories: pcategories ? pcategories : ' ',
      projectMembers: pmembers ? pmembers : ' ',
      projectPhotoURL: photoURL ? photoURL : ' '
    });
  }

}
