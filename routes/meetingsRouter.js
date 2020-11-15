const express = require('express');
const meetingsRouter = express.Router();
const meetingsControllers = require('../controllers/meetingsControllers');
const ROUTES = require('../constants/routes');

meetingsRouter.get('/', meetingsControllers.getAllFilteredMeetings);
meetingsRouter.get(ROUTES.MEETING_DETAIL, meetingsControllers.getMeetingDetail);

module.exports = meetingsRouter;
