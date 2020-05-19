import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import * as firebase from 'firebase';
import {Project} from '../../models/Project';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-show-projects',
  templateUrl: './show-projects.component.html',
  styleUrls: ['./show-projects.component.css']
})
export class ShowProjectsComponent implements OnInit {

  user: any;
  projects: any[] = [];

  constructor(public authservice: AuthService) { }

  ngOnInit(): void {
      this.authservice.afs.collection('project').valueChanges()
        .subscribe((val) => {
          const parray = val as Project[];
          parray.forEach((value) => {
            const mytime = ((value.projectTimeStamp) as unknown as Timestamp).toDate();
            const theuserid = value.uid;
            let username = '';
            let photoURL = '';

            this.authservice.afs.collection('users').doc(theuserid).get().toPromise()
              .then((userdoc) => {
                if (userdoc.data()) {
                  const myuser = userdoc.data();
                  photoURL = myuser.photoURL;
                  username = myuser.displayName ? myuser.displayName : myuser.lastname +  ' ' + myuser.firstname;
                }
              })
              .then( () => {
                const projectObject = {
                  postDate: mytime,
                  postText: value.projectDescription,
                  postId: value.projectId,
                  displayName: username ? username : 'Anonym',
                  projectName: value.projectName,
                  projectBanner: value.projectBanner,
                  projectId: value.projectId,
                  projectCategories: value.projectCategories,
                  projectMembers: value.projectMembers,
                  userPhotoURL: photoURL
                };
                this.projects.push(projectObject);
              });
          });
        });
  }
}
