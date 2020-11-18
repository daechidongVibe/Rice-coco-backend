const socketIo = require('socket.io');
const meetingService = require('./services/meetingService');

const currentMeetingList = [];

const initSocket = server => {
  const io = socketIo(server);
  io.on('connection', socket => {
    socket.on('join meeting', async data => {
      const { meetingId, user } = data;
      console.log('socket connection');
      const currentMeeting = {
        meetingId: '',
        users: [],
      };

      currentMeeting.meetingId = meetingId;
      currentMeeting.users.push(user);
      currentMeetingList.push(currentMeeting);

      if (currentMeeting.users.length === 2) {
        await meetingService.updateMeeting(meetingId);
      }
      socket.join(meetingId);
      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('leaveMeeting', async data => {
      const meetingId = data;

     try {
      await meetingService.deleteMeeting(meetingId);
      socket.leave(meetingId);
     } catch (err) {
      console.error(err);
     }
    });
  });
};

module.exports = initSocket;
