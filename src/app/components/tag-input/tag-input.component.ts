import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AngularFirestore} from '@angular/fire/firestore';
import {DataServiceService} from '../../shared/services/data-service.service';

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
  project: any;
  docRef: any;
  userPromise: Promise<any>;

  @Input() userID;
  @Output() tagsOut = new EventEmitter<string[]>();

  constructor(public afs: AngularFirestore, private userData: DataServiceService) { }

  ngOnInit(): void {
    this.docRef = this.afs.doc(`users/${this.userID}`);
    if (this.docRef) {
      this.userPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          this.selectedCategories = doc.data().skills;
        }
      });
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.selectedCategories.push(value);
      this.tagsOut.emit(this.selectedCategories);
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
    this.tagsOut.emit(this.selectedCategories);
  }

}
