import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {NewProjectService} from '../../shared/services/new-project.service';
import {User} from '../../shared/services/user';
import {FormsModule} from '@angular/forms';
import {AngularFireStorage} from 'angularfire2/storage';
import {FileUploader} from 'ng2-file-upload';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit {
  user: User;
  description: string;
  task: AngularFireUploadTask;
  taskPromises = [];

  showScreen = false;
  questionID: string;
  selectedCategories: string[];
  selectedMembers: string[];
  isPurpose: string;

  editorStyle = {
    justifyContent: 'center',
    alignContent: 'center',
    height: '200px',
    width: '100%',
    backgroundColor: 'white',
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'size'],
      ['blockquote', 'code-block', 'link'],
    ]
  };

  constructor(public authService: AuthService, public pservice: NewProjectService,
              public form: FormsModule, public activeModal: NgbActiveModal, private modalService: NgbModal,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.pservice.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  toggleScreen() {
    this.showScreen = !this.showScreen;
  }

  getChildMessage(message: any) {
    if (this.isPurpose === 'tags') {
      this.selectedCategories = message;
    }
  }

  getPurposeMessage(message: string) {
    this.isPurpose = message;
  }

  async Submit(name: string) {
    if (name && this.user) {


      // questions abspeichern
      // await this.pservice.addData(this.user.uid, name, this.description, this.selectedCategories, this.selectedMembers);

      (document.getElementById('myForm') as HTMLFormElement).reset();
      document.getElementById('fillCorrectly').style.display = 'none';
      // await Promise.all(this.taskPromises);
      this.activeModal.close();
    } else {
      document.getElementById('fillCorrectly').style.display = 'block';
    }
  }

}
