const meetingService = require('../services/meetingService');
const userService = require('../services/userService');
const RESPONSE = require('../constants/response');
const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res, next) => {
  try {
    const createdMeeting = await meetingService.createMeeting(req.body);

    if (createdMeeting) {
      return res.json({
        result: RESPONSE.OK,
        createdMeeting
      });
    } else {
      return res.json({
        result: RESPONSE.FAILURE,
        errMessage: RESPONSE.DID_NOT_CREATED
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllFilteredMeetings = async (req, res, next) => {
  const { userId } = res.locals.userInfo;

  try {
    const filteredMeetings = await meetingService.getAllFilteredMeetings(userId);

    res.status(200).json({
      result: RESPONSE.OK,
      filteredMeetings
    });
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
          ...meetingDetails
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

exports.joinMeeting = async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = req.body;

  try {
    const updatedMeeting = await meetingService.joinMeeting(meetingId, userId);

    console.log(updatedMeeting);

    res.json({
      result: RESPONSE.CAN_NOT_UPDATE,
      updatedMeeting
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMeeting = (req, res, next) => {

};
