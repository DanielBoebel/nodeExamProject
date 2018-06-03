$("#signUpBtn").click(function(){
        
    event.preventDefault();

    
    var firstname = firstName.value;
    var lastname = lastName.value;
    var username = userEmail.value;
    var password = userPass.value;

    var data = {
        "firstname" : firstname,
        "lastname" : lastname,
        "username" : username,
        "password" : password
    }

        $.ajax({
    type: "POST",
    url: "sign-up",
    data: data
  }).done(function(response) {
    if(response == true){
        document.getElementById("formSignUp").reset();
        window.location.href ="http://localhost:3000/"
    }
  });

});
