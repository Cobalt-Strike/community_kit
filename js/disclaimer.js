function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function cookieConsent() {

    if (!getCookie('acceptConsent')) {
        // Hide contents
        var x = document.getElementById("cckitContent");
        var y = document.getElementById("disclaimerPopup");

        x.style.visibility = "hidden";
        y.style.visibility = "visible";

        $('.toast').toast('show')
    } else {
        var x = document.getElementById("cckitContent");
        var y = document.getElementById("disclaimerPopup");

        x.style.visibility = "visible";
        y.style.visibility = "hidden";

    }
}

$('#btnDisagree').click(()=>{
    eraseCookie('acceptConsent')
    $('.toast').toast('hide')
    window.location.href = "http://www.cobaltstrike.com";
})

$('#btnAgree').click(()=>{
    setCookie('acceptConsent','1',1)
    $('.toast').toast('hide')
    window.location.href = "/community_kit";

})

// load
cookieConsent()

// for demo / testing only
$('#btnReset').click(()=>{
    // clear cookie to show toast after acceptance
    eraseCookie('acceptConsent')
    $('.toast').toast('show')
})



