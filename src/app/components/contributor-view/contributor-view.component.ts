import {Component, Input, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../shared/services/auth.service';
import {DataServiceService} from '../../shared/services/data-service.service';
import {User} from "../../shared/services/user";

@Component({
  selector: 'app-contributor-view',
  templateUrl: './contributor-view.component.html',
  styleUrls: ['./contributor-view.component.css']
})
export class ContributorViewComponent implements OnInit {

  @Input() projectID;
  docRef: any;
  projectPromise: any;
  project: any;
  tmpAllContributors: User[] = [];
  tmpAllContributorsUid = [];

  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService,
              public userSerive: DataServiceService) { }

  ngOnInit(): void {
    this.docRef = this.afs.doc(`mainFeed/allPosts/post/${this.projectID}`);
    if (this.docRef) {
      return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
        if (doc.exists) {
          this.project = doc.data();
          this.tmpAllContributorsUid = this.project.projectMembers;

          for (const userId of this.tmpAllContributorsUid) {
            const user = await this.userSerive.getUserWithUid(userId);
            this.tmpAllContributors.push(user);
          }

          /*if (this.project.projectBanner) {
            this.bannerURL = this.project.projectBanner;
            this.loadBannerPicture();
          }*/

        } else {
          console.log('No such document!');

        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }
  }

}
