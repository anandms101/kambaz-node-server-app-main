import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  app.get("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const course = await dao.findCourseById(courseId);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).send("user not authenticated");
      return;
    }
    
    const course = req.body;
    const newCourse = await dao.createCourse(course);
    
    // Auto-enroll the course creator
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    
    res.json(newCourse);
  });

  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) res.status(401).send("user not authenticated");

    const { courseId } = req.params;
    const courseUpdates = req.body;

    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });

  app.get("/api/courses/:courseId/users", async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  });

  // assignments routes omitted here
}
