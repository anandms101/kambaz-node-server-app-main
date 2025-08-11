import model from "./model.js";
import { v4 as uuid } from "uuid";

const transformAssignmentForFrontend = (assignment) => ({
  ...assignment,
  available: assignment.not_available_until || assignment.available,
});

export async function findAssignmentsForCourse(courseId) {
  const docs = await model.find({ course: courseId });
  return docs.map((doc) => transformAssignmentForFrontend(doc.toObject()));
}

export async function addAssignment(assignmentInfo) {
  const newAssignment = { ...assignmentInfo, _id: uuid() };
  const doc = await model.create(newAssignment);
  return transformAssignmentForFrontend(doc.toObject());
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
  await model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  const updated = await model.findById(assignmentId);
  return transformAssignmentForFrontend(updated.toObject());
}

export async function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
}
