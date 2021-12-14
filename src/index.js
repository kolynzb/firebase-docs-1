import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClRPTedkuPM4AOK-wREmQuQ5T7UWEr6Zw",
  authDomain: "code-tutor-6e2c7.firebaseapp.com",
  projectId: "code-tutor-6e2c7",
  storageBucket: "code-tutor-6e2c7.appspot.com",
  messagingSenderId: "755866635778",
  appId: "1:755866635778:web:08b8871d0fa5711660a11b",
  measurementId: "G-T2W1M0BK9Q",
};

//initialize app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
//collection ref
const colRef = collection(db, "courses");
//queries
const q = query(colRef, where("author", "==", "Net ninja"));
const q2 = query(
  colRef,
  where("author", "==", "Net ninja"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  let courses = [];
  snapshot.docs.forEach((doc) => {
    courses.push({ ...doc.data(), id: doc.id });
  });
  console.log(courses);
});

//get collection data
getDocs(colRef)
  .then((snapshot) => {
    let courses = [];
    snapshot.docs.forEach((doc) => {
      courses.push({ ...doc.data(), id: doc.id });
    });
    // console.log(courses);
  })
  .catch((err) => console.log(err));

//real time database
onSnapshot(colRef, (snapshot) => {
  let courses = [];
  snapshot.docs.forEach((doc) => {
    courses.push({ ...doc.data(), id: doc.id });
  });
  console.log(courses);
});

// adding docs
const addCourseForm = document.querySelector(".add");
addCourseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addCourseForm.title.value,
    author: addCourseForm.author.value,
    ytlink: addCourseForm.ytlink.value,
    createdAt: serverTimestamp(), //timestamps
  }).then(() => {
    addCourseForm.reset();
    console.log("course added");
  });
});

// deleting docs
const deleteCourseForm = document.querySelector(".delete");
deleteCourseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "courses", deleteCourseForm.id.value);
  deleteDoc(docRef).then(() => {
    addCourseForm.reset();
    console.log("course deleted");
  });
});

//getting a single document from

const docRef = doc(db, "courses", "Dtq2764bqu5txsVM7aGF");
getDoc(docRef).then((doc) => {
  console.log({ ...doc.data, id: doc.id });
});
onSnapshot(docRef, (doc) => console.log(doc.data, doc.id)); //realtime

//Updating
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

//authentication
const auth = getAuth();

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created...", cred.user);
    })
    .catch((err) => {
      console.log("error creating user", err.message);
    });
});

// logging  out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});
// logging in
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in:", cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");

  unsubAuth();
});
