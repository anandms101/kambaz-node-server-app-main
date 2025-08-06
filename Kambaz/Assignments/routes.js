import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/assignments/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const response = await assignmentsDao.findAssignmentsForCourse(courseId);
    res.send(response);
  });

  app.post("/api/assignments", async (req, res) => {
    const { title, course, description, points, due, available, until } = req.body;

    // Map 'available' field to 'not_available_until' for database storage
    const assignmentData = { 
      title, 
      course, 
      description, 
      points, 
      due, 
      not_available_until: available, 
      until 
    };

    const status = await assignmentsDao.addAssignment(assignmentData)
    res.send(status)
  })

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = assignmentsDao.deleteAssignment(assignmentId)
    res.send(status)
  })

  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const { title, course, description, points, due, available, until } = req.body;

    // Map 'available' field to 'not_available_until' for database storage
    const assignmentUpdates = { 
      title, 
      course, 
      description, 
      points, 
      due, 
      not_available_until: available, 
      until 
    };

    const status = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates)
    res.send(status)
  })

}
