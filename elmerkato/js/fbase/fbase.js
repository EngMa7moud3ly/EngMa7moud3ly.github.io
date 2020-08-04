var firebaseConfig = {
  apiKey: "AIzaSyDTnqeO9-WSJNXiBCLLlKEeOGDW882xhUI",
  authDomain: "market-sohag.firebaseapp.com",
  databaseURL: "https://market-sohag.firebaseio.com",
  projectId: "market-sohag",
  storageBucket: "market-sohag.appspot.com",
  messagingSenderId: "25489535887",
  appId: "1:25489535887:web:57ccc0121641defe5ed1fa",
  measurementId: "G-XRJ302GG8N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
var storage = firebase.storage();