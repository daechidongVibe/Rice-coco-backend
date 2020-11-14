const Meeting = require("../models/Meeting");
const User = require("../models/User");

exports.getAllFilteredMeetings = async (userId, location) => {
  const { preferredPartner } = await User.find({ _id: userId });

  const partnerIds = await Meeting.find({}).map( meeting  => meeting.participant[0]._id );
  const partners = partnerIds.map(async partnerId => await User.find({_id : partnerId}) );

  const radius = 100;
};
