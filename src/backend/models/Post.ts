import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },
  mainTitle: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  mainImage: {
    type: String,
    require: true,
  },
  metaTitle: {
    type: String,
  },

  summary: {
    type: String,
  },
  sectionTwoTitle: {
    type: String,
  },
  sectionTwoParagraphOne: {
    type: String,
  },
  sectionTwoParagraphTwo: {
    type: String,
  },
  sectionThreeTitle: {
    type: String,
  },
  sectionThreeParagraphOne: {
    type: String,
  },
  sectionThreeImage: {
    type: String,
  },
  sectionThreeParagraphFooter: {
    type: String,
  },
  sectionFourTitle: {
    type: String,
  },
  sectionFourOptionOne: {
    type: String,
  },
  sectionFourOptionTwo: {
    type: String,
  },
  sectionFourOptionThree: {
    type: String,
  },
  sectionFourParagraphOne: {
    type: String,
  },
  sectionFourImage: {
    type: String,
  },
  sectionFourParagraphFooter: {
    type: String,
  },
  sectionFiveTitle: {
    type: String,
  },
  sectionFiveImage: {
    type: String,
  },
  sectionFiveParagraphOne: {
    type: String,
  },
  sectionFiveParagraphTwo: {
    type: String,
  },
  sectionSixColOneTitle: {
    type: String,
  },
  sectionSixColOneParagraph: {
    type: String,
  },
  sectionSixColOneImage: {
    type: String,
  },
  sectionSixColTwoTitle: {
    type: String,
  },
  sectionSixColTwoParagraph: {
    type: String,
  },
  sectionSixColTwoImage: {
    type: String,
  },
  sectionSixColThreeTitle: {
    type: String,
  },
  sectionSixColThreeParagraph: {
    type: String,
  },
  sectionSixColThreeImage: {
    type: String,
  },
  sectionSixColOneParagraphFooter: {
    type: String,
  },
  sectionSevenTitle: {
    type: String,
  },
  sectionSevenImage: {
    type: String,
  },
  sectionSevenParagraph: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose?.models?.Post || mongoose.model('Post', PostSchema);
