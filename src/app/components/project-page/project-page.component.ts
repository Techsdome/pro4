import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {Router, NavigationStart, NavigationCancel, NavigationEnd} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

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
  myPID = history.state.data;


  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    if(this.myPID) {
      this.loadProject();
    } else {
      this.getProject();
    }
  }

  getUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  loadProject() {
    this.docRef = this.afs.doc(`project/${this.myPID}`);
    if (this.docRef) {
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
    }
  }

  getProject() {
    this.authService.getCurrentUser().subscribe(uval => {
      this.authService.afs.collection('users').doc(uval.uid)
        .valueChanges()
        .subscribe((val) => {
          const us = val as User;
          if (us) {
            if (us.pid) {
              const i = us.pid.length;
              this.projectID = us.pid[i - 1];

              this.docRef = this.afs.doc(`project/${this.projectID}`);
              if (this.docRef) {
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
              } else {
                console.log('No document!');
              }
            } else {
              console.log('No pid!');
            }
          } else {
            console.log('No User!');
          }
        });
    });
  }

}
