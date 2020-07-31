$(document).ready(function () {
    function signIn() {
        var email = document.getElementById('mail').value;
        var password = document.getElementById('pass').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
    }

    function initApp() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                window.location = "index.html";
            } else {
            }
        });
    }
    initApp();

    $('#login').on('submit', function (e) {
        e.preventDefault();
        signIn();
    });
});
