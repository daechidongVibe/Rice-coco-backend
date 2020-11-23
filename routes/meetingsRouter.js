const express = require('express');
const meetingsRouter = express.Router();
const meetingsControllers = require('../controllers/meetingsControllers');
const ROUTES = require('../constants/routes');

meetingsRouter.post('/', meetingsControllers.createMeeting);

meetingsRouter.get('/', meetingsControllers.getAllFilteredMeetings);

meetingsRouter.get(
  ROUTES.MEETING_DETAIL,
  meetingsControllers.getMeetingDetail
);

meetingsRouter.get(
  '/user' + ROUTES.USER_DETAIL,
  meetingsControllers.getActiveMeetingByUserId
);

meetingsRouter.put(
  ROUTES.MEETING_DETAIL + ROUTES.JOIN,
  meetingsControllers.joinMeeting
);

meetingsRouter.get(
  ROUTES.MEETING_DETAIL + ROUTES.CHAT,
  meetingsControllers.getAllFilteredMessages
);

module.exports = meetingsRouter;
