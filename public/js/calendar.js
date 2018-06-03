let socket = io.connect("http://localhost:3000/");
$("#logOutBtn").click(function(event){
    event.preventDefault();
    var disconnectText = "has diconnected"
    socket.emit("disconnectUser",{"text":disconnectText});
    window.location.href ="/loggedOut"

})