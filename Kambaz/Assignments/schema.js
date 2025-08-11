import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, ref: "CourseModel" },
    description: String,
    points: Number,
    due: Date,
    not_available_until: Date,
    until: Date,
  },
  { collection: "assignments" }
);

export default assignmentSchema;

