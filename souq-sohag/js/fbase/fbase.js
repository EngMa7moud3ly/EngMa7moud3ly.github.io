var firebaseConfig = {
  apiKey: "AIzaSyDTnqeO9-WSJNXiBCLLlKEeOGDW882xhUI",
  authDomain: "market-sohag.firebaseapp.com",
  databaseURL: "https://market-sohag.firebaseio.com",
  projectId: "market-sohag",
  storageBucket: "market-sohag.appspot.com",
  messagingSenderId: "25489535887",
  appId: "1:25489535887:web:5274b2831eecade45ed1fa",
  measurementId: "G-H0DEL64X1F"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
var db = firebase.database();
var storage = firebase.storage();