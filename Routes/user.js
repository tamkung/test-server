//NOTE IMPORT
const express = require("express");
const router = express.Router();
//Controller
const {
   addQuestion,
   listQuestion,
   readQuestion,
   updateQuestion,
   deleteQuestion,
   updateInformation,
} = require("../controllers/user");

const { change_password } = require("../controllers/auth");

//NOTE MiddleWare
const { auth } = require("../middlewares/auth");

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
// router.post("/user-add-question", auth, addQuestion);
router.post("/user-add-question", auth, addQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   private
router.get("/user-list-question", auth, listQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/user-read-question", auth, readQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/user-update-question", auth, updateQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/user-delete-question", auth, deleteQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/user-update-information", auth, updateInformation);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/change-password", auth, change_password);

module.exports = router;
