import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {NewProjectService} from '../../shared/services/new-project.service';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit {

  user: User;
  @Input() itemsList = [];
  @Input() show: boolean;
  @Output() childMessage = new EventEmitter<string[]>();
  @Output() purposeMessage = new EventEmitter<string>();
  @Input() headline: string;
  @Input() purpose: string;
  @Input() placeholder: string;
  item: string;
  edit = false;
  htmlItemsElements: HTMLCollection;
  path: string;

  constructor(private dataService: DataServiceService, private authService: AuthService, private pservice: NewProjectService) {
  }

  ngOnInit(): void {
    this.htmlItemsElements = (document.getElementsByClassName('itemDeleteButton') as HTMLCollection);
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    if (this.show === undefined || this.show === null) {
      this.show = true;
    }
  }

  sendToParent() {
    this.purposeMessage.emit(this.purpose);
    this.childMessage.emit(this.itemsList);
  }

  letFocus() {
    document.getElementsByClassName('#itemInput');
    // .trigger('focus');
  }

  editToggle() {
    this.edit = !this.edit;
  }

  saveItem() {
    if (this.item) {
      this.itemsList.push(this.item);
      if (this.edit) {
        this.edit = !this.edit;
      }
    }
    this.item = '';

    // this.update();
  }

  // updateSkillsFirebase() {
  //   this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
  //     skills: [] = this.items ? this.items : this.itemsList
  //   });
  // }

  updateTagsFirebase() {
    this.authService.afs.collection('project').doc(this.pservice.projectID).update({
      tags: [] = this.itemsList
    });
  }

  update() {
    if (this.purpose === 'tags') {
      this.updateTagsFirebase();
    } else if (this.purpose === 'skills') {
      // this.updateSkillsFirebase();
    } else {
      console.log('No purpose found!');
    }
  }

  deleteItemElement(event) {
    for (let i = 0; i < this.itemsList.length; i++) {
      if (this.itemsList[i] === event.target.previousElementSibling.value) {
        this.itemsList.splice(i, 1);
      }
    }
    this.update();
  }
}
