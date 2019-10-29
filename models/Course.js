const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    },
    weeks: {
      type: String,
      required: [true, 'Please add a number of weeks']
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition']
    },
    minimumSkill: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipsAvailable: {
      type: Boolean,
      default: false
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
  {
    timestamps: true
  }
);

CourseSchema.statics.calculateAverageCost = async function(bootcampId) {
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
          averageCost: {
            $avg: '$tuition'
          }
        }
      }
    ]);

    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(aggregate[0].averageCost * 10) / 10
    });
  } catch (err) {
    console.log(err);
  }
};

// Call static calculateAverageCost
CourseSchema.post('save', async function() {
  this.constructor.calculateAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', async function() {
  this.constructor.calculateAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
