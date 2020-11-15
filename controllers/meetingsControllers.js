const meetingService = require('../services/meetingService');
const RESPONSE = require('../constants/response');

exports.getAllFilteredMeetings = async (req, res, next) => {
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

exports.getMeetingDetail = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    const meetingDetails = await meetingService.getMeetingDetail(meetingId);

    if (meetingDetails) {
      res.status(201).json(
        {
          result: RESPONSE.OK,
          meetingDetails
        }
      );
    } else {
      res.json({
        result: RESPONSE.FAILURE,
        errMessage: RESPONSE.CAN_NOT_FIND
      });
    }
  } catch (err) {
    next(err);
  }
};
