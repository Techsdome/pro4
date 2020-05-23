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
  isOwner: boolean;
  projectPromise: Promise<any>;
  editMode = false;

  pictureChange = false;
  tmpChangedValues = [];
  tmpimages: string[];
  tmpName = '';
  tmpDescription = '';


  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService) {
  }

  async ngOnInit() {
    this.getUser();
    if (this.myPID) {
      await this.loadProject();
    } else {
      await this.getProject();
    }
  }

  editProject() {
    this.editMode = true;
  }

  pushValue(mykey, myvalue) {
    this.tmpChangedValues.push({key: mykey, value: myvalue});
  }

  saveChanges() {
    this.editMode = false;
    const data = {};
    let i = 0;
    this.tmpChangedValues.forEach( (item) => {
      if (item.value != null) {
        data[item.key] = item.value;
        i++;
      }
   });
    if (this.pictureChange) {
      data['projectImages'] = this.tmpimages;
    }
    this.afs.doc(`project/${this.projectID}`).update(data).then( () => {
      this.loadProject();
    });
  }

  removePicture(index) {
    this.tmpimages.forEach((pic, i) => {
      if (i === index) {
        this.tmpimages.splice(index, 1);
        this.pictureChange = true;
      }
    });
  }

  isUserOwner() {
    this.authService.getCurrentUser().subscribe(async (user) => {
      this.user = user;
      await this.projectPromise;
      this.isOwner = this.user.uid === this.project.uid;
    });
  }

  getUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  loadProject() {
    if (this.projectID) {
      this.myPID = this.projectID;
    }
    this.docRef = this.afs.doc(`project/${this.myPID}`);
    if (this.docRef) {
      this.projectPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          this.project = doc.data();
          this.tmpimages = this.project.projectImages;
          this.isUserOwner();
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
                this.projectPromise = this.docRef.get().toPromise().then((doc) => {
                  if (doc.exists) {
                    this.project = doc.data();
                    this.tmpimages = this.project.projectImages;
                    this.isUserOwner();
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
