import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createQuiz = (quiz) => {
  const newQuiz = { ...quiz, _id: uuidv4() };
  return model.create(newQuiz);
};

export const findAllQuizzes = () => model.find();
export const findQuizById = (quizId) => model.findById(quizId);
export const findQuizzesByCourse = (courseId) => model.find({ courseId });
export const findQuizzesByCreator = (createdBy) => model.find({ createdBy });
export const updateQuiz = (quizId, quiz) => model.updateOne({ _id: quizId }, { $set: { ...quiz, updatedAt: new Date() } });
export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

export const publishQuiz = (quizId) => model.updateOne({ _id: quizId }, { $set: { published: true, updatedAt: new Date() } });
export const unpublishQuiz = (quizId) => model.updateOne({ _id: quizId }, { $set: { published: false, updatedAt: new Date() } });

export const findPublishedQuizzesByCourse = (courseId) => model.find({ courseId, published: true });
export const findUnpublishedQuizzesByCourse = (courseId) => model.find({ courseId, published: false }); 
