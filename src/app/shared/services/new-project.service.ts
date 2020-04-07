import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'   // available to dependency injection, register to a provider
})
export class NewProjectService {




  constructor(public afs: AngularFirestore) {

  }


}
