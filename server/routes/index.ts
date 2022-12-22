import { Router } from "express";
import student from "./student";
import college from "./college";
import school from "./school";
import instructor from "./instructor";
import department from "./department";
import course from "./course";
import announcements from "./announcements";

const router = Router();

router.use("/student", student);
router.use("/college", college);
router.use("/school", school);
router.use("/department", department);
router.use("/instructor", instructor);
router.use("/courses", course);
router.use("/announcements", announcements);

export default router;
