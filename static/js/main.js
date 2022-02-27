const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
const socket = io();

// On joining chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    printRoomName(room);
    printUsers(users);
});

// Receiving text back from server
socket.on('message', (msg) => {
    outputMessage(msg);
    // Scrolling to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('notification', (msg) => {
    let div = document.createElement('div');
    div.classList.add('notification');
    div.innerText = msg;
    chatMessages.appendChild(div);
});

// On sending text
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    
    // Emit message
    socket.emit('chatMsg', msg);
    // Clear and focus on input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Create a div and add the message to it to be displayed dynamically
function outputMessage(msg) {
    let div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${msg.user} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>`
    ;
    chatMessages.appendChild(div);
}

// Print Room Name
function printRoomName(room) {
    roomName.innerText = room;
}

// Print users' list
function printUsers(list) {
    usersList.innerHTML = `
        ${list.map(user => `<li>${user.username}</li>`).join('')}
    `;
}