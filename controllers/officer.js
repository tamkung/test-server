// const { collapseToast } = require("react-toastify");
const db = require("../configs/db");

exports.officerReadQuestionType = async (req, res) => {
   try {
      // Check user
      const { type_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         'SELECT *, DATE_FORMAT(qst_date, "%d-%m-%Y") AS date_format FROM tbl_question INNER JOIN tbl_status ON tbl_question.sta_id = tbl_status.sta_id WHERE type_id = ? ORDER BY tbl_status.sta_id ASC, qst_date ASC;',
         [type_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.officerReadQuestion = async (req, res) => {
   try {
      // Check user
      const { qst_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         'SELECT *, DATE_FORMAT(qst_date, "%d-%m-%Y") AS date_q FROM tbl_reply r RIGHT JOIN (tbl_question q INNER JOIN tbl_status s ON q.sta_id = s.sta_id INNER JOIN tbl_type t ON t.type_id = q.type_id) ON r.reply_id = q.reply_id WHERE q.qst_id = ?',
         [qst_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.replyQuestion = async (req, res) => {
   try {
      // Check user
      const { reply_detail, reply_url, qst_id, mem_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         "SELECT reply_id FROM tbl_question WHERE qst_id = ?",
         [qst_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0].reply_id != 0) {
                  const { reply_id } = result[0];
                  console.log("Select reply_id :", reply_id);
                  db.query(
                     "UPDATE tbl_reply SET reply_detail = ?, reply_url = ? WHERE reply_id = ?",
                     [reply_detail, reply_url, reply_id],
                     async (err, result) => {
                        if (err) {
                           console.log(err);
                           return res
                              .status(400)
                              .send("Query Database ERROR!!!");
                        }
                        return res.send("บันทึกคำตอบสำเร็จ");
                     }
                  );
                  // return res.status(400).send("ไม่สามารถบันทึกได้เนื่องจากได้รับคำตอบแล้ว");
               } else {
                  db.query(
                     "INSERT INTO tbl_reply (reply_detail,reply_url,reply_date,qst_id,mem_id) VALUES (?,?,now(),?,?)",
                     [reply_detail, reply_url, qst_id, mem_id],
                     async (err, result) => {
                        if (err) {
                           console.log(err);
                           return res
                              .status(400)
                              .send("Query Database ERROR!!!");
                        } else {
                           db.query(
                              "SELECT reply_id FROM tbl_reply WHERE qst_id = ?",
                              [qst_id],
                              async (err, result) => {
                                 if (err) {
                                    console.log(err);
                                    return res
                                       .status(400)
                                       .send("Query Database ERROR!!!");
                                 } else {
                                    const { reply_id } = result[0];
                                    db.query(
                                       "UPDATE tbl_question SET reply_id = ?, sta_id = 4 WHERE qst_id = ?",
                                       [reply_id, qst_id, mem_id],
                                       async (err, result) => {
                                          if (err) {
                                             console.log(err);
                                             return res
                                                .status(400)
                                                .send(
                                                   "Query Database ERROR!!!"
                                                );
                                          }
                                          return res.send("บันทึกคำตอบสำเร็จ");
                                       }
                                    );
                                 }
                              }
                           );
                        }
                     }
                  );
               }
            }
         }
      );

      // res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.addFAQ = async (req, res) => {
   try {
      // Check user
      const { type_id, qst_title, qst_detail } = req.body;
      // console.log(req.body);
      // res.send(req.body);

      if (type_id === 0 || type_id === null) {
         return res.status(400).send("กรุณาเลือกหมวดคำถาม");
      } else {
         if (qst_title === "" || qst_title === null) {
            return res.status(400).send("กรุณากรอก หัวข้อคำถาม");
         } else {
            if (qst_detail === "" || qst_detail === null) {
               return res.status(400).send("กรุณากรอก รายละเอียด");
            }
            console.log(req.body);
            db.query(
               "INSERT INTO tbl_faq (faq_title, faq_detail, type_id) VALUES (?, ?, ?);",
               [qst_title, qst_detail, type_id],
               (err, result) => {
                  if (err) {
                     console.log(err);
                  } else {
                     res.send("บันทึกสำเร็จ");
                  }
               }
            );
         }
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.officerReadFAQType = async (req, res) => {
   try {
      // Check user
      const { type_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         "SELECT  * FROM tbl_faq WHERE type_id = ? ",
         [type_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
exports.officerReadFAQ = async (req, res) => {
   try {
      // Check user
      const { faq_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         "SELECT * FROM tbl_faq WHERE faq_id = ? ",
         [faq_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  console.log(result[0]);
                  return res.send(result);
               }
            }
         }
      );
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.officerUpdateFAQ = async (req, res) => {
   try {
      // Check user
      const { faq_id, faq_title, faq_detail, type_id } = req.body;
      console.log(req.body, req.user);
      db.query(
         "UPDATE tbl_faq SET faq_title = ? , faq_detail = ? , type_id = ? WHERE faq_id = ?;",
         [faq_title, faq_detail, type_id, faq_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               console.log(result[0]);
               return res.send("แก้ไขสำเร็จ");
            }
         }
      );
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.officerDeleteFAQ = async (req, res) => {
   try {
      // Check user
      const { faq_id } = req.body;
      // console.log("delete FAQ : ", req.body);
      db.query(
         "DELETE FROM tbl_faq WHERE faq_id = ?",
         [faq_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               res.send("ลบข้อมูลสำเร็จ");
            }
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
exports.officerCountReply = async (req, res) => {
   try {
      // Check user
      const { mem_id } = req.body;
      console.log("officerCountReply : ", req.body);
      db.query(
         "SELECT COUNT(q.qst_id) as allQst, COUNT(IF(q.sta_id = 4,1,null)) as successQst, COUNT(IF(q.sta_id = 3,1,null)) as waitReply,(SELECT COUNT(reply_id) as ownReply FROM tbl_reply r WHERE mem_id = ? ) as ownReply FROM tbl_question q",
         [mem_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  console.log(result[0]);
                  return res.send(result);
               }
            }
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
