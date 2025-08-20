import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course).filter(course => course !== null);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user).filter(user => user !== null);
}

export function enrollUserInCourse(user, course) {
  const newEnrollment = { user, course, _id: `${user}-${course}` };
  console.log(`Creating enrollment with ID: ${newEnrollment._id}`);
  return model.create(newEnrollment);
}

export function unenrollUserFromCourse(user, course) {
  console.log(`Deleting enrollment for user: ${user}, course: ${course}`);
  return model.deleteOne({ user, course });
}

// Legacy functions for backward compatibility
export function toggleUserInCourse(userId, courseId) {
  return enrollUserInCourse(userId, courseId);
}

export function getUserEnrollments(userId) {
  return model.find({ user: userId });
}

