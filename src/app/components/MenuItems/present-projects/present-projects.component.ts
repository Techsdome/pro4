import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/services/user';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-present-projects',
  templateUrl: './present-projects.component.html',
  styleUrls: ['./present-projects.component.css']
})
export class PresentProjectsComponent implements OnInit {
  projects: any[] = [];
  user: User;
  loading = true;

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
            myuser.pid.forEach((projectID) => {
              this.authService.afs.collection('mainFeed').doc('allPosts').collection('post').valueChanges().subscribe((doc) => {
                doc.forEach((posts) => {
                  if (posts.postId === projectID) {
                    this.projects.push({
                      postText: posts.postText,
                      postId: posts.postId,
                      projectName: posts.projectName,
                      projectBanner: posts.projectBanner
                    });
                  }
                });
              });
            });
          }
          this.loading = false;
        });
    });
  }
}
