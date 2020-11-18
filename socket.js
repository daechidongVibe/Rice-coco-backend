const socketIo = require('socket.io');
const meetingService = require('./services/meetingService');

const currentMeetingList = [];

const initSocket = server => {
  const io = socketIo(server);
  io.on('connection', socket => {
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

      socket.join(meetingId);
      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('cancel meeting', async meetingId => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);

      try {
        await meetingService.deleteMeeting(meetingId);
        socket.leave(meetingId);

      } catch (err) {
        console.error(err);
      }

      console.log(currentMeetingList);
    });

    socket.on('change location', async data => {
      const { location, meetingId } = data;

      socket.broadcast.to(meetingId).emit('partner location changed', location);
    });

    socket.on('end meeting', meetingId => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);
    });
  });
};

module.exports = initSocket;
