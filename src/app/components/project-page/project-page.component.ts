import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {UploadTaskComponent} from "../uploader/upload-task/upload-task.component";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page-2.component.html',
  // styleUrls: ['./project-page.component.css']
  styleUrls: ['./assets/css/styles.css']
})
export class ProjectPageComponent implements OnInit {

  projectID: any;
  project: Project;
  docRef: any;
  user: User;
  images: string[];
  myPID = history.state.data;
  isOwner: boolean;
  projectPromise: Promise<any>;
  editMode = false;

  tmpMemberName = '';
  tmpAllContributors = [];
  tmpAddedContributors = [];
  tmpDeletedContributors = [];
  memberChange = false;

  pictureChange = false;
  tmpChangedValues = [];

  tmpAllImages: string[];
  tmpAddedImages: File[];
  tmpDeletedImages = [];

  tmpName = '';
  tmpDescription = '';

  tmpTags = [];


  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService, public uploadTask: UploadTaskComponent) {
  }

  async ngOnInit() {
    this.getUser();
    if (this.myPID) {
      await this.loadProject();
    } else {
      await this.getProject();
    }
  }

  editProject() {
    this.editMode = true;
  }

  pushValue(mykey, myvalue) {
    this.tmpChangedValues.push({key: mykey, value: myvalue});
  }

  discardChanges() {
    this.editMode = false;
    this.loadProject();
  }

  saveChanges() {
    this.editMode = false;
    const data = {};
    let i = 0;
    this.tmpChangedValues.forEach((item) => {
      if (item.value != null) {
        data[item.key] = item.value;
        i++;
      }
    });

    if (this.pictureChange) {
      this.tmpAddedImages.forEach(async (file) => {
        this.uploadTask.projectID = this.projectID;
        this.uploadTask.file = file;
        await this.uploadTask.startUpload();
        this.tmpAllImages.push(await this.uploadTask.downloadURL);
      });

      data['projectImages'] = this.tmpAllImages;

      for (const img of this.tmpDeletedImages) {
        this.storage.storage.refFromURL(img).delete();
      }

      this.storage.storage.ref(`project/${this.user.uid}/${this.projectID}/tmp`).delete();
    }

    if (this.memberChange) {
      data['projectMembers'] = this.tmpAllContributors;
    }

    this.afs.doc(`project/${this.projectID}`).update(data).then(() => {
      this.loadProject();
    });
  }

  removePicture(index) {
    this.tmpAllImages.forEach((pic, i) => {
      if (i === index) {
        this.tmpAllImages.splice(index, 1);
        this.tmpDeletedImages.push(pic);
        this.pictureChange = true;
      }
    });
  }

  removeMember(index) {
    this.tmpAllImages.forEach((mem, i) => {
      if (i === index) {
        this.tmpAllContributors.splice(index, 1);
        this.tmpDeletedContributors.push(mem);
        this.memberChange = true;
      }
    });
  }

  addMember(value) {
    this.tmpAddedContributors.push(value);
    this.tmpAllContributors.push(value);
    this.tmpMemberName = '';
    this.memberChange = true;
  }

  isUserOwner() {
    this.authService.getCurrentUser().subscribe(async (user) => {
      this.user = user;
      await this.projectPromise;
      this.isOwner = this.user.uid === this.project.uid;
    });
  }

  getUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  loadProject() {
    if (this.projectID) {
      this.myPID = this.projectID;
    }
    this.docRef = this.afs.doc(`project/${this.myPID}`);
    if (this.docRef) {
      this.projectPromise = this.docRef.get().toPromise().then(doc => {
        if (doc.exists) {
          this.project = doc.data();
          this.tmpAllImages = this.project.projectImages;
          this.tmpAllContributors = this.project.projectMembers;
          this.isUserOwner();
        } else {
          console.log('No such document!');
        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }
  }

  getProject() {
    this.authService.getCurrentUser().subscribe(uval => {
      this.authService.afs.collection('users').doc(uval.uid)
        .valueChanges()
        .subscribe((val) => {
          const us = val as User;
          if (us) {
            if (us.pid) {
              const i = us.pid.length;
              this.projectID = us.pid[i - 1];

              this.docRef = this.afs.doc(`project/${this.projectID}`);
              if (this.docRef) {
                this.projectPromise = this.docRef.get().toPromise().then((doc) => {
                  if (doc.exists) {
                    this.project = doc.data();
                    this.tmpAllImages = this.project.projectImages;
                    this.tmpAllContributors = this.project.projectMembers;
                    this.isUserOwner();
                  } else {
                    console.log('No such document!');
                  }
                }).catch(error => {
                  console.log('Error getting document:', error);
                });
              } else {
                console.log('No document!');
              }
            } else {
              console.log('No pid!');
            }
          } else {
            console.log('No User!');
          }
        });
    });
  }
}
