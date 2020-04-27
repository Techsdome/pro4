import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page-2.component.html',
  // styleUrls: ['./project-page.component.css']
  styleUrls: ['./assets/css/styles.css']
})
export class ProjectPageComponent implements OnInit {

  projectID: any;
  project: Project;
  docRef: any;
  user: User;
  images: string[];


  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService ) {
  }

  ngOnInit() {
    this.getProject();
  }

  getUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  getProject() {
    this.authService.getCurrentUser().subscribe(uval => {
      this.authService.afs.collection('users').doc(uval.uid)
        .valueChanges()
        .subscribe((val) => {
          const us = val as User;
          const i = us.pid.length;
          this.projectID = us.pid[i - 1];

          this.docRef = this.afs.doc(`project/${this.projectID}`);
          this.docRef.get().toPromise().then(doc => {
            if (doc.exists) {
              this.project = doc.data();
              this.images = this.project.projectImages;
            } else {
              console.log('No such document!');
            }
          }).catch(error => {
            console.log('Error getting document:', error);
          });
        });
    });
  }


}
