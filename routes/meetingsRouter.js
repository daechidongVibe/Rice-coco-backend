const express = require('express');
const meetingsRouter = express.Router();
const meetingsControllers = require('../controllers/meetingsControllers');
const ROUTES = require('../constants/routes');

// CREATE MEETING
meetingsRouter.post(
  '/',
  meetingsControllers.createMeeting
);

// READ MEETINGS
meetingsRouter.get(
  '/',
  meetingsControllers.getAllFilteredMeetings
);

// READ A MEETING BY MEETING ID
meetingsRouter.get(
  ROUTES.MEETING_DETAIL,
  meetingsControllers.getMeetingDetail
);

// READ A MEETING BY USER ID
meetingsRouter.get(
  '/user' + ROUTES.USER_DETAIL,
  meetingsControllers.getMeetingByUserId
);

// UPDATE A MEETING (JOIN)
meetingsRouter.put(
  ROUTES.MEETING_DETAIL + ROUTES.JOIN,
  meetingsControllers.joinMeeting
);

// DELETE A MEETING
meetingsRouter.delete(
  ROUTES.MEETING_DETAIL,
  meetingsControllers.deleteMeeting
);

module.exports = meetingsRouter;
