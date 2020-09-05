import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.css']
})
export class TagViewComponent implements OnInit {

  @Input() projectID;
  docRef: any;
  projectPromise: any;
  project: any;
  tags = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.docRef = this.afs.doc(`mainFeed/allPosts/post/${this.projectID}`);
    if (this.docRef) {
      return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
        if (doc.exists) {
          this.project = doc.data();
          this.tags = this.project.projectCategories;
        } else {
          console.log('No such document!');

        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }
  }
}
