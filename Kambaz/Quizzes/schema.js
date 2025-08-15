import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    description: String,
    courseId: { type: String, required: true, ref: 'CourseModel' },
    quizType: {
      type: String,
      enum: ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey'],
      default: 'Graded Quiz'
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ['Quizzes', 'Exams', 'Assignments', 'Project'],
      default: 'Quizzes'
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: true },
    accessCode: { type: String, default: '' },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    published: { type: Boolean, default: false },
    createdBy: { type: String, required: true, ref: 'UserModel' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "quizzes" }
);

export default quizSchema; 
