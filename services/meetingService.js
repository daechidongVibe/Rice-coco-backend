const Meeting = require('../models/Meeting');
const User = require('../models/User');

exports.createMeeting = async ({ selectedMeeting, userId }) => {
  const { restaurantId, restaurantName, restaurantLocation } = selectedMeeting;

  try {
    const createdMeeting = await Meeting.create({
      restaurant: {
        restaurantId,
        name: restaurantName,
        location: restaurantLocation
      },
      participant: [ { _id: userId } ],
    });

    console.log('새롭게 만들어진 미팅...=>', createdMeeting);

    return createdMeeting;
  } catch (err) {
    console.log('미팅을 생성하던 중 에러가 발생하였습니다!', err);

    return err;
  }
};

exports.getAllFilteredMeetings = async userId => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return {
      error: '유저가 없습니다! 로그인은 제대로 되었나요?'
    }
  }

  const { preferredPartner } = user;

  const [ result ] = await Meeting.aggregate(
    [
      {
        $match: {
          $and: [
            { isMatched: false },
            { participant: { $size: 1 } }
          ]
        }
      },
      {
        $unwind: "$participant"
      },
      {
        $group: {
          _id: "$_id",
          participants: { $push: "$participant" }
        }
      },
      {
        $unwind: "$participants"
      },
      {
        $group: {
          _id: null,
          creators: { $push: "$participants._id" }
        }
      }
    ]
  );

  console.log('미팅을 생성한 모든 유저 아이디..', result.creators);

  const filteredCreators = [];

  for (let creatorId of result.creators) {
    let isMatchedPartner = false;

    const creator = await User.findOne(
      { _id: creatorId },
      { _id: 0 }
    );

    const { gender, birthYear, occupation } = creator;
    const {
      gender: preferredGender,
      birthYear: preferredBirthYear,
      occupation: preferredOccupation
    } = preferredPartner;

    const isMatchedGender = gender === preferredGender ? true : false;
    const isMatchedOccupation = occupation === preferredOccupation ? true : false;
    let isMatchedBirthYear = false;

    const currentYear = new Date().getFullYear();
    const creatorAge = currentYear - parseInt(birthYear);

    switch (preferredBirthYear) {
      case '20대':
        isMatchedBirthYear = creatorAge.toString()[0] === '2' ? true : false;
        break;
      case '30대':
        isMatchedBirthYear = creatorAge.toString()[0] === '3' ? true : false;
        break;
      case '40대':
        isMatchedBirthYear = creatorAge.toString()[0] === '4' ? true : false;
        break;
      case '50대':
        isMatchedBirthYear = creatorAge.toString()[0] === '5' ? true : false;
        break;
    }

    console.log(isMatchedGender, isMatchedOccupation, isMatchedBirthYear);

    if (
      isMatchedGender &&
      isMatchedOccupation &&
      isMatchedBirthYear
    ) {
      isMatchedPartner = true;
    }

    if (isMatchedPartner) {
      filteredCreators.push(creatorId);
    }
  }

  console.log('선호 조건으로 필터링 된 유저 아이디..', filteredCreators);

  // 필터 된 아이디로 미팅 가져오기
  const filteredMeetings = [];

  // 해당 크리에이터들이 만든 미팅 정보 가져오기..
  for (let creatorId of filteredCreators) {
    const meeting = await Meeting.aggregate(
      [
        {
          $match: {
            participant: { $elemMatch: { _id: creatorId } }
          }
        },
        { $unwind: "$participant" },
        {
          $lookup: {
            from: "users",
            localField: "participant._id",
            foreignField: "_id",
            as: "participant"
          }
        },
        { $unwind: "$participant" },
        {
          $project: {
            "_id": 1,
            "restaurant": 1,
            "participant": "$participant.nickname",
            "expiredTime": 1
          }
        },
      ]
    );

    filteredMeetings.push(meeting[0]);
  }

  console.log('필터링 된 미팅들!!', filteredMeetings);

  return filteredMeetings;
};

exports.getMeetingDetail = async meetingId => {
  try {
    const meetingDetails = await Meeting.findOne({ _id: meetingId });

    if (!meetingDetails || meetingDetails.isMatched) return;

    const partnerId = meetingDetails.participant[0]._id;
    const { nickname: partnerNickname } = await User.findOne({ _id: partnerId });

    if (!partnerId) return;

    const {
      restaurantId,
      location: restaurantLocation,
      name: restaurantName
     } = meetingDetails.restaurant;

    return  {
      expiredTime: meetingDetails.expiredTime,
      meetingId: meetingDetails._id,
      partnerNickname,
      restaurantId,
      restaurantLocation,
      restaurantName,
    };
  } catch (err) {
    return err;
  }
};

exports.joinMeeting = async (meetingId, userId) => {
  try {
    return await Meeting.findOneAndUpdate(
      { meetingId },
      {
        $addToSet: { participant: { _id: userId } },
        $set: { isMatched: true }
      }
    );
  } catch (err) {
    return err;
  }
};
