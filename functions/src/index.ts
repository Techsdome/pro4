// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);


exports.updateIndex = functions.firestore
  .document('users/{userId}')
  .onCreate( (snap, context) => {
    const userId = snap.id;
    const user = snap.data();

    // @ts-ignore
    const searchableIndex = createIndex(user.displayName)

    const indexedUser = {...user, searchableIndex}
    const db = admin.firestore()

    return db.collection('users').doc(userId).set(indexedUser, { merge: true })
  })

function createIndex(displayName: string) {
    const arr = displayName.toLowerCase().split('');
    const searchableIndex = {}

    let prevKey = '';

    for (const char of arr) {
      const key = prevKey + char;
      // @ts-ignore
      searchableIndex[key] = true
      prevKey = key
  }
    return searchableIndex
}



