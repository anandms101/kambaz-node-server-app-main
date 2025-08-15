import * as dao from "./dao.js";
import * as quizDao from "../Quizzes/dao.js";

export default function QuestionRoutes(app) {
  const createQuestion = async (req, res) => {
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

      // Check if user is the creator of the quiz or has admin privileges
      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to add questions to this quiz" });
        return;
      }

      const questionData = {
        ...req.body,
        quizId: quizId
      };

      const newQuestion = await dao.createQuestion(questionData);
      res.json(newQuestion);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Error creating question", error: error.message });
    }
  };

  const findQuestionsByQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const questions = await dao.findQuestionsByQuiz(quizId);
      res.json(questions);
    } catch (error) {
      console.error("Error finding questions:", error);
      res.status(500).json({ message: "Error finding questions", error: error.message });
    }
  };

  const findQuestionById = async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const question = await dao.findQuestionById(questionId);
      if (question) {
        res.json(question);
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    } catch (error) {
      console.error("Error finding question:", error);
      res.status(500).json({ message: "Error finding question", error: error.message });
    }
  };

  const updateQuestion = async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const question = await dao.findQuestionById(questionId);
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }

      // Check if user is the creator of the quiz or has admin privileges
      const quiz = await quizDao.findQuizById(question.quizId);
      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to update this question" });
        return;
      }

      await dao.updateQuestion(questionId, req.body);
      const updatedQuestion = await dao.findQuestionById(questionId);
      res.json(updatedQuestion);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Error updating question", error: error.message });
    }
  };

  const deleteQuestion = async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const question = await dao.findQuestionById(questionId);
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }

      // Check if user is the creator of the quiz or has admin privileges
      const quiz = await quizDao.findQuizById(question.quizId);
      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to delete this question" });
        return;
      }

      await dao.deleteQuestion(questionId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Error deleting question", error: error.message });
    }
  };

  const updateQuestionOrder = async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const { order } = req.body;
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }

      const question = await dao.findQuestionById(questionId);
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }

      // Check if user is the creator of the quiz or has admin privileges
      const quiz = await quizDao.findQuizById(question.quizId);
      if (quiz.createdBy !== currentUser._id && currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Not authorized to reorder this question" });
        return;
      }

      await dao.updateQuestionOrder(questionId, order);
      const updatedQuestion = await dao.findQuestionById(questionId);
      res.json(updatedQuestion);
    } catch (error) {
      console.error("Error updating question order:", error);
      res.status(500).json({ message: "Error updating question order", error: error.message });
    }
  };

  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.get("/api/quizzes/:quizId/questions", findQuestionsByQuiz);
  app.get("/api/questions/:questionId", findQuestionById);
  app.put("/api/questions/:questionId", updateQuestion);
  app.delete("/api/questions/:questionId", deleteQuestion);
  app.put("/api/questions/:questionId/order", updateQuestionOrder);
}
