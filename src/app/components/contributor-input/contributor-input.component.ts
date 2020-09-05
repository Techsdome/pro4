import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormsModule} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {filter, switchMap} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-contributor-input',
  templateUrl: './contributor-input.component.html',
  styleUrls: ['./contributor-input.component.css']
})
export class ContributorInputComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  myControl = new FormControl();
  results: Observable<any[]>;
  offset = new Subject<string>();
  selectable = true;
  removable = true;

  contributors = [];
  contributorUid = [];
  isShow = false;

  @ViewChild('contributorInput') contributorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ngOnInit(): void {
    this.results = this.search();
  }

  onkeyup(e) {
    this.offset.next(e.target.value.toLowerCase());
  }

  /**
   * Search member in database field 'searchableIndex' - returns 5 entries
   */
  search() {
    return this.offset.pipe(
      filter(val => !!val),
      switchMap(offset => {
        return this.afs.collection('users', ref =>
          ref.orderBy(`searchableIndex.${offset}`).limit(5)
        ).valueChanges();
      })
    );
  }


  /**
   * Add contributor
   * @param event - added contributor value of input
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.myControl.setValue(null);
  }

  /**
   * Remove contributor of arrays
   * @param contributor - name of contributor to remove
   */
  remove(contributor: string): void {
    const index = this.contributors.indexOf(contributor);

    if (index >= 0) {
      this.contributors.splice(index, 1);
      this.contributorUid.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.contributors.includes(event.option.value)) {
      this.contributors.push(event.option.value);
    }
    this.contributorInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  addContributorUid(uid: string) {
    if (!this.contributorUid.includes(uid)) {
      this.contributorUid.push(uid);
    }
  }

}
