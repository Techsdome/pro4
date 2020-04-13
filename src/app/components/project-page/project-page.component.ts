import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {User} from "../../shared/services/user";

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

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.getUserID();

  }

  getUser() {
    console.log('getuser');
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log("1 " + this.user.pid);
    });

    console.log("2 " + this.user.pid);
  }

  getUserID() {
    console.log('init');
    // const data = this.authService.getUserData();
    // const data2 = this.authService.userData.pid;
    this.getUser();

    this.docRef = this.afs.doc(`project/${this.user.pid}`);

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
