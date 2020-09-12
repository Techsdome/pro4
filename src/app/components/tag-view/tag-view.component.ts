import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.css']
})
export class TagViewComponent implements OnInit {

  @Input() mode;
  @Input() projectOrUserID;
  docRef: any;
  projectPromise: any;
  project: any;
  tags = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    if ( this.mode === 'user') {
      this.docRef = this.afs.doc(`users/${this.projectOrUserID}`);
      if (this.docRef) {
        return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
          if (doc.exists) {
            this.tags = doc.data().skills;
          } else {
            console.log('No such document!');
          }
        }).catch(error => {
          console.log('Error getting document:', error);
        });
      }
    } else {
      this.docRef = this.afs.doc(`mainFeed/allPosts/post/${this.projectOrUserID}`);

      if (this.docRef) {
        return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
          if (doc.exists) {
            this.project = doc.data();
            if (doc.data().hasOwnProperty('projectCategories')) {
              this.tags = this.project.projectCategories;
            } else {
              this.tags = this.project.tags;
            }
          } else {
            console.log('No such document!');

          }
        }).catch(error => {
          console.log('Error getting document:', error);
        });
      }
    }

  }
}
