var signIn = document.querySelector('.sign-in');
var signUp = document.querySelector('.sign-up');
var opened = false;

function changeForms() {
    formTrans();
    section.style.height = height + "px";
}

function formTrans() {
    if (opened == false) {
        signIn.style.left = '-100%';
        signUp.style.left = '-25%';
        opened = true;
    } else {
        signIn.style.left = '25%';
        signUp.style.left = '100%';
        opened = false;
    }
}

var containerBox = document.querySelector('#cont');

var height = containerBox.scrollHeight;
var section = document.querySelector('section');

section.style.height = height + "px";