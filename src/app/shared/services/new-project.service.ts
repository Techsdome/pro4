import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Project} from '../../models/Project';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'   // available to dependency injection, register to a provider
})
export class NewProjectService {
  public project: Observable<Project[]>;
  public ref: any;

  constructor(public afs: AngularFirestore, public authService: AuthService) {
    // this.projectItem = this.afs.collection('project').valueChanges();
  }

  getPItems() {
    return this.project;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }


  addData(id, pname, pdescription, pcategories, members, photoURL: string) {
    this.afs.collection('project').add({
      uid: id,
      projectName: pname,
      projectDescription: pdescription,
      projectCategories: pcategories,
      projectMembers: members,
      projectPhotoURL: photoURL ? photoURL : ' '
    }).then(docRef => {
      this.afs.doc(`users/${this.authService.userData.uid}`).update({
        // pid: firebase.firestore.FieldValue.arrayUnion(projectId)
        pid: docRef.id,
      });
      console.log('id: ' + docRef.id);
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
