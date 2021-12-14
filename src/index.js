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
} from "firebase/firestore";
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

//
