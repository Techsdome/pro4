import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {NewProjectService} from '../../shared/services/new-project.service';
import {User} from '../../shared/services/user';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {UploadTaskComponent} from '../uploader/upload-task/upload-task.component';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})

export class NewProjectComponent implements OnInit {
  user: User;
  categories = ['Webdevelopment', 'Software', 'Hardware', 'Animation', 'Game programming'];
  selectedCategories = [];
  downloadURL: any;
  uploadProgress: any;
  task: any;

  constructor(public authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule, private afStorage: AngularFireStorage,
              public pUpload: UploadTaskComponent) {
  }

  // upload(event) {
  //   this.task = this.afStorage.upload('projects/' + this.user.uid, event.target.files[0]);
  //   this.uploadProgress = this.task.percentageChanges();
  //   this.downloadURL = this.task.getDownloadURL();
  //
  //  // this.authService.collection('files').add( { downloadURL: this.downloadURL, path });
  // }

  ngOnInit() {
    this.pservice.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    // this.downloadURL = this.afStorage.ref('projects/' + this.user.uid).getDownloadURL();
  }

  addCategory() {
    let x = (document.getElementById('pcategories') as HTMLFormElement).selectedIndex;
    let alreadyInserted = false;

    for (let i = 0; i < this.categories.length; i++) {
      if (i === x) {
        for (let j = 0; j < this.selectedCategories.length; j++) {
          if (this.categories[i] === this.selectedCategories[j]) {
            alreadyInserted = true;
          }
        }
        if (!alreadyInserted) {
          this.selectedCategories.push(this.categories[i]);
          console.log(this.selectedCategories);
        }
      }
    }
  }

  Submit(name: string, description: string, members: string) {
    if (name && description && this.user) {
      this.pservice.addData(this.user.uid, name, description, this.selectedCategories, members, this.pUpload.getDownloadURL());
      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';
    } else {
      document.getElementById('fillCorrectly').style.display = 'block';
    }
  }
}
