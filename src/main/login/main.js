import './style.css'

var loginBtn = document.getElementById('loginBtn');
var signLogin = document.getElementById('signin-login');
var signPass = document.getElementById('signin-password');

var signUpBtn = document.getElementById('signUpBtn');
var signUpLogin = document.getElementById('signup-username');
var signUpPassword = document.getElementById('signup-password');

var errSpanLogin = document.getElementById('errLogin');
var errSpanPassword = document.getElementById('errPass');
var errSpanLoginReg = document.getElementById('errLoginRegistration');
var errSpanPasswordReg = document.getElementById('errPasswordRegistration');

signUpBtn.addEventListener('click', isValidRegistration);
loginBtn.addEventListener('click', isValidLogin);
signUpLogin.addEventListener('click', hideSpanText);
signUpPassword.addEventListener('click', hideSpanText);
signLogin.addEventListener('click', hideSpanText);
signPass.addEventListener('click', hideSpanText);

function sendDataForRegistration() {
    var data = {
        login: signUpLogin.value.trim(),
        password: signUpPassword.value,
    };
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/registration');
    xhr.setRequestHeader("Content-Type", "application/json")
    hideSpanText()
    xhr.send(json)
    xhr.onload = () => {
        if (xhr.status === 200) {
            signUpLogin.value = '';
            signUpPassword.value = '';
            document.getElementById('sign_in').click()

        } else if (xhr.status === 401) {
            if (xhr.responseText === "User exist") {
                errSpanLoginReg.innerText = xhr.responseText;
                errSpanLoginReg.style.opacity = '1';
            } else {
                errSpanPasswordReg.innerText = xhr.responseText;
                errSpanPasswordReg.style.opacity = '1';
            }
        }
    }

}

function isValidRegistration() {
    if (isLoginValidRegistration() && isPassValidRegistration()) {
        console.log(isLoginValid() + " && " + isPassValid())
        sendDataForRegistration()
    } else {
        document.getElementById('inactive').click()
    }

}

function isPassValidRegistration() {
    return signUpLogin.validity.valid;

}

function isLoginValidRegistration() {
    return signUpPassword.validity.valid;

}

function isValidLogin() {
    if (isLoginValid() && isPassValid()) {
        console.log(isLoginValid() + " && " + isPassValid())
        sendDataForAuth()
    } else {
        document.getElementById('inactiveLogin').click()
    }

}

function isPassValid() {
    return signLogin.validity.valid;

}

function isLoginValid() {
    return signPass.validity.valid;

}

function hideSpanText() {
    errSpanPassword.style.opacity = '0';
    errSpanLogin.style.opacity = '0';
    errSpanPasswordReg.style.opacity = '0';
    errSpanLoginReg.style.opacity = '0';
}

function sendDataForAuth() {

    var data = {
        login: signLogin.value.trim(),
        password: signPass.value,
    };
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/authorization');
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(json)

    hideSpanText()
    xhr.onload = () => {
        if (xhr.status === 200) {
            var resp = JSON.parse(xhr.response);
            document.cookie = "token=Bearer_" + resp.token;
            document.location.href = 'http://localhost:4200/game.html';

        } else if (xhr.status === 400) {

        } else if (xhr.status === 401) {
            if (xhr.responseText === "User not found") {
                errSpanLogin.innerText = xhr.responseText;
                errSpanLogin.style.opacity = '1';
            } else {
                errSpanPassword.innerText = xhr.responseText;
                errSpanPassword.style.opacity = '1';
            }

        }
    }
}

jQuery(document).ready(function ($) {
    var $form_modal = $('.user-modal'),
        $form_login = $form_modal.find('#login'),
        $form_signup = $form_modal.find('#signup'),
        $form_forgot_password = $form_modal.find('#reset-password'),
        $form_modal_tab = $('.switcher'),
        $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
        $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
        $forgot_password_link = $form_login.find('.form-bottom-message a'),
        $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
        $main_nav = $('.main-nav');

    //open modal
    $main_nav.on('click', function (event) {

        if ($(event.target).is($main_nav)) {
            // on mobile open the submenu
            $(this).children('ul').toggleClass('is-visible');
        } else {
            // on mobile close submenu
            $main_nav.children('ul').removeClass('is-visible');
            //show modal layer
            $form_modal.addClass('is-visible');
            //show the selected form
            ($(event.target).is('.signup')) ? signup_selected() : login_selected();
        }

    });

    //close modal
    // $('.user-modal').on('click', function (event) {
    //     if ($(event.target).is($form_modal) || $(event.target).is('.close-form')) {
    //         $form_modal.removeClass('is-visible');
    //     }
    // });
    //close modal when clicking the esc keyboard button
    $(document).keyup(function (event) {
        if (event.which == '27') {
            $form_modal.removeClass('is-visible');
        }
    });

    //switch from a tab to another
    $form_modal_tab.on('click', function (event) {
        event.preventDefault();
        ($(event.target).is($tab_login)) ? login_selected() : signup_selected();
    });

    //hide or show password
    $('.hide-password').on('click', function () {
        var $this = $(this),
            $password_field = $this.prev('input');

        ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
        ('Show' == $this.text()) ? $this.text('Hide') : $this.text('Show');
        //focus and move cursor to the end of input field
        $password_field.putCursorAtEnd();
    });

    //show forgot-password form
    $forgot_password_link.on('click', function (event) {
        event.preventDefault();
        forgot_password_selected();
    });

    //back to login from the forgot-password form
    $back_to_login_link.on('click', function (event) {
        event.preventDefault();
        login_selected();
    });

    function login_selected() {
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }

    function signup_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }

    function forgot_password_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.addClass('is-selected');
    }

    //REMOVE THIS - it's just to show error messages
    // $form_login.find('input[type="submit"]').on('click', function(event) {
    //     event.preventDefault();
    // });
    //     $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    // });
    // $form_signup.find('input[type="submit"]').on('click', function(event){
    //     event.preventDefault();
    //     $form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    // });


    //IE9 placeholder fallback
    //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
    // if(!Modernizr.input.placeholder){
    //     $('[placeholder]').focus(function() {
    //         var input = $(this);
    //         if (input.val() == input.attr('placeholder')) {
    //             input.val('');
    //         }
    //     }).blur(function() {
    //         var input = $(this);
    //         if (input.val() == '' || input.val() == input.attr('placeholder')) {
    //             input.val(input.attr('placeholder'));
    //         }
    //     }).blur();
    //     $('[placeholder]').parents('form').submit(function() {
    //         $(this).find('[placeholder]').each(function() {
    //             var input = $(this);
    //             if (input.val() == input.attr('placeholder')) {
    //                 input.val('');
    //             }
    //         })
    //     });
    // }

});


//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {
    return this.each(function () {
        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }
    });
};
