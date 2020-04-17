import { Component, OnInit } from '@angular/core';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {DataServiceService} from '../../shared/services/data-service.service';

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

  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService, public dataService: DataServiceService) {
  }

  ngOnInit() {
    this.getUserID();
  }

  getUserID() {

    console.log(this.authService.userData.pid);
    this.docRef = this.afs.doc(`project/${this.authService.userData.pid}`);

    this.docRef.get().toPromise().then(doc => {
      if (doc.exists) {
        this.project = doc.data();
        console.log('Document data:', doc.data());
      } else {
        console.log('No such document!');
      }
    }).catch(error => {
      console.log('Error getting document:', error);
    });
  }
}
