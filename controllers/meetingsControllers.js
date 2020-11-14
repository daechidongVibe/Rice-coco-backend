const meetingService = require('../services/meetingService');
const RESPONSE = require('../constants/response');

exports.getAllFilteredMeetings = async (req, res, next) => {
  console.log(res.locals);
  const { userId } = res.locals.userInfo;

  try {
    await meetingService.getAllFilteredMeetings(userId);
    const filteredMeetings = await meetingService.getAllFilteredMeetings(userId);

    return {
      result: RESPONSE.OK,
      data: filteredMeetings
    };
  } catch (err) {
    next(err);
  }
};
