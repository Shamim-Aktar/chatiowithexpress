const express=require('express')
const app=express()
const server=require('http').createServer(app)
const io=require('socket.io').listen(server)
const users=[],
connections=[]
server.listen(process.env.PORT||3000)
console.log('server is running')

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html')
})

io.sockets.on('connection', (socket)=>{
connections.push(socket)
console.log('Connected %s connection',connections.length)


socket.on('disconnect',(data)=>{
    // if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1)
    updateUsernemes()
    connections.splice(connections.indexOf(socket), 1)
    console.log('disconnected',connections.length)
})

//send messages
socket.on('send message', (data)=>{
    console.log(data)
io.sockets.emit('new message',{msg:data, user:socket.username})
})
//new user
socket.on('new user', (data, callback)=>{
callback(true)
socket.username=data
users.push(socket.username)
updateUsernemes()
})
function updateUsernemes(){
io.sockets.emit('get users', users)
}
})