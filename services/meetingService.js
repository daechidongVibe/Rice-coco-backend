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
      participant: [{ _id: userId }],
    });

    return createdMeeting;
  } catch (err) {
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

  const result = await Meeting.aggregate(
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

  // 유저의 선호 조건에 맞는 사람들을 찾을 수 없었을 때
  if (!result.length) {

    return result; // 빈 배열 리턴
  }

  const [{ creators }] = result;

  const filteredCreators = [];

  for (let creatorId of creators) {
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

  return filteredMeetings;
};

exports.getMeetingDetail = async (_id, userId) => {
  try {
    const meetingDetails = await Meeting.findOne({ _id });

    // 유저가 보내온 미팅 아이디에 해당하는 미팅을 찾을 수 없을 때
    if (!meetingDetails) {
      return {
        status: 'FAILURE',
        errMessage: '해당 미팅 정보를 찾을 수 없습니다'
      };
    }

    // 미팅이 있다면 까준다(?)
    const { expiredTime, restaurant, participant } = meetingDetails;

    const {
      restaurantId,
      location: restaurantLocation,
      name: restaurantName
    } = restaurant;

    // 미팅 참여자가 1 => 크리에이트 이후 보낸 요청
    if (meetingDetails.participant.length === 1) {
      return {
        status: 'SUCCESS',
        data: {
          restaurantName,
          expiredTime
        }
      };
    }

    // 미팅 참여자가 1이 아니다 (2다) => 조인 이후 보낸 요청
    const partnerId = participant.find(obj => obj._id !== userId)._id;
    const { nickname: partnerNickname } = await User.findOne({ _id: partnerId });
    return {
      status: 'SUCCESS',
      data: {
        expiredTime,
        partnerNickname,
        restaurantId,
        restaurantLocation,
        restaurantName,
      }
    };
  } catch (err) {
    return err;
  }
};

exports.joinMeeting = async (meetingId, userId) => {
  try {
    return await Meeting.findOneAndUpdate(
      { _id: meetingId },
      {
        $addToSet: { participant: { _id: userId } },
        $set: {
          isMatched: true,
          expiredTime: new Date(Date.now() +(60 * 1000))
        }
      },
      { new: true }
    );
  } catch (err) {
    return err;
  }
};

exports.deleteMeeting = async meetingId => {
  try {
    return await Meeting.findByIdAndRemove({ _id: meetingId });
  } catch (err) {
    return err;
  }
};

exports.updateChat = async (meetingId, userId, message) => {
  try {
    await Meeting.findOneAndUpdate(
      { '_id': meetingId },
      { $push: { chat: { userId, message } } },
    );
  } catch (err) {
    return err;
  }
};

exports.getAllFilteredMessages = async meetingId => {
  try {
    const meeting = await Meeting.findOne({ _id: meetingId });
    const { chat } = meeting.populate('chat');

    return chat;
  } catch (err) {
    return err;
  }
};
