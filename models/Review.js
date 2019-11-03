const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, 'Please add a review title']
    },
    text: {
      type: String,
      required: [true, 'Please add a text'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please add a rating between 1 and 10']
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bootcamp',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function(bootcampId) {
  try {
    const aggregate = await this.aggregate([
      {
        $match: {
          bootcamp: bootcampId
        }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageRating: {
            $avg: '$rating'
          }
        }
      }
    ]);

    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: Math.ceil(aggregate[0].averageRating)
    });
  } catch (err) {
    console.log(err);
  }
};

// Call static calculateAverageCost
ReviewSchema.post('save', async function() {
  this.constructor.calculateAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', async function() {
  this.constructor.calculateAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
