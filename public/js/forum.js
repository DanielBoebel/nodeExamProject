let socket = io.connect("http://localhost:3000/");

    
$("#submitting").click(function(event){
    event.preventDefault();
    var userText = textInp.value;

    socket.emit("emitDataToServer",{"text":userText });
})

    $("#logOutBtn").click(function(event){
        event.preventDefault();
        var disconnectText = "has diconnected"
        socket.emit("disconnectUser",{"text":disconnectText});
        window.location.href ="/loggedOut"

    })

    socket.on("allMessages",function(data){
        var msgArray = []
        var index = data.arrayMessage.length;
            data.arrayMessage.forEach(msg => {
                msgArray.push(msg);
            });
            console.log(msgArray)

             $("#textArea").text(msgArray.join(""))
    })

        socket.on("allUsers",function(data){
        var userArray = []
        var index = data.arrayUser.length;
            data.arrayUser.forEach(user => {
                userArray.push(user);
            });
            console.log(userArray)

             $("#userArea").text(userArray.join(""))
    })
    