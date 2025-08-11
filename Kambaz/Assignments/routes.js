import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/assignments/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
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

    const assignment = await assignmentsDao.addAssignment(assignmentData)
    res.json(assignment)
  })

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await assignmentsDao.deleteAssignment(assignmentId)
    res.json(status)
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

    const updated = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates)
    res.json(updated)
  })

}
