const db = require("../configs/db");

exports.question_Type = async (req, res) => {
   try {
      //res.send(req.body);
      db.query("SELECT ROW_NUMBER() OVER(ORDER BY type_id) AS num_row, type_id, type_name FROM tbl_type", async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               //console.log(result);
               return res.status(400).send("This username does not exist. ");
            } else {
               return res.send(result);
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.question_Type_Name = async (req, res) => {
   try {
      const { type_id } = req.body;
      console.log(req.body);
      //res.send(req.body);
      db.query("SELECT type_name FROM tbl_type WHERE type_id = ?", [type_id], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               // console.log(result);
               return res.status(400).send("This username does not exist. ");
            } else {
               console.log(result);
               return res.send(result);
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.level = async (req, res) => {
   try {
      //res.send(req.body);
      db.query("SELECT * FROM tbl_level", async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               //console.log(result);
               return res.status(400).send("This username does not exist. ");
            } else {
               return res.send(result);
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.countQuestionType = async (req, res) => {
   try {
      // console.log(req.body);
      db.query(
         "SELECT t.type_id, t.type_name, COUNT(CASE WHEN q.sta_id = 3 THEN 1 END) AS count_type_id FROM tbl_type t LEFT JOIN tbl_question q on t.type_id = q.type_id  GROUP BY t.type_id  ORDER BY t.type_id  ASC;",
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("This username does not exist. ");
               } else {
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

exports.countFAQType = async (req, res) => {
   try {
      // console.log(req.body);
      db.query(
         "SELECT t.type_id, t.type_name, COUNT(f.faq_id) AS count_type_id FROM tbl_type t LEFT JOIN tbl_faq f on t.type_id = f.type_id  GROUP BY t.type_id  ORDER BY t.type_id  ASC;",
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("This username does not exist. ");
               } else {
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

exports.readFAQType = async (req, res) => {
   try {
      const { type_id } = req.body;
      console.log(req.body);
      db.query("SELECT * FROM tbl_faq WHERE type_id = ?", [type_id], async (err, result) => {
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
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.countQustOfUser = async (req, res) => {
   try {
      const { mem_id } = req.body;
      console.log(req.body);
      db.query(
         "SELECT COUNT(qst_id) as all_qst , COUNT(CASE WHEN sta_id = 4 THEN 1 END) as qst_success, COUNT(CASE WHEN sta_id = 3 THEN 1 END) as qst_wait FROM tbl_question WHERE mem_id = ?",
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
                  return res.send(result[0]);
               }
            }
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.countMember = async (req, res) => {
   try {
      db.query(
         "SELECT COUNT(CASE WHEN lv_id = 1 THEN 1 END) as admin_num, COUNT(CASE WHEN lv_id = 2 THEN 1 END) as officer_num, COUNT(CASE WHEN lv_id = 3 THEN 1 END) as user_num, COUNT(CASE WHEN lv_id = 3 and sta_id = 2 THEN 1 END) as user_disble FROM tbl_member;",
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  // console.log(result);
                  return res.status(400).send("ไม่พบข้อมูล");
               } else {
                  // console.log("else : ", result);
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

exports.countQstNoAns = async (req, res) => {
   try {
      db.query("SELECT COUNT(mem_id) as qst_num FROM tbl_question WHERE sta_id = 3;", async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               // console.log(result);
               return res.status(400).send("ไม่พบข้อมูล");
            } else {
               // console.log("else : ", result);
               return res.send(result);
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.countQuestionTypeAll = async (req, res) => {
   try {
      // console.log(req.body);
      db.query(
         "SELECT ROW_NUMBER() OVER(ORDER BY t.type_id) AS num_row,t.type_id, t.type_name, COUNT(q.sta_id) AS count_type_All FROM tbl_type t LEFT JOIN tbl_question q on t.type_id = q.type_id  GROUP BY t.type_id  ORDER BY t.type_id  ASC;",
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("This username does not exist. ");
               } else {
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

exports.allQuestion = async (req, res) => {
   try {
      const { limit } = req.body;
      console.log(req.body);
      db.query(
         "SELECT ROW_NUMBER() OVER(ORDER BY q.qst_id) AS num_row, qst_title, qst_detail, qst_name, qst_mail,q.sta_id, DATE_FORMAT(qst_date, '%d-%m-%Y') as date, m.mem_name, m.mem_img FROM tbl_question q INNER JOIN tbl_member m WHERE q.mem_id = m.mem_id ORDER BY qst_date DESC Limit ?;",
         [limit],
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
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
