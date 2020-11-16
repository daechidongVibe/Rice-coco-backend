const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const LocationSchema = new Schema({
  lng: { type: Number, required: true },
  lat: { type: Number, required: true },
});

const RestaurantSchema = new Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: LocationSchema, required: true },
});

const ChatSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
});

const ParticipantSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'User' },
  isArrived: { type: Boolean, default: false },
});

const MeetingSchema = new Schema(
  {
    restaurant: { type: RestaurantSchema, required: true },
    expiredTime: { type: Date, default: new Date() + (60 * 60 * 1000) },
    isMatched: { type: Boolean, default: false },
    participant: [{ type: ParticipantSchema, required: true }],
    chat: [{ type: ChatSchema }],
  },
  schemaOptions
);

module.exports = mongoose.model('Meeting', MeetingSchema);
