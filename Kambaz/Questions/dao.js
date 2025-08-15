import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createQuestion = (question) => {
  const newQuestion = { ...question, _id: uuidv4() };
  return model.create(newQuestion);
};

export const findAllQuestions = () => model.find();
export const findQuestionById = (questionId) => model.findById(questionId);
export const findQuestionsByQuiz = (quizId) => model.find({ quizId }).sort({ order: 1 });
export const updateQuestion = (questionId, question) => model.updateOne({ _id: questionId }, { $set: { ...question, updatedAt: new Date() } });
export const deleteQuestion = (questionId) => model.deleteOne({ _id: questionId });

export const deleteQuestionsByQuiz = (quizId) => model.deleteMany({ quizId });
export const updateQuestionOrder = (questionId, order) => model.updateOne({ _id: questionId }, { $set: { order, updatedAt: new Date() } });
