const meetingService = require('../services/meetingService');
const RESPONSE = require('../constants/response');

exports.createMeeting = async (req, res, next) => {
  const { selectedMeeting, userId } = req.body;
  console.log(selectedMeeting);

  try {
    const createdMeeting = await meetingService.createMeeting(
      selectedMeeting,
      userId
    );

    res.status(201).json({ result: RESPONSE.OK, createdMeeting });
  } catch (error) {
    console.warn(error);
    next(error);
  }
};

exports.getAllFilteredMeetings = async (req, res, next) => {
  const { userId } = res.locals.userInfo;

  try {
    const result = await meetingService.getAllFilteredMeetings(userId);

    if (result.error) {
      res.status(500).json({
        result: RESPONSE.FAILURE,
        errMessage: result.error,
      });

      return;
    }

    res.status(200).json({
      result: RESPONSE.OK,
      filteredMeetings: result,
    });
  } catch (error) {
    console.warn(error);
    next(error);
  }
};

exports.getMeetingDetail = async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = res.locals.userInfo;

  try {
    const meetingDetails = await meetingService.getMeetingDetail(
      meetingId,
      userId
    );

    res.status(200).json({ result: RESPONSE.OK, meetingDetails });
  } catch (error) {
    console.warn(error);
    next(error);
  }
};

exports.getActiveMeetingByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const activeMeeting = await meetingService.getActiveMeetingByUserId(userId);

    res.json({
      result: RESPONSE.OK,
      activeMeeting,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.joinMeeting = async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = req.body;

  try {
    const updatedMeeting = await meetingService.joinMeeting(meetingId, userId);

    if (!updatedMeeting) {
      res.status(200).json({ result: RESPONSE.MEETING_IS_GONE });

      return;
    }

    res.status(200).json({ result: RESPONSE.OK, updatedMeeting });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getAllFilteredMessages = async (req, res, next) => {
  const { meetingId } = req.params;

  try {
    const filteredMessages = await meetingService.getAllFilteredMessages(
      meetingId
    );

    if (!filteredMessages) {
      return res.status(200).json({
        result: RESPONSE.CAN_NOT_FIND,
      });
    }

    res.status(200).json({
      result: RESPONSE.OK,
      filteredMessages,
    });
  } catch (error) {
    next(error);
  }
};
