const socketIo = require('socket.io');
const Meeting = require('./models/Meeting');

const currentMeetingList = [];

const initSocket = server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    socket.on('join meeting', async data => {

      console.log('connection');
      const { meetingId, user } = data;

      const currentMeeting = {
        meetingId: '',
        users: [],
      };

      currentMeeting.meetingId = meetingId;
      currentMeeting.users.push(user);
      currentMeetingList.push(currentMeeting);

      // if (currentMeeting.users.length === 2) {
      //   await Meeting.update({_id: meetingId}, {isMatched: true});
      // }
      console.log('datadata', data);
      socket.join(meetingId);
      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('disconnect', async data => {
      const { meetingId } = data;

     try {
      await Meeting.deleteOne({_id: meetingId });

      socket.leave(meetingId);
     } catch (err) {
      console.error(err);
     }
    });
  });
};

module.exports = initSocket;
