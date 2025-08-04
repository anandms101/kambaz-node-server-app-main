import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function toggleUserInCourse(userId, courseId) {
  const { enrollments } = Database;

  const isEnrolled = enrollments.some(
    enrollment => enrollment.user === userId && enrollment.course === courseId
  );

  if (isEnrolled) {
    Database.enrollments = enrollments.filter(
      enrollment => !(enrollment.user === userId && enrollment.course === courseId)
    );
  } else {
    Database.enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }
  
  // Return only the user's enrollments
  return Database.enrollments.filter(enrollment => enrollment.user === userId);
}

export function getUserEnrollments(userId) {
  const { enrollments } = Database;
  return enrollments.filter(enrollment => enrollment.user === userId);
}

