import * as dao from "./dao.js";
import * as questionDao from "../Questions/dao.js";
import * as attemptDao from "../QuizAttempts/dao.js";

export default function QuizRoutes(app) {
  const createQuiz = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      
      const quizData = {
        ...req.body,
        createdBy: currentUser._id
      };
      
      const newQuiz = await dao.createQuiz(quizData);
      res.json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Error creating quiz", error: error.message });
    }
  };

  const findAllQuizzes = async (req, res) => {
    try {
      const { courseId } = req.query;
      if (courseId) {
        const quizzes = await dao.findQuizzesByCourse(courseId);
        res.json(quizzes);
      } else {
        const quizzes = await dao.findAllQuizzes();
        res.json(quizzes);
      }
    } catch (error) {
      console.error("Error finding quizzes:", error);
      res.status(500).json({ message: "Error finding quizzes", error: error.message });
    }
  };

  const findQuizById = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await dao.findQuizById(quizId);
      if (quiz) {
        res.json(quiz);
      } else {
        res.status(404).json({ message: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error finding quiz:", error);
      res.status(500).json({ message: "Error finding quiz", error: error.message });
    }
  };

  const updateQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      // Check if user is the creator of the quiz or has admin privileges
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to update this quiz" });
        return;
      }

      await dao.updateQuiz(quizId, req.body);
      const updatedQuiz = await dao.findQuizById(quizId);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ message: "Error updating quiz", error: error.message });
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      // Check if user is the creator of the quiz or has admin privileges
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to delete this quiz" });
        return;
      }

      // Delete all questions associated with this quiz
      await questionDao.deleteQuestionsByQuiz(quizId);
      
      // Delete all attempts associated with this quiz
      // Note: You might want to keep attempts for record keeping
      
      await dao.deleteQuiz(quizId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Error deleting quiz", error: error.message });
    }
  };

  const publishQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to publish this quiz" });
        return;
      }

      await dao.publishQuiz(quizId);
      const updatedQuiz = await dao.findQuizById(quizId);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("Error publishing quiz:", error);
      res.status(500).json({ message: "Error publishing quiz", error: error.message });
    }
  };

  const unpublishQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to unpublish this quiz" });
        return;
      }

      await dao.unpublishQuiz(quizId);
      const updatedQuiz = await dao.findQuizById(quizId);
      res.json(updatedQuiz);
    } catch (error) {
      console.error("Error unpublishing quiz:", error);
      res.status(500).json({ message: "Error unpublishing quiz", error: error.message });
    }
  };

  const getQuizWithQuestions = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      const questions = await questionDao.findQuestionsByQuiz(quizId);
      const quizWithQuestions = {
        ...quiz.toObject(),
        questions: questions
      };

      res.json(quizWithQuestions);
    } catch (error) {
      console.error("Error getting quiz with questions:", error);
      res.status(500).json({ message: "Error getting quiz with questions", error: error.message });
    }
  };

  app.post("/api/quizzes", createQuiz);
  app.get("/api/quizzes", findAllQuizzes);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.put("/api/quizzes/:quizId/unpublish", unpublishQuiz);
  app.get("/api/quizzes/:quizId/with-questions", getQuizWithQuestions);
}
