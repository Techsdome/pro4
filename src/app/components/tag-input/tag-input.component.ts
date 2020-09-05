import {Component, Input, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css']
})
export class TagInputComponent implements OnInit {

  selectableTag = true;
  removableTag = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedCategories = [];
  @Input() projectID;
  project: any;
  docRef: any;
  projectPromise: any;


  constructor(public afs: AngularFirestore) { }

  ngOnInit(): void {
   /* this.docRef = this.afs.doc(`mainFeed/allPosts/post/${this.projectID}`);
    if (this.docRef) {
      return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
        if (doc.exists) {
          this.project = doc.data();
          this.selectedCategories = this.project.projectCategories;
        } else {
          console.log('No such document!');

        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }*/
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.selectedCategories.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedCategories.indexOf(tag);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
  }

}
