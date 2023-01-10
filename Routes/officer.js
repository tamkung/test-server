const express = require("express");
const router = express.Router();

//Controller
const {
   officerReadQuestionType,
   officerReadQuestion,
   replyQuestion,
   addFAQ,
   officerReadFAQType,
   officerReadFAQ,
   officerUpdateFAQ,
   officerDeleteFAQ,
   officerCountReply,
} = require("../controllers/officer");

//NOTE MiddleWare
const { auth, officerCheck } = require("../middlewares/auth");

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-read-question-type", auth, officerCheck, officerReadQuestionType);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-read-question", auth, officerCheck, officerReadQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-reply-question", auth, officerCheck, replyQuestion);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-add-faq", auth, officerCheck, addFAQ);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-read-FAQ-type", auth, officerCheck, officerReadFAQType);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-read-FAQ", auth, officerCheck, officerReadFAQ);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-update-FAQ", auth, officerCheck, officerUpdateFAQ);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-delete-FAQ", auth, officerCheck, officerDeleteFAQ);

//@Enpoint  http://Localhost:3001/api/query-question-type
//@Method   POST
//@Access   private
router.post("/officer-count-reply", auth, officerCheck, officerCountReply);

module.exports = router;
