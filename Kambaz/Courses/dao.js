import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
  return model.find();
}

export function findCourseById(courseId) {
  return model.findById(courseId);
}

export function findCoursesForEnrolledUser(userId) {
  // This function is not used with DB filtering directly here.
  // The enrollment relationship will provide this when wired.
  return model.find();
}

export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
  
