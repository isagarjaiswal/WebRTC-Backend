// import { v4 as uuidV4 } from "uuid";

const rooms = {};
const chats = {};

const roomHandler = (socket) => {
  // const createRoom = (roomId) => {
  //   rooms[roomId] = [];
  //   socket.emit("room-created", { roomId });
  // };
  const createRoom = (roomId) => {
    // const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };

  const joinRoom = ({ roomId, peerId, userName }) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    rooms[roomId][peerId] = { peerId, userName };

    socket.join(roomId);

    socket.to(roomId).emit("user-joined", { peerId, userName });

    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      console.log("user left the room", peerId);
      leaveRoom({ roomId, peerId });
    });
  };
  const leaveRoom = ({ peerId, roomId }) => {
    socket.to(roomId).emit("user-disconnected", peerId);
  };
  const startSharing = ({ peerId, roomId }) => {
    socket.to(roomId).emit("user-started-sharing", peerId);
  };
  const stopSharing = (roomId) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };
  const addMessage = (roomId, message) => {
    console.log({ message, roomId });
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.broadcast.to(roomId).emit("add-message", message);
  };

  const changeName = ({ peerId, userName, roomId }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit("name-changed", { peerId, userName });
    }
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
};

module.exports = { roomHandler };
