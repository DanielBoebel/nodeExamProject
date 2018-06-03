let socket = io.connect("http://localhost:3000/");
$("#logOutBtn").click(function(event){
event.preventDefault();
var disconnectText = "has diconnected"
socket.emit("disconnectUser",{"text":disconnectText});
window.location.href ="/loggedOut"

})

$("#submitProblem").click(function(event){
event.preventDefault()
var firstname = firstName.value
var lastname = lastName.value
var email = userEmail.value
var description = problemDescriptionID.value

var data = {
"firstname" : firstname,
"lastname" : lastname,
"email"    : email,
"description" : description
}

console.log(data)
$.ajax({
type: "POST",
url: "help-request",
data: data
}).done(function(response) {
if(response == true){
window.location.href = "/login"
}
});

});

