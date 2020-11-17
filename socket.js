const socketIo = require('socket.io');
const Meeting = require('./models/Meeting');

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

      // if (currentMeeting.users.length === 2) {
      //   await Meeting.update({_id: meetingId}, {isMatched: true}); //memo: 서비스로직으로 분리하기
      // }
      socket.join(meetingId);
      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('disconnect', async data => {
      const { meetingId } = data;

     try {
      await Meeting.deleteOne({_id: meetingId }); //memo: 서비스로직으로 분리하기

      socket.leave(meetingId);
     } catch (err) {
      console.error(err);
     }
    });
  });
};

module.exports = initSocket;
