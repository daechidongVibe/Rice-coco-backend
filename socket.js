const socketIo = require('socket.io');
const meetingService = require('./services/meetingService');
const currentMeetingList = [];
// memo: message mock data
const createMessages = [{
  meetingId: '5fb6572e287d6b41df85f06b',
  author: '5fb52701a8ecd7c4c36eb375',
  message: '안녕하세요',

},
{
  meetingId: '5fb6572e287d6b41df85f06b',
  author: '5fb52702a8ecd7c4c36eb376',
  message: '네 안녕하세요',
}];

const initSocket = server => {
  const io = socketIo(server);
  // memmo: message mock data update
  // createMessages.map(chat => meetingService.upDateChat(chat.meetingId, chat.author, chat.message));
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
      console.log('break meeting');
      console.log(currentMeetingList);
      socket.broadcast.to(meetingId).emit('meeting broked up');
      socket.leave(meetingId);
    });

    socket.on('leave meeting', meetingId => {
      socket.leave(meetingId);

      socket.broadcast.to(meetingId).emit('meeting broke up');
      meetingService.deleteMeeting(meetingId);
      
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
