$("#loginBtn").click(function(event){
    event.preventDefault();
    var username = userEmail.value;
    var password = userPass.value;

    var data = {
        "username" : username,
        "password" : password
    }

        $.ajax({
    type: "POST",
    url: "logged-in",
    data: data
  }).done(function(response) {
    
    
    if(response = true){
        window.location.href = "/login"

    }else{
        window.location.href = "/login"

    }

  });
 

});