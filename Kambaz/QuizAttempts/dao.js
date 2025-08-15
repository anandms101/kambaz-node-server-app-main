import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const createQuizAttempt = (attempt) => {
  const newAttempt = { ...attempt, _id: uuidv4() };
  return model.create(newAttempt);
};

export const findAllQuizAttempts = () => model.find();
export const findQuizAttemptById = (attemptId) => model.findById(attemptId);
export const findQuizAttemptsByQuiz = (quizId) => model.find({ quizId });
export const findQuizAttemptsByStudent = (studentId) => model.find({ studentId });
export const findQuizAttemptsByQuizAndStudent = (quizId, studentId) => model.find({ quizId, studentId }).sort({ attemptNumber: -1 });

export const updateQuizAttempt = (attemptId, attempt) => model.updateOne({ _id: attemptId }, { $set: attempt });
export const deleteQuizAttempt = (attemptId) => model.deleteOne({ _id: attemptId });

export const getNextAttemptNumber = async (quizId, studentId) => {
  const attempts = await model.find({ quizId, studentId }).sort({ attemptNumber: -1 }).limit(1);
  return attempts.length > 0 ? attempts[0].attemptNumber + 1 : 1;
};

export const completeQuizAttempt = (attemptId, answers, score, maxScore) => {
  return model.updateOne(
    { _id: attemptId },
    { 
      $set: { 
        answers, 
        score, 
        maxScore, 
        endTime: new Date(), 
        completed: true 
      } 
    }
  );
};
