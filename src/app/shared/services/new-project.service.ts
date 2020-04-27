import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Project} from '../../models/Project';
import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'   // available to dependency injection, register to a provider
})
export class NewProjectService {
  public project: Observable<Project[]>;
  public ref: any;
  projectID: string;

  constructor(public afs: AngularFirestore, public authService: AuthService) {
    // this.projectItem = this.afs.collection('project').valueChanges();
  }

  getPItems() {
    return this.project;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }


  addData(id, pname, pdescription, pcategories, bannerURL, imageURL, members) {
    this.afs.collection('project').add({
      uid: id,
      projectName: pname ? pname : 'Project Alpha',
      projectDescription: pdescription ? pdescription : 'This is my description',
      projectCategories: pcategories ? pcategories : ['Default', 'Default2'],
      projectMembers: members ? members : ['Markus', 'Damir', 'Andrea'],
      projectBanner: bannerURL ? bannerURL : './assets/Project/20180726_Budapest_23.jpg',
      projectImages: imageURL ? imageURL : './assets/Project/IMG-20181025-WA0016.jpg',
      projectTimeStamp: firebase.firestore.Timestamp.now()
    }).then(docRef => {
      this.afs.doc(`project/${docRef.id}`).update({
        projectId: docRef.id,
      });
      this.afs.doc(`users/${this.authService.userData.uid}`).update({
        // pid: docRef.id,
        pid: FieldValue.arrayUnion(docRef.id)
      });
      this.projectID = docRef.id;
    }).catch(error => {

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
