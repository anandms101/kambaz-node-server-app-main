import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quizId: { type: String, required: true, ref: 'QuizModel' },
    title: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'fill-blank'],
      required: true
    },
    points: { type: Number, default: 1 },
    questionText: { type: String, required: true },
    options: [{
      text: String,
      isCorrect: Boolean
    }], // For multiple choice questions
    correctAnswer: mongoose.Schema.Types.Mixed, // For true/false questions (true/false)
    correctAnswers: [String], // For fill-in-blank questions (array of possible correct answers)
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "questions" }
);

export default questionSchema; 
