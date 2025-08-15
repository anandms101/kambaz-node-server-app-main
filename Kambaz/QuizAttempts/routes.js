import * as dao from "./dao.js";
import * as quizDao from "../Quizzes/dao.js";
import * as questionDao from "../Questions/dao.js";

export default function QuizAttemptRoutes(app) {
  const startQuizAttempt = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { quizId } = req.params;
      const quiz = await quizDao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      // Check if quiz is published
      if (!quiz.published) {
        res.status(403).json({ message: "Quiz is not published" });
        return;
      }

      // Check if student has exceeded max attempts
      const existingAttempts = await dao.findQuizAttemptsByQuizAndStudent(quizId, currentUser._id);
      if (existingAttempts.length >= quiz.maxAttempts) {
        res.status(403).json({ message: "Maximum attempts reached for this quiz" });
        return;
      }

      // Get next attempt number
      const attemptNumber = await dao.getNextAttemptNumber(quizId, currentUser._id);

      const attemptData = {
        quizId: quizId,
        studentId: currentUser._id,
        attemptNumber: attemptNumber,
        startTime: new Date()
      };

      const newAttempt = await dao.createQuizAttempt(attemptData);
      res.json(newAttempt);
    } catch (error) {
      console.error("Error starting quiz attempt:", error);
      res.status(500).json({ message: "Error starting quiz attempt", error: error.message });
    }
  };

  const submitQuizAttempt = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { quizId, attemptId } = req.params;
      const { answers } = req.body;

      const attempt = await dao.findQuizAttemptById(attemptId);
      if (!attempt) {
        res.status(404).json({ message: "Attempt not found" });
        return;
      }

      // Verify this attempt belongs to the current user
      if (attempt.studentId !== currentUser._id) {
        res.status(403).json({ message: "Not authorized to submit this attempt" });
        return;
      }

      // Get quiz and questions for scoring
      const quiz = await quizDao.findQuizById(quizId);
      const questions = await questionDao.findQuestionsByQuiz(quizId);

      // Score the answers
      let totalScore = 0;
      let maxScore = 0;
      const scoredAnswers = [];

      for (const question of questions) {
        maxScore += question.points;
        const studentAnswer = answers.find(a => a.questionId === question._id);
        
        if (studentAnswer) {
          let isCorrect = false;
          let earnedPoints = 0;

          switch (question.questionType) {
            case 'multiple-choice':
              const correctOption = question.options.find(opt => opt.isCorrect);
              isCorrect = studentAnswer.answer === correctOption?.text;
              break;
            case 'true-false':
              isCorrect = studentAnswer.answer === question.correctAnswer;
              break;
            case 'fill-blank':
              isCorrect = question.correctAnswers.some(
                correct => correct.toLowerCase() === studentAnswer.answer.toLowerCase()
              );
              break;
          }

          if (isCorrect) {
            earnedPoints = question.points;
            totalScore += question.points;
          }

          scoredAnswers.push({
            questionId: question._id,
            answer: studentAnswer.answer,
            isCorrect: isCorrect,
            points: earnedPoints
          });
        }
      }

      // Complete the attempt
      await dao.completeQuizAttempt(attemptId, scoredAnswers, totalScore, maxScore);
      
      const completedAttempt = await dao.findQuizAttemptById(attemptId);
      res.json(completedAttempt);
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      res.status(500).json({ message: "Error submitting quiz attempt", error: error.message });
    }
  };

  const getQuizAttempt = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { attemptId } = req.params;
      const attempt = await dao.findQuizAttemptById(attemptId);
      
      if (!attempt) {
        res.status(404).json({ message: "Attempt not found" });
        return;
      }

      // Verify this attempt belongs to the current user or user is faculty/admin
      if (attempt.studentId !== currentUser._id && 
          currentUser.role !== "FACULTY" && 
          currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to view this attempt" });
        return;
      }

      res.json(attempt);
    } catch (error) {
      console.error("Error getting quiz attempt:", error);
      res.status(500).json({ message: "Error getting quiz attempt", error: error.message });
    }
  };

  const getQuizAttemptsForStudent = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { quizId } = req.params;
      const attempts = await dao.findQuizAttemptsByQuizAndStudent(quizId, currentUser._id);
      
      // For students, only return the last attempt as per requirements
      if (currentUser.role === "STUDENT") {
        if (attempts.length > 0) {
          // Sort by attempt number and return only the last one
          const lastAttempt = attempts.sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
          res.json([lastAttempt]);
        } else {
          res.json([]);
        }
      } else {
        // For faculty/admin, return all attempts
        res.json(attempts);
      }
    } catch (error) {
      console.error("Error getting quiz attempts:", error);
      res.status(500).json({ message: "Error getting quiz attempts", error: error.message });
    }
  };

  const getQuizAttemptsForQuiz = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const { quizId } = req.params;
      const quiz = await quizDao.findQuizById(quizId);
      
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      // Only faculty/admin can see all attempts for a quiz
      if (quiz.createdBy !== currentUser._id && 
          currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to view all attempts for this quiz" });
        return;
      }

      const attempts = await dao.findQuizAttemptsByQuiz(quizId);
      res.json(attempts);
    } catch (error) {
      console.error("Error getting quiz attempts:", error);
      res.status(500).json({ message: "Error getting quiz attempts", error: error.message });
    }
  };

  app.post("/api/quizzes/:quizId/attempts", startQuizAttempt);
  app.put("/api/quizzes/:quizId/attempts/:attemptId", submitQuizAttempt);
  app.get("/api/quizzes/:quizId/attempts/:attemptId", getQuizAttempt);
  app.get("/api/quizzes/:quizId/attempts", getQuizAttemptsForStudent);
  app.get("/api/quizzes/:quizId/all-attempts", getQuizAttemptsForQuiz);
}
