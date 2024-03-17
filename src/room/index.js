const rooms = {};
const chats = {};

const roomHandler = (socket) => {
  console.log("roomHandler");

  const createRoom = (roomId) => {
    console.log("room created", roomId);
    console.log({ rooms });
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
  };

  const joinRoom = ({ roomId, peerId, userName }) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    // socket.emit("get-messages", chats[roomId]);
    // socket.broadcast.to(roomId).emit("get-messages", chats[roomId]);

    console.log("join room");

    rooms[roomId][peerId] = { peerId, userName };

    socket.join(roomId);

    socket.to(roomId).emit("user-joined", { peerId, userName });

    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
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
    console.log("add message", { message });
    console.log({ roomId });
    console.log({ chats: chats[roomId] });

    if (chats[roomId]) {
      console.log("under if", chats[roomId]);
      chats[roomId].push(message);
    } else {
      console.log("under else", chats[roomId]);

      chats[roomId] = [message];
    }
    socket.broadcast.to(roomId).emit("add-message", message);
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
};

module.exports = { roomHandler };
