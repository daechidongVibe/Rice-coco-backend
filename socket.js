const socketIo = require('socket.io');
const meetingService = require('./services/meetingService');

const currentMeetingList = {};

const initSocket = server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    socket.on('join meeting', async ({ meetingId, userId }) => {
      let currentMeeting = currentMeetingList[meetingId];

      if (currentMeeting && !currentMeeting.users.includes(userId)) {
        currentMeeting.users.push(userId);
      }

      if (!currentMeeting) {
        currentMeeting = {
          meetingId,
          users: [userId],
          arrivalCount: 0,
        };

        currentMeetingList[meetingId] = currentMeeting;
      }

      const isMeetingMatched = currentMeeting && currentMeeting.users.length === 2;

      if (isMeetingMatched) {
        try {
          await meetingService.joinMeeting(meetingId, userId);
        } catch (error) {
          console.error(error);
        }
      }

      socket.meetingId = meetingId;
      socket.join(meetingId);
      console.log(currentMeeting);

      io.to(meetingId).emit('change current meeting', currentMeeting);
    });

    socket.on('send message', async ({ userId, nickname, message }, callback) => {
        await meetingService.updateChat(
          socket.meetingId,
          userId,
          nickname,
          message
        );

        io.emit('message', { userId, nickname, message });
        callback();
      }
    );

    socket.on('send notification', async ({ nickname, message }) => {
      socket.broadcast
        .to(socket.meetingId)
        .emit('notification recived', { nickname, message });
    });

    socket.on('send location', async ({ location }) => {
      socket.broadcast
        .to(socket.meetingId)
        .emit('get partner location', location);
    });

    socket.on('cancel meeting', async callback => {
      const { meetingId } = socket;

      try {
        await meetingService.deleteMeeting(meetingId);
        delete currentMeetingList[meetingId];

        socket.leave(meetingId);
        callback();
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('finish meeting', async callback => {
      const { meetingId } = socket;
      delete currentMeetingList[meetingId];

      try {
        await meetingService.finishMeeting(meetingId);
        delete currentMeetingList[meetingId];

        socket.leave(meetingId);
        callback();
      } catch (error) {
        console.error(error);
      }

      socket.leave(meetingId);
      callback();
    });

    socket.on('breakup meeting', async callback => {
      const { meetingId } = socket;

      try {
        await meetingService.deleteMeeting(meetingId);
        delete currentMeetingList[meetingId];

        socket.broadcast.to(meetingId).emit('canceled by partner');
        socket.leave(meetingId);
        callback();
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('arrive meeting', () => {
      const { meetingId } = socket;
      const currentMeeting = currentMeetingList[meetingId];

      currentMeeting.arrivalCount++;

      io.to(meetingId).emit('change current meeting', currentMeeting);
    });
  });
};

module.exports = initSocket;
