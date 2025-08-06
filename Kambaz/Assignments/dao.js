import Database from "../Database/index.js";
import { v4 as uuid } from "uuid"
const { assignments } = Database

// Helper function to transform assignment data for frontend
const transformAssignmentForFrontend = (assignment) => {
  return {
    ...assignment,
    available: assignment.not_available_until || assignment.available
  };
};

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  const filteredAssignments = assignments.filter(assignment => assignment.course === courseId);
  return filteredAssignments.map(transformAssignmentForFrontend);
}

export function addAssignment(assignmentInfo) {
  const { assignments } = Database

  const newAssignment = { ...assignmentInfo, _id: uuid() };
  Database.assignments = [...assignments, newAssignment];
  return Database.assignments.map(transformAssignmentForFrontend);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  Object.assign(assignment, assignmentUpdates);
  return transformAssignmentForFrontend(assignment);
}

export function deleteAssignment(assignmentId) {
  Database.assignments = assignments.filter(assignment => assignment._id !== assignmentId)
  return assignments.map(transformAssignmentForFrontend);
}
