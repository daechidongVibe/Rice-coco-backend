const socketIo = require('socket.io');
const meetingService = require('./services/meetingService');
const currentMeetingList = [];

const initSocket = server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    console.log(123);

    socket.on('join meeting', async data => {
      const { meetingId, userId } = data;

      const meetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );
      const currentMeeting = currentMeetingList[meetingIndex];

      if (currentMeeting && !currentMeeting.users.includes(userId)) {
        currentMeeting.users.push(userId);
      } else {
        currentMeetingList.push({ meetingId, users: [userId] });
      }

      if (currentMeeting && currentMeeting.users.length === 2) {
        await meetingService.joinMeeting(meetingId, userId);
      }
      socket.meetingId = meetingId;
      socket.join(meetingId);

      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('send message', async ({userId, message}, callback) => {
      await meetingService.updateChat(socket.meetingId, userId, message);

      socket.emit('message', { userId, message });
      io.to(socket.meetingId).emit('message', { userId, message } );

      callback();
    });

    socket.on('change location', async data => {
      const { location, meetingId } = data;

      socket.broadcast.to(meetingId).emit('partner location changed', location);
    });

    socket.on('cancel meeting', async (meetingId, callback) => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);

      try {
        socket.leave(meetingId);
        meetingService.deleteMeeting(meetingId);

        callback();
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('end meeting', meetingId => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);
      socket.leave(meetingId);
    });

    socket.on('breakup meeting', (meetingId, callback) => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);

      socket.leave(meetingId);
      socket.broadcast.to(meetingId).emit('meeting broked up');
      meetingService.deleteMeeting(meetingId);

      callback();
    });
  });
};

module.exports = initSocket;
