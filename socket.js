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

      let currentMeeting = currentMeetingList[meetingIndex];

      if (currentMeeting && !currentMeeting.users.includes(userId)) {
        currentMeeting.users.push(userId);
      } else if (!currentMeeting) {
        currentMeeting = { meetingId, users: [userId] };
        currentMeetingList.push(currentMeeting);
      }

      if (currentMeeting && currentMeeting.users.length === 2) {
        await meetingService.joinMeeting(meetingId, userId);
      }

      socket.meetingId = meetingId;
      socket.join(meetingId);

      io.to(meetingId).emit('current meeting', currentMeeting);
    });

    socket.on('send message', async ({userId, nickname, message}, callback) => {
      await meetingService.updateChat(socket.meetingId, userId, nickname, message);
      io.emit('message', { userId, nickname, message });

      callback();
    });
    socket.on('send notification', async ({nickname, message}) => {
      socket.broadcast.to(socket.meetingId).emit('notification recived', { nickname, message });
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

        await meetingService.deleteMeeting(meetingId);

        callback();
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('end meeting', async (meetingId, callback) => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);

      try {
        await meetingService.deleteMeeting(meetingId);
        socket.leave(meetingId);

        callback();
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('breakup meeting', async (meetingId, callback) => {
      const endMeetingIndex = currentMeetingList.findIndex(
        meeting => meeting.meetingId === meetingId
      );

      currentMeetingList.splice(endMeetingIndex, 1);

      await meetingService.deleteMeeting(meetingId);
      socket.broadcast.to(meetingId).emit('meeting broked up');
      socket.leave(meetingId);

      callback();
    });

    socket.on('leave meeting', async (meetingId, callback) => {
      socket.leave(meetingId);

      socket.broadcast.to(meetingId).emit('meeting broked up');
      await meetingService.deleteMeeting(meetingId);
      callback();
    });

    socket.on('arrive meeting', meetingId => {
      const currentMeeting = currentMeetingList.find(
        meeting => meeting.meetingId === meetingId
      );

      currentMeeting.arrivalCount
        ? currentMeeting.arrivalCount++
        : (currentMeeting.arrivalCount = 1);

      io.to(meetingId).emit('current meeting', currentMeeting);
    });
  });
};

module.exports = initSocket;
