//NOTE IMPORT
const express = require("express");
const router = express.Router();
//Controller
const {
   adminListUser,
   adminReadUser,
   adminEditUser,
   adminDeleteUser,
   adminEnableAndDisenableMember,
   adminReadLevel,
   adminUpdateLevel,
   adminReadQuestionType,
   adminUpdateQuestionType,
   adminAddQuestionType,
   adminDeleteQuestionType,
} = require("../controllers/admin");

//NOTE MiddleWare
const { auth, officerCheck, adminCheck } = require("../middlewares/auth");

//@Enpoint  http://Localhost:3001/api/admin-list-user
//@Method   GET
//@Access   Private
router.get("/admin-list-user", auth, officerCheck, adminCheck, adminListUser);

//@Enpoint  http://Localhost:3001/api/admin-enable-and-disenable-member
//@Method   POST
//@Access   Private
router.post("/admin-enable-and-disenable-member", auth, officerCheck, adminCheck, adminEnableAndDisenableMember);

//@Enpoint  http://Localhost:3001/api/admin-list-user
//@Method   POST
//@Access   Private
router.post("/admin-read-level", auth, officerCheck, adminCheck, adminReadLevel);

//@Enpoint  http://Localhost:3001/api/admin-update-level
//@Method   POST
//@Access   Private
router.post("/admin-update-level", auth, officerCheck, adminCheck, adminUpdateLevel);

//@Enpoint  http://Localhost:3001/api/admin-read-question-type
//@Method   POST
//@Access   Private
router.post("/admin-read-question-type", auth, officerCheck, adminCheck, adminReadQuestionType);

//@Enpoint  http://Localhost:3001/api/admin-update-question-type
//@Method   POST
//@Access   Private
router.post("/admin-update-question-type", auth, officerCheck, adminCheck, adminUpdateQuestionType);

//@Enpoint  http://Localhost:3001/api/admin-update-question-type
//@Method   POST
//@Access   Private
router.post("/admin-add-question-type", auth, officerCheck, adminCheck, adminAddQuestionType);

//@Enpoint  http://Localhost:3001/api/admin-edituser
//@Method   DELETE
//@Access   Private
router.post("/admin-delete-question-type/", auth, officerCheck, adminCheck, adminDeleteQuestionType);

//****************************************************************************************************************** */

//@Enpoint  http://Localhost:3001/api/admin-edituser
//@Method   GET
//@Access   Private
router.get("/admin-read-user/${id}", adminReadUser);

//NOTE edituser
//@Enpoint  http://Localhost:3001/api/admin-edituser
//@Method   PUT
//@Access   Private
router.put("/admin-edit-user/${id}", adminEditUser);

//@Enpoint  http://Localhost:3001/api/admin-edituser
//@Method   DELETE
//@Access   Private
router.delete("/admin-delete-user/${id}", adminDeleteUser);

module.exports = router;
