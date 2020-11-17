const express = require('express');
const meetingsRouter = express.Router();
const meetingsControllers = require('../controllers/meetingsControllers');
const ROUTES = require('../constants/routes');

meetingsRouter.post('/', meetingsControllers.createMeeting);

meetingsRouter.get('/', meetingsControllers.getAllFilteredMeetings);

meetingsRouter.get(ROUTES.MEETING_DETAIL, meetingsControllers.getMeetingDetail);

meetingsRouter.put(ROUTES.MEETING_DETAIL + ROUTES.JOIN, meetingsControllers.joinMeeting);

meetingsRouter.delete( ROUTES.MEETING_DETAIL, meetingsControllers.deleteMeeting);

module.exports = meetingsRouter;
