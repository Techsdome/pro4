import {Component, OnInit} from '@angular/core';
import {User} from '../../shared/services/user';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../shared/services/auth.service';
import {Project} from '../../models/Project';

@Component({
  selector: 'app-present-projects',
  templateUrl: './present-projects.component.html',
  styleUrls: ['./present-projects.component.css']
})
export class PresentProjectsComponent implements OnInit {
  projects: any[] = [];
  user: User;

  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.authService.afs.collection('users').doc(user.uid)
        .valueChanges()
        .subscribe((val) => {
            const myuser = val as User;
            if (myuser.pid) {
              myuser.pid.forEach((p) => {
                this.authService.afs.collection('project').doc(p).valueChanges()
                  .subscribe(data => {
                    const pdata = data as Project;
                    const projectObject = {
                      projectName: pdata.projectName,
                      projectBanner: pdata.projectBanner,
                      projectId: pdata.projectId
                    };
                    this.projects.push(projectObject);
                  });
              });
            }
        });
    });
  }
}
