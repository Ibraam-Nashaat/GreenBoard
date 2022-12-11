import {
  College,
  Department,
  School,
  Instructor,
  Student,
  Course,
} from "@greenboard/shared";

export const SEED_COLLEGES: College[] = [
  {
    name: "College1",
    location: "Location1",
    phone: "Phone1",
    email: "Email1",
    adminPassword: "AdminPassword1",
    foundedAt: 2022,
    id: "COLLEGE001",
  },
];

export const SEED_SCHOOLS: School[] = [
  {
    id: "SCHOOL001",
    name: "School1",
    phone: "Phone1",
    email: "Email1",
    adminPassword: "AdminPassword1",
    collegeId: SEED_COLLEGES[0].id,
  },
];

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: "DEPT001",
    name: "Department1",
    email: "Email1",
    adminPassword: "AdminPassword1",
    schoolId: SEED_SCHOOLS[0].id,
  },
];

export const SEED_INSTRUCTORS: Instructor[] = [
  {
    id: "INSTR001",
    firstName: "FName",
    lastName: "LName",
    phone: "Phone1",
    email: "Email1",
    password: "Password",
    joinedAt: new Date(),
    departmentId: SEED_DEPARTMENTS[0].id,
  },
];

export const SEED_STUDENTS: Student[] = [
  {
    id: "STD001",
    firstName: "FName1",
    lastName: "LName1",
    phone: "Phone123",
    email: "Email123",
    password: "Password",
    joinedAt: new Date(),
    departmentId: SEED_DEPARTMENTS[0].id,
    level: 1,
  },
];

export const SEED_COURSES: Course[] = [
  {
    id: "COURSE001",
    name: "CourseName",
    courseCode: "Code1",
    password: "Password",
    departmentId: SEED_DEPARTMENTS[0].id,
  },
];
