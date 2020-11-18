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
      res.status().json({
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

  try {
    const meetingDetails = await meetingService.getMeetingDetail(meetingId);

    if (meetingDetails) {
      res.status(201).json({
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

exports.getMeetingByUserId = async (req, res, next) => {
  console.log('안오나..')
  const { userId } = req.params;
  console.log(userId);
  try {
    const userMeeting = await Meeting.findOne({ "participant._id": new ObjectId(userId.toString()) });

    console.log('유저 아이디로 찾아온 미팅! 없을 수도 있다.', userMeeting);

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
