const meetingService = require('../services/meetingService');
const RESPONSE = require('../constants/response');

exports.getAllFilteredMeetings = async (req, res, next) => {
  const { userId } = res.locals.userInfo;

  try {
    const filteredMeetings = await meetingService.getAllFilteredMeetings(userId);

    res.status(200).json({ result: RESPONSE.OK, filteredMeetings });
  } catch (err) {
    next(err);
  }
};
