import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


// ***********IMPORTANT***********************
// This is static script. Runs only in the firebase server
// Whatever you do here, it wont reflect on firebase
// You have to RE-DELPOY this script when you change something in the file to UPDATE script in firebase server
// To do so, run "firebase deploy --only functions" 

// ***********INFO***********************
// This will trigger when new user is created
// After the user has been created, this script will grab the new user from Authentication and save to Firestore

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    //This is the work around code if this code do not work!
    
    // const newUser = {
    //     uid: user.uid,
    //     email: user.email,
    //     displayName: user.displayName,
    //     providerData: user.providerData
    // } 

    db.collection("users")
      .doc(user.uid)
      // .set(newUser);
      .set(JSON.parse(JSON.stringify(user))); //Change this if it gives an error
  });

export const deletePostComments = functions.firestore
  .document(`posts/{postId}`)
  .onDelete(async (snap) => {
    const postId = snap.id;
    console.log("HERE IS POST ID", postId);

    admin
      .firestore()
      .collection("comments")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().postId === postId) {
            console.log("DELETING COMMENT: ", doc.id, doc.data().text);
            doc.ref.delete();
          }
        });
      })
      .catch((error) => {
        console.log("Error deleting post comments");
      });
  });
