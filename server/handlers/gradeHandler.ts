import { ExpressHandlerWithParams } from "../types";
import {
  Grade,
  SubmitQuizRequest,
  SubmitQuizResponse,
} from "@greenboard/shared";
import { db } from "../datastore";

export const SubmitQuiz: ExpressHandlerWithParams<
  { courseId: string; quizId: string },
  SubmitQuizRequest,
  SubmitQuizResponse
> = async (req, res) => {
  if (!req.params.courseId) {
    return res.status(400).send({ error: "CourseId is required" });
  }

  if (!req.params.quizId) {
    return res.status(400).send({ error: "quizId is required" });
  }

  if (res.locals.role !== "STUDENT") {
    return res.status(403).send({ error: "Must be a student" });
  }

  const { answers } = req.body;
  if (!answers) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const existingCourse = await db.getCourseById(req.params.courseId);
  if (!existingCourse) {
    return res.status(404).send({ error: "Course not found" });
  }

  const existingQuiz = await db.getQuizById(req.params.quizId);
  if (!existingQuiz) {
    return res.status(404).send({ error: "Quiz not found" });
  }

  if (!existingQuiz.isActive) {
    return res.status(403).send({ error: "Quiz is not active" });
  }

  const questions = await db.getQuizQuestionsByQuizId(req.params.quizId);
  if (!questions) {
    return res.status(404).send({ error: "Quiz Questions not found" });
  }

  if (answers.length !== questions.length) {
    return res.status(400).send({ error: "All questions must be answered" });
  }

  const existingStudent = await db.getStudentById(res.locals.userId);
  if (!existingStudent) {
    return res.status(404).send({ error: "Student not valid" });
  }

  const existingEnrollment = await db.checkEnrollment(
    existingStudent.id,
    req.params.courseId
  );

  if (!existingEnrollment) {
    return res.status(403).send({ error: "Not enrolled in this course" });
  }

  let score: number = 0;
  let totalScore: number = 0;

  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].rightChoice) {
      score += questions[i].weight;
    }

    totalScore += questions[i].weight;
  }

  score = (score / totalScore) * 100;

  const grade: Grade = {
    studentId: existingStudent.id,
    quizId: req.params.quizId,
    grade: score,
    takenAt: new Date(),
  };

  await db.createGrade(grade);

  return res.status(200).send({
    grade: score,
  });
};
