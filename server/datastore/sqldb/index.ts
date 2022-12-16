import {
  User,
  Student,
  College,
  School,
  Department,
  Instructor,
  Course,
  Enrollment,
  CoursePost,
  Post,
  StudentQuestion,
  Comment,
  PostComment,
  InstructorAnswer,
} from "@greenboard/shared";
import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

import { DataStore } from "..";
import { getPasswordHashed } from "../../utils";
import {
  SEED_COLLEGE,
  SEED_SCHOOL,
  SEED_DEPARTMENT,
  SEED_COURSE,
  SEED_STUDENT,
  SEED_INSTRUCTOR,
  SEED_COLLEGE_PASSWORD,
  SEED_SCHOOL_PASSWORD,
  SEED_DEPARTMENT_PASSWORD,
  SEED_INSTRUCTOR_PASSWORD,
  SEED_STUDENT_PASSWORD,
  SEED_COURSE_PASSWORD,
  SEED_INSTRUCTOR2,
  SEED_STUDENT2,
  SEED_DEPARTMENT2,
  SEED_STUDENT_ENROLLMENT,
  SEED_INSTRUCTOR_ENROLLMENT,
  SEED_COURSE_POST,
  SEED_STUDENT_QUESTION,
} from "./seeds";

export class SQLDataStore implements DataStore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb(dbPath: string) {
    try {
      this.db = await sqliteOpen({
        filename: dbPath,
        driver: sqlite3.Database,
      });
    } catch (e) {
      console.error("Failed to open database at path:", dbPath, "err:", e);
      process.exit(1);
    }

    // To keep the referential integrity
    this.db.run("PRAGMA foreign_keys = ON");

    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });

    if (dbPath == ":memory:") {
      await this.seedDb();
    }

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users(id, firstName, lastName, email, password, phoneNumber, joinedAt, departmentId) VALUES (?,?,?,?,?,?,?,?)",
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.phone,
      user.joinedAt,
      user.departmentId
    );
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.db.get<User>("SELECT * FROM users WHERE id = ?", id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE email = ?",
      email
    );
  }

  async getUserByPhoneNumber(phone: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE phoneNumber = ?",
      phone
    );
  }

  async createStudent(student: Student): Promise<void> {
    await this.createUser(student);

    await this.db.run(
      "INSERT INTO students(id, level) VALUES (?,?)",
      student.id,
      student.level
    );
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.id = ?",
      id
    );
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.email = ?",
      email
    );
  }

  async getStudentByPhoneNumber(phone: string): Promise<Student | undefined> {
    return await this.db.get<Student>(
      "SELECT * FROM users JOIN students ON users.id = students.id WHERE users.phoneNumber = ?",
      phone
    );
  }

  async createCollege(college: College): Promise<void> {
    await this.db.run(
      "INSERT INTO colleges(id, name, phone, email, adminPassword, location, foundedAt) VALUES (?,?,?,?,?,?,?)",
      college.id,
      college.name,
      college.phone,
      college.email,
      college.adminPassword,
      college.location,
      college.foundedAt
    );
  }

  async updateCollege(college: College): Promise<void> {
    await this.db.run(
      "UPDATE colleges SET name = ?, phone = ?, email = ? WHERE id = ?",
      college.name,
      college.phone,
      college.email,
      college.id
    );
  }

  async getCollegeById(id: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE id = ?",
      id
    );
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    return await this.db.get<College>(
      "SELECT * FROM colleges WHERE email = ?",
      email
    );
  }

  async createSchool(school: School): Promise<void> {
    await this.db.run(
      "INSERT INTO schools(id, name, phone, email, adminPassword, collegeId) VALUES (?,?,?,?,?,?)",
      school.id,
      school.name,
      school.phone,
      school.email,
      school.adminPassword,
      school.collegeId
    );
  }

  async getSchoolById(id: string): Promise<School | undefined> {
    return await this.db.get<School>("SELECT * FROM schools WHERE id = ?", id);
  }

  async getSchoolByEmail(email: string): Promise<School | undefined> {
    return await this.db.get<School>(
      "SELECT * FROM schools WHERE email = ?",
      email
    );
  }

  async createDepartment(department: Department): Promise<void> {
    await this.db.run(
      "INSERT INTO departments(id, name, email, adminPassword, schoolId) VALUES (?,?,?,?,?)",
      department.id,
      department.name,
      department.email,
      department.adminPassword,
      department.schoolId
    );
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE id = ?",
      id
    );
  }

  async getDepartmentByEmail(email: string): Promise<Department | undefined> {
    return await this.db.get<Department>(
      "SELECT * FROM departments WHERE email = ?",
      email
    );
  }

  async updateDepartment(department: Department): Promise<void> {
    await this.db.run(
      "UPDATE departments SET name = ?, email = ? WHERE id = ?",
      department.name,
      department.email,
      department.id
    );
  }

  async createInstructor(instructor: Instructor): Promise<void> {
    await this.createUser(instructor);

    await this.db.run("INSERT INTO Instructors(id) VALUES (?)", instructor.id);
  }

  async getInstructorById(id: string): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.id = ?",
      id
    );
  }

  async getInstructorByEmail(email: string): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.email = ?",
      email
    );
  }

  async getInstructorByPhoneNumber(
    phone: string
  ): Promise<Instructor | undefined> {
    return await this.db.get<Instructor>(
      "SELECT * FROM users JOIN instructors ON users.id = instructors.id WHERE users.phoneNumber = ?",
      phone
    );
  }

  async updateSchool(school: School): Promise<void> {
    await this.db.run(
      "UPDATE Schools SET name = ?, phone = ?, email = ? WHERE id = ?",
      school.name,
      school.phone,
      school.email,
      school.id
    );
  }

  async createCourse(course: Course): Promise<void> {
    await this.db.run(
      "INSERT INTO courses(id,courseCode,name,password,departmentId) VALUES(?,?,?,?,?)",
      course.id,
      course.courseCode,
      course.name,
      course.password,
      course.departmentId
    );
  }

  async getCourseByCode(courseCode: string): Promise<Course | undefined> {
    return await this.db.get<Course>(
      "SELECT * from courses where courseCode=?",
      courseCode
    );
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return await this.db.get<Course>("SELECT * from courses where id=?", id);
  }

  async createEnrollment(enrollment: Enrollment): Promise<void> {
    await this.db.run(
      "INSERT INTO enrollments(id, userId, courseId) VALUES (?,?,?)",
      enrollment.id,
      enrollment.userId,
      enrollment.courseId
    );
  }

  async checkEnrollment(
    userId: string,
    courseId: string
  ): Promise<Enrollment | undefined> {
    return await this.db.get<Enrollment>(
      "SELECT * from enrollments where userId = ? AND courseId = ? ",
      userId,
      courseId
    );
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      "INSERT INTO posts(id, title, content, url, postedAt, courseId) VALUES (?,?,?,?,?,?)",
      post.id,
      post.title,
      post.content,
      post.url,
      post.postedAt,
      post.courseId
    );
  }
  async createCoursePost(coursePost: CoursePost): Promise<void> {
    await this.createPost(coursePost);
    await this.db.run("INSERT INTO course_posts(id) VALUES (?)", coursePost.id);
  }
  async getCoursePostById(postId: string): Promise<CoursePost | undefined> {
    return await this.db.get<CoursePost>(
      "SELECT * FROM posts JOIN course_posts ON course_posts.id = posts.id WHERE posts.id = ?",
      postId
    );
  }
  async listCoursePostsByCourseId(courseId: string): Promise<CoursePost[]> {
    return await this.db.all<CoursePost[]>(
      "SELECT * FROM posts JOIN course_posts ON course_posts.id = posts.id WHERE posts.courseId = ? ORDER BY postedAt DESC",
      courseId
    );
  }
  async createStuQuestion(StudentQuestion: StudentQuestion): Promise<void> {
    await this.createPost(StudentQuestion);
    await this.db.run(
      "INSERT INTO students_questions(id) VALUES(?)",
      StudentQuestion.id
    );
  }
  async getstuQuestionById(
    StudentQuestionid: string
  ): Promise<StudentQuestion | undefined> {
    return await this.db.get<StudentQuestion>(
      "SELECT * FROM posts JOIN students_questions ON students_questions.id = posts.id WHERE posts.id = ?",
      StudentQuestionid
    );
  }
  async listStuQuestionBycourseId(
    courseId: string
  ): Promise<StudentQuestion[]> {
    return await this.db.all<StudentQuestion[]>(
      "SELECT * FROM posts JOIN students_questions ON students_questions.id = posts.id WHERE posts.courseId = ? ORDER BY postedAt DESC",
      courseId
    );
  }
  async createComment(Comment: Comment): Promise<void> {
    await this.db.run(
      "INSERT INTO comments(id,comment,postedAt) VALUES (?,?,?) ",
      Comment.id,
      Comment.comment,
      Comment.postedAt
    );
  }
  async createPostComment(PostComment: PostComment): Promise<void> {
    await this.createComment(PostComment);
    await this.db.run(
      "INSERT INTO post_comments(id,userId,postId) VALUES (?,?,?)",
      PostComment.id,
      PostComment.userId,
      PostComment.postId
    );
  }
  async getPostCommentById(
    postCommentId: string
  ): Promise<PostComment | undefined> {
    return await this.db.get<PostComment>(
      "SELECT * FROM comments JOIN post_comments ON post_comments.id = comments.id WHERE comments.id = ?",
      postCommentId
    );
  }
  async listPostCommentsByPostId(PostId: string): Promise<PostComment[]> {
    return await this.db.all<PostComment[]>(
      "SELECT * FROM comments JOIN post_comments ON post_comments.id = comments.id WHERE postId=?",
      PostId
    );
  }
  async createInstructorAnswer(
    InstructorAnswer: InstructorAnswer
  ): Promise<void> {
    await this.createComment(InstructorAnswer);
    await this.db.run(
      "INSERT INTO instructors_answers VALUES(id,instructorId,questionId) (?,?,?)",
      InstructorAnswer.id,
      InstructorAnswer.instructorId,
      InstructorAnswer.questionId
    );
  }
  async getInstructorAnsweById(
    InstructorAnswerId: string
  ): Promise<InstructorAnswer | undefined> {
    return await this.db.get<InstructorAnswer>(
      "SELECT * FROM comments JOIN instructors_answers ON instructors_answers.id = comments.id WHERE comments.id = ?",
      InstructorAnswerId
    );
  }
  async listInstructorAnswerByPostId(
    PostId: string
  ): Promise<InstructorAnswer[]> {
    return await this.db.all<InstructorAnswer[]>(
      "SELECT * FROM comments JOIN instructors_answers ON instructors_answers.id = comments.id WHERE postId=?",
      PostId
    );
  }
  private seedDb = async () => {
    SEED_COLLEGE.adminPassword = getPasswordHashed(SEED_COLLEGE_PASSWORD);
    await this.createCollege(SEED_COLLEGE);

    SEED_SCHOOL.adminPassword = getPasswordHashed(SEED_SCHOOL_PASSWORD);
    await this.createSchool(SEED_SCHOOL);

    SEED_DEPARTMENT.adminPassword = getPasswordHashed(SEED_DEPARTMENT_PASSWORD);
    await this.createDepartment(SEED_DEPARTMENT);

    SEED_DEPARTMENT2.adminPassword = getPasswordHashed(
      SEED_DEPARTMENT_PASSWORD
    );
    await this.createDepartment(SEED_DEPARTMENT2);

    SEED_INSTRUCTOR.password = getPasswordHashed(SEED_INSTRUCTOR_PASSWORD);
    await this.createInstructor(SEED_INSTRUCTOR);

    SEED_INSTRUCTOR2.password = getPasswordHashed(SEED_INSTRUCTOR_PASSWORD);
    await this.createInstructor(SEED_INSTRUCTOR2);

    SEED_STUDENT.password = getPasswordHashed(SEED_STUDENT_PASSWORD);
    await this.createStudent(SEED_STUDENT);

    SEED_STUDENT2.password = getPasswordHashed(SEED_STUDENT_PASSWORD);
    await this.createStudent(SEED_STUDENT2);

    SEED_COURSE.password = getPasswordHashed(SEED_COURSE_PASSWORD);
    await this.createCourse(SEED_COURSE);

    await this.createEnrollment(SEED_STUDENT_ENROLLMENT);

    await this.createEnrollment(SEED_INSTRUCTOR_ENROLLMENT);

    await this.createCoursePost(SEED_COURSE_POST);

    await this.createStuQuestion(SEED_STUDENT_QUESTION);
  };
}
