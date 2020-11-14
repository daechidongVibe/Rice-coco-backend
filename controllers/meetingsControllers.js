const meetingService = require('../services/meetingService');

exports.getAllFilteredMeetings = async (req, res, next) => {
  const { userId } = res.locals.userInfo;
  const { location } = req.body;

  try {
    const filteredMeetings = await meetingService.getAllFilteredMeetings(userId, location);

  } catch (err) {

  }
};
