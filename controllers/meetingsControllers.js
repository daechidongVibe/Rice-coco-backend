const meetingService = require('../services/meetingService');
const Meeting = require('../models/Meeting');
const RESPONSE = require('../constants/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
    const result = await meetingService.getAllFilteredMeetings(userId);

    if (result.error) {
      res.status(500).json({
        result: RESPONSE.FAILURE,
        errMessage: result.error
      })
    }

    res.status(200).json({
      result: RESPONSE.OK,
      filteredMeetings: result
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getMeetingDetail = async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = res.locals.userInfo;

  try {
    const meetingDetails = await meetingService.getMeetingDetail(meetingId, userId);

    if (meetingDetails.status === 'SUCCESS') {
      return res.status(201).json({
        result: RESPONSE.OK,
        meetingDetails: meetingDetails.data
      });
    }

    return res.json({
      result: RESPONSE.FAILURE,
      errMessage: meetingDetails.errMessage
    });
  } catch (err) {
    next(err);
  }
  };

exports.getMeetingByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userMeeting = await Meeting.findOne({ "participant._id": new ObjectId(userId.toString()) });

    res.json({
      result: RESPONSE.OK,
      userMeeting
    });
  } catch (err) {
    next(err);
  }
};

exports.joinMeeting = async (req, res, next) => {
  const { meetingId } = req.params;
  const { userId } = req.body;

  try {
    const updatedMeeting = await meetingService.joinMeeting(meetingId, userId);
    // console.log('조인 성공한 미팅 정보!', updatedMeeting);
    if (updatedMeeting) {
      return res.json({
        result: RESPONSE.OK,
        updatedMeeting
      });
    }

    res.json({
      result: RESPONSE.CAN_NOT_UPDATE
    });
  } catch (err) {
    next(err);
  }
};
