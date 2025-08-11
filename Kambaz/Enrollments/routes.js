import * as enrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  app.get("/api/enrollments/current", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || !currentUser._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    try {
      const enrollments = await enrollmentsDao.getUserEnrollments(currentUser._id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  app.post("/api/enrollments/current", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || !currentUser._id) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { courseId } = req.body;
    if (!courseId) {
      res.status(400).json({ message: "Course ID is required" });
      return;
    }

    try {
      const enrollments = await enrollmentsDao.toggleUserInCourse(currentUser._id, courseId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Error toggling enrollment" });
    }
  });


}
