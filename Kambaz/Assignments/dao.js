import Database from "../Database/index.js";
import { v4 as uuid } from "uuid"
const { assignments } = Database

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter(assignment => assignment.course === courseId)
}

export function addAssignment(assignmentInfo) {
  const { assignments } = Database

  const newAssignment = { ...assignmentInfo, _id: uuid() };
  Database.assignments = [...assignments, newAssignment];
  return Database.assignments;
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  Object.assign(assignment, assignmentUpdates);
  return assignment;
}

export function deleteAssignment(assignmentId) {
  Database.assignments = assignments.filter(assignment => assignment._id !== assignmentId)
  return assignments;
}
