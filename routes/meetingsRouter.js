const express = require('express');
const meetingsRouter = express.Router();
const meetingsControllers = require('../controllers/meetingsControllers');
const ROUTES = require('../constants/routes');

meetingsRouter.get(ROUTES.HOME, meetingsControllers.getAllFilteredMeetings);
meetingsRouter.get(ROUTES.MEETING_DETAIL, meetingsControllers.getMeetingDetail);
meetingsRouter.get(`${ROUTES.USERS}${ROUTES.USER_DETAIL}`, meetingsControllers.getActiveMeetingByUserId);
meetingsRouter.get(`${ROUTES.MEETING_DETAIL}${ROUTES.CHAT}`, meetingsControllers.getAllFilteredMessages);

meetingsRouter.post(ROUTES.HOME, meetingsControllers.createMeeting);

meetingsRouter.put(`${ROUTES.MEETING_DETAIL}${ROUTES.JOIN}`, meetingsControllers.joinMeeting);

module.exports = meetingsRouter;
