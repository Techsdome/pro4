import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {Project} from '../../models/Project';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {UploadTaskComponent} from '../uploader/upload-task/upload-task.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageModalComponent} from '../image-modal/image-modal.component';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page-2.component.html',
  styleUrls: ['./assets/css/styles.css']
})
export class ProjectPageComponent implements OnInit {

  constructor(public storage: AngularFireStorage, public afs: AngularFirestore,
              public authService: AuthService, public uploadTask: UploadTaskComponent, private modalService: NgbModal,
              public userSerive: DataServiceService) {
  }

  // general stuff
  projectID = history.state.data;

  project: Project;
  docRef: any;
  user: User;
  isOwner: boolean;
  projectPromise: Promise<any>;
  editMode = false;
  loading = false;

  // banner stuff
  bannerChange = false; // has banner been changed?
  tmpBannerFile: File; // tmp new banner upload
  bannerURL: string; // banner download URL
  tmpBannerFileURL: string; // tmp new banner URL
  tmpBannerPosition: string; // tmp new banner position
  start_y: number;
  mouseDown = false;
  bannerHeight: number;
  tmpBannerHeight: number;
  bannerWidth: number;
  tmpBannerWidth: number;

  // member stuff
  tmpMemberName = '';
  tmpAllContributors: User[] = [];

  tmpAllContributorsUid = [];
  tmpAddedContributors = [];
  tmpDeletedContributors = [];
  memberChange = false;

  // title and description
  tmpChangedValues = [];
  tmpName = '';
  tmpDescription = '';
  tmpTags = [];

  // picture stuff
  pictureChange = false; // has pictures been changed?
  tmpAllImages: string[] = []; // all images, already existent and new tmp ones, minus deleted ones
  tmpAddedImages: File[] = []; // tmp added files
  tmpDeletedImages = []; // tmp deleted files
  originalImages: string[]; // all originally images

  currentBannerPosition: string;

  // switch between components
  switchComp = true;

  // discussion section
  comments: any[] = [];
  edit = false;
  comment: string;
  showCommentSection = false;
  commentsLenght: number;
  posts: any[] = [];

  async ngOnInit() {
    this.getUser();

    if (this.projectID) {
      localStorage.setItem('projectID', this.projectID);
    } else if (localStorage.getItem('projectID')) {
      this.projectID = localStorage.getItem('projectID');
    } else {
      alert('No Project found!');
    }

    await this.loadProject();



    if (this.projectID) {
      this.authService.afs.collection(`mainFeed/allPosts/post/${this.projectID}/comments`).valueChanges()
        .subscribe((comment) => {
          this.commentsLenght = comment.length;
          comment.forEach(cmt => {
            this.comments.push(cmt);
          });
        });
    }
  }

  // adds comment
  addComment() {
    this.authService.getCurrentUser().subscribe((result) => {
      this.authService.afs.collection('users').doc(result.uid).valueChanges()
        .subscribe((val: any) => {
          if (this.comment) {
            this.authService.afs.doc(`mainFeed/allPosts/post/${this.projectID}`).collection('comments').add({
              comment: this.comment,
              commentName: val.firstname + ' ' + val.lastname
            });
            this.comment = '';
          }
        });
    });
  }

  // opens disscusion component
  openDisscusion() {
    if (!this.switchComp) {
      this.switchComp = true;
    }
  }

  // opens discription component
  openDiscription() {
    if (this.switchComp) {
      this.switchComp = false;
    }
  }

  // edit mode
  editProject() {
    this.editMode = true;
  }

  // title and description
  pushValue(mykey, myvalue) {
    this.tmpChangedValues.push({key: mykey, value: myvalue});
  }

  // all changes are deleted
  discardChanges() {
    this.editMode = false;
    this.removeListener();
    this.loadProject();
  }

  // tmp banner picture is displayed
  async getBannerFile(message: any) {
    this.tmpBannerFile = message;
    this.tmpBannerFileURL = (await this.readFilesURL(this.tmpBannerFile)) as string;
    this.tmpBannerPosition = '0';
    document.getElementById('banner-picture').style.backgroundImage = `url(${this.tmpBannerFileURL})`;
    document.getElementById('banner-picture').style.backgroundPositionY = `${this.tmpBannerPosition}px`;

    this.bannerChange = true;
    this.addListener();
  }

  // reads tmp URL from uploaded file
  readFilesURL(file: File) {
    let tmpURL;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      tmpURL = e.target.result;

      const img = new Image();
      img.onload = () => {
        this.tmpBannerHeight = img.height;
        this.tmpBannerWidth = img.width;
      };
      img.src = (reader.result) as string;
    };

    return new Promise(resolve => {
      setTimeout(() => {
          if (tmpURL) {
            resolve(tmpURL);
          }
        }
        , 2000);
    });
  }

  // tmp uploaded images are displayed
  getImagesFiles(message: any) {
    message.forEach(async (file) => {
      //console.log(file);
      const fileURL = await this.readFilesURL(file);
      this.tmpAllImages.push((fileURL) as string);
      this.tmpAddedImages.push(file);
    });
    this.pictureChange = true;
  }

  // adds Listener to the document, to reposition the banner picture
  addListener() {
    document.getElementById('banner-picture').addEventListener('mousedown', this.mouseDownHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
    document.getElementById('banner-picture').addEventListener('mouseenter', this.mouseEnterHandler);
    document.getElementById('banner-picture').addEventListener('mousemove', this.mouseMoveHandler);
  }

  // removes the Listeners, to prevent repositioning of the banner picture
  removeListener() {
    document.getElementById('banner-picture').removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
    document.getElementById('banner-picture').removeEventListener('mouseenter', this.mouseEnterHandler);
    document.getElementById('banner-picture').removeEventListener('mousemove', this.mouseMoveHandler);
  }

  // saves all changes
  async saveChanges() {
    this.editMode = false;
    this.loading = true;
    this.removeListener();
    const data = {};
    let i = 0;

    this.pushValue('bannerPositionY', this.tmpBannerPosition);

    this.tmpChangedValues.forEach((item) => {
      if (item.value != null) {
        data[item.key] = item.value;
        i++;
      }
    });

    const date = new Date();
    const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;

    if (this.bannerChange) { // only if banner has been changed
      const pathBanner = `project/${this.user.uid}/${this.projectID}/banner/${today}_${this.tmpBannerFile.name}`;

      this.uploadTask.setProjectID(this.projectID);
      this.uploadTask.setFileToUpload(this.tmpBannerFile);
      this.uploadTask.setPath(pathBanner);

      await this.uploadTask.startUpload(); // uploads the file to the given path
      this.tmpBannerFileURL = await this.uploadTask.downloadURL; // returns files download url
      const tmpBannerRef = this.storage.storage.refFromURL(this.tmpBannerFileURL).toString();

      data['projectBanner'] = this.tmpBannerFileURL; // saves download URL in data object

      const bannerMetadata = {
        customMetadata: {
          width: this.tmpBannerWidth.toString(),
          height: this.tmpBannerHeight.toString()
        }
      };

      await this.storage.storage.ref(pathBanner).updateMetadata(bannerMetadata);

      if (this.bannerURL) { // if the banner was set from the beginning
        await this.storage.storage.refFromURL(this.bannerURL).listAll().then(async () => {
          await this.storage.storage.refFromURL(this.bannerURL).delete(); // remove the previous banner
        }).catch(() => {
          console.log('No bannerfile to delete');
        });
      }
    }

    if (this.pictureChange) {
      if (this.tmpAddedImages.length > 0) { // if images were added
        for (const file of this.tmpAddedImages) {
          let url;
          const p = new Promise((resolve, reject) => {
            this.uploadTask.setProjectID(this.projectID);
            this.uploadTask.setPath(`project/${this.user.uid}/${this.projectID}/images/${today}_${file.name}`);
            this.uploadTask.setFileToUpload(file); // images folder
            this.uploadTask.startUpload().then(async () => { // uploads file
              url = await this.uploadTask.downloadURL;
              this.originalImages.push(url);
              //console.log(url);
            }).then(() => {
              if (url) {
                resolve(url);
              } else {
                reject(url);
              }
            });
          });
          await p;
        }
      }

      if (this.tmpDeletedImages.length > 0) { // if images were deleted
        this.originalImages.forEach((allPictures, index) => {
          this.tmpDeletedImages.forEach(async (deletedPictures, index2) => {
            if (allPictures === deletedPictures) {
              this.originalImages.splice(index, 1);
              if (this.storage.storage.refFromURL(deletedPictures)) {
                await this.storage.storage.refFromURL(deletedPictures).delete(); // delete the image from the storage
              }
            }
          });
        });
      }

      data['projectImages'] = this.originalImages; // all new pictures, minus the deleted ones are saved
    }

    if (this.memberChange) {
      data['projectMembers'] = this.tmpAllContributorsUid;
    }

    this.afs.doc('mainFeed/allPosts').collection('post').doc(this.projectID).update(data).then(() => {
      this.loading = false;

      this.loadProject();
    });
  }

// adds the listener for the banner picture
  repositionBanner() {
    this.addListener();
  }

// removes the pictures from the picture array
  removePicture(index) {
    this.tmpAllImages.forEach((pic, i) => {
      if (i === index) {
        this.tmpAllImages.splice(index, 1);
        this.tmpDeletedImages.push(pic);
        this.pictureChange = true;
      }
    });
  }

// removes a member
  removeMember(index) {
    this.tmpAllContributors.forEach((mem, i) => {
      if (i === index) {
        this.tmpAllContributors.splice(index, 1);
        this.tmpAllContributorsUid.splice(index, 1);
        this.tmpDeletedContributors.push(mem.displayName);
        this.memberChange = true;
        console.log(this.tmpAllContributorsUid);
      }
    });
  }

// adds a member
  addMember(value) {
    this.tmpAddedContributors.push(value);
    this.tmpAllContributors.push(value);
    this.tmpMemberName = '';
    this.memberChange = true;
    console.log('tmpAllCon: ' + this.tmpAddedContributors);
    console.log('tmpAllConUid: ' + this.tmpAllContributorsUid);
    console.log('deletedCon: ' + this.tmpDeletedContributors);

  }

// checks if the user viewing the page is the owner
  isUserOwner() {
    this.authService.getCurrentUser().subscribe(async (user) => {
        this.user = user;
        await this.projectPromise;
        this.isOwner = this.user.uid === this.project.uid;
      }
    );
  }

// gets user
  getUser() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

// opens image viewer
  openImage(pictureURL) {
    const modalRef = this.modalService.open(ImageModalComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'modal-customclass'
    });
    modalRef.componentInstance.src = pictureURL;
  }

// loads project with an id
  loadProject() {
    this.docRef = this.afs.doc(`mainFeed/allPosts/post/${this.projectID}`);
    if (this.docRef) {
      return this.projectPromise = this.docRef.get().toPromise().then(async doc => {
        if (doc.exists) {
          this.project = doc.data();
          console.log(this.project);
          this.tmpBannerPosition = doc.data().bannerPositionY;
          this.originalImages = this.project.projectImages ? this.project.projectImages : [];

          this.originalImages.forEach((fileURL, index) => {
            this.tmpAllImages[index] = this.originalImages[index];
          });

          this.tmpDescription = this.project.projectDescription;
          this.tmpAllContributorsUid = this.project.projectMembers;

          for (const userId of this.tmpAllContributorsUid) {
            const user = await this.userSerive.getUserWithUid(userId);
            this.tmpAllContributors.push(user);
          }

          console.log(this.project.projectBanner);
          if (this.project.projectBanner) {
            this.bannerURL = this.project.projectBanner;
            await this.loadBannerPicture();
          }

          this.isUserOwner();
        } else {
          console.log('No such document!');

        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }
  }

// the event handlers
  mouseDownHandler = () => {
    this.mouseDown = true;
  }

  mouseUpHandler = () => {
    this.mouseDown = false;

    if (this.currentBannerPosition) {
      document.getElementById('banner-picture').style.backgroundPositionY = this.currentBannerPosition;
    }
  }

  mouseEnterHandler = (e) => {
    this.start_y = e.clientY;
  }

  mouseMoveHandler = (e) => {
    const newPos = e.clientY - this.start_y;
    this.start_y = e.clientY;

    let result;

    if (this.mouseDown) {
      const posY = document.getElementById('banner-picture').style.backgroundPositionY;

      if (posY) {
        const reg = new RegExp('px');
        result = (parseInt(posY.replace(reg, ''), 10) + newPos).toString();

        if (result > 0) {
          result = 0;
        } else if (result < ((this.tmpBannerHeight - 1240) * (-1))) {
          result = ((this.tmpBannerHeight - 1240) * (-1));
          console.log(result);
        }

        document.getElementById('banner-picture').style.backgroundPositionY = result + 'px';

      } else {
        document.getElementById('banner-picture').style.backgroundPositionY = newPos.toString() + 'px';
      }
      this.tmpBannerPosition = result;
    }
  }

// sets the background image for the banner div
  async loadBannerPicture() {
    console.log('10 - inLoadBannerPicture: ' + this.bannerURL);
    if (this.bannerURL) {
      if (document.getElementById('banner-picture')) {
        document.getElementById('banner-picture').style.backgroundImage = `url(${this.bannerURL}`;

        const tmpBannerRef = this.storage.storage.refFromURL(this.bannerURL);
        tmpBannerRef.getMetadata().then((metadata) => {

          if (metadata.customMetadata) {
            this.bannerHeight = metadata.customMetadata.height;
            this.bannerWidth = metadata.customMetadata.width;

            this.tmpBannerHeight = this.bannerHeight;
            this.tmpBannerWidth = this.bannerWidth;
          }
        });

        if (this.tmpBannerPosition) {
          document.getElementById('banner-picture').style.backgroundPositionY = `${this.tmpBannerPosition}px`;
        }
      } else { // if URL is not available, try again in 2 seconds
        setTimeout(() => {
            this.loadBannerPicture();
          }, 2000
        );
      }
    }
  }
}
