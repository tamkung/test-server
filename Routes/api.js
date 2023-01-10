//NOTE IMPORT
const express = require("express");
const router = express.Router();

const {
   register,
   login,
   listUser,
   editUser,
   deleteUser,
   currentUser,
   forgot_password,
   new_password,
} = require("../controllers/auth.js");

const {
   question_Type,
   question_Type_Name,
   level,
   countQuestionType,
   countFAQType,
   readFAQType,
   countMember,
   countQstNoAns,
   countQustOfUser,
   countQuestionTypeAll,
   allQuestion,
} = require("../controllers/query");

//NOTE MiddleWare
const { auth, adminCheck, officerCheck } = require("../middlewares/auth");

//NOTE REGISTER
//@Enpoint  http://Localhost:3001/api/register
//@Method   POST
//@Access   Publish
router.post("/register", register);

//NOTE LOGIN
//@Enpoint  http://Localhost:3001/api/register
//@Method   POST
//@Access   Publish
router.post("/login", login);

//NOTE FORGOT-PASSWOD
//@Enpoint  http://Localhost:3001/api/register
//@Method   POST
//@Access   Publish
router.post("/forgot-password", forgot_password);

//NOTE NEW-PASSWOD
//@Enpoint  http://Localhost:3001/api/register
//@Method   POST
//@Access   Publish
router.post("/new-password", new_password);

//@Enpoint  http://Localhost:3001/api/current-user
//@Method   POST
//@Access   private
router.post("/current-user", auth, currentUser);

//@Enpoint  http://Localhost:3001/api/current-officer
//@Method   POST
//@Access   private
router.post("/current-officer", auth, officerCheck, currentUser);

//@Enpoint  http://Localhost:3001/api/current-admin
//@Method   POST
//@Access   private
router.post("/current-admin", auth, officerCheck, adminCheck, currentUser);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-question-type", auth, question_Type);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-question-type-faq", question_Type);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.post("/query-question-type-name", auth, question_Type_Name);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-Level", auth, level);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-count-question-type", countQuestionType);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-count-faq-type", countFAQType);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.post("/query-read-faq-type", readFAQType);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-count-member", auth, officerCheck, adminCheck, countMember);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   public
router.get("/query-count-question-no-ans", auth, officerCheck, countQstNoAns);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   public
router.post("/query-count-question-of-user", auth, countQustOfUser);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   GET
//@Access   private
router.get("/query-count-qusetion-type-all", countQuestionTypeAll);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/query-all-qusetion", allQuestion);

//@Enpoint  http://Localhost:3001/api/auth
//@Method   GET
// //@Access   private
router.get("/1", auth, (req, res) => {
   res.send("hello middleware");
});

router.get("/2", (req, res) => {
   res.send("hello middleware");
});

//@Enpoint  http://Localhost:3001/api/auth
//@Method   GET
//@Access   Publish
router.get("/auth", listUser);

//@Enpoint  http://Localhost:3001/api/auth
//@Method   PUT
//@Access   Publish
router.put("/auth", editUser);

//@Enpoint  http://Localhost:3001/api/auth
//@Method   DELETE
//@Access   Publish
router.delete("/auth", deleteUser);

module.exports = router;
