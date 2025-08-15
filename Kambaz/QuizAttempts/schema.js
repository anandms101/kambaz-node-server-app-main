import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quizId: { type: String, required: true, ref: 'QuizModel' },
    studentId: { type: String, required: true, ref: 'UserModel' },
    attemptNumber: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: Date,
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    answers: [{
      questionId: String,
      answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, or array depending on question type
      isCorrect: Boolean,
      points: Number
    }],
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
