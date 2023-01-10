//IMPORT
const bcrypt = require("bcryptjs");
const db = require("../configs/db");
const jwt = require("jsonwebtoken");

exports.adminListUser = async (req, res) => {
   try {
      db.query(
         "SELECT ROW_NUMBER() OVER(ORDER BY l.lv_id) AS num_row,  m.mem_id,m.mem_name,m.mem_mail,m.mem_tal,m.mem_user,m.mem_id, l.lv_id,l.lv_name,s.sta_id,s.sta_name FROM tbl_member m INNER JOIN tbl_status s ON m.sta_id = s.sta_id INNER JOIN tbl_level l ON m.lv_id = l.lv_id ORDER BY l.lv_id ASC",
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

exports.adminEnableAndDisenableMember = async (req, res) => {
   try {
      console.log(req.body);
      const { sta_id, mem_id } = req.body;
      db.query(
         "UPDATE tbl_member SET sta_id = ? WHERE mem_id = ?;",
         [sta_id, mem_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               console.log("เปลี่ยนสถานะสำเร็จ : ", sta_id);
               return res.send("เปลี่ยนสถานะสำเร็จ");
            }
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminReadUser = async (req, res) => {
   try {
      // Check user
      const id = req.params.id;
      db.query(
         "SELECT * FROM tbl_member WHERE mem_id = ?",
         [id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("Can't find user.");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      // res.send("adminReadUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminReadLevel = async (req, res) => {
   try {
      // Check user
      const val = req.body;
      console.log("adminReadLevel", req.body);
      db.query(
         "SELECT * FROM tbl_level WHERE lv_id = ?",
         [val.lv_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("Can't find level.");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      // res.send("adminReadUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminUpdateLevel = async (req, res) => {
   try {
      // Check user
      const { lv_id, lv_name } = req.body;
      console.log("adminUpdateLevel", req.body);
      if (lv_name === "" || lv_name == null) {
         return res
            .status(400)
            .send("กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกระดับการเข้าถึง");
      } else {
         console.log(req.body);
         db.query(
            "UPDATE tbl_level SET  lv_name = ?  WHERE lv_id = ?",
            [lv_name, lv_id],
            (err, result) => {
               if (err) {
                  console.log(err);
               } else {
                  res.send("บันทึกระดับการเข้าถึงสำเร็จ");
               }
            }
         );
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminReadQuestionType = async (req, res) => {
   try {
      // Check user
      const { type_id } = req.body;
      console.log("adminReadLevel", req.body);
      db.query(
         "SELECT * FROM tbl_type WHERE type_id = ?",
         [type_id],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("Can't find level.");
               } else {
                  return res.send(result);
               }
            }
         }
      );
      // res.send("adminReadUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminUpdateQuestionType = async (req, res) => {
   try {
      // Check user
      const { type_id, type_name } = req.body;
      console.log("adminUpdateLevel", req.body);
      if (type_name === "" || type_name == null) {
         return res
            .status(400)
            .send("กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกหมวดคำถาม");
      } else {
         console.log(req.body);
         db.query(
            "UPDATE tbl_type SET  type_name = ?  WHERE type_id = ?",
            [type_name, type_id],
            (err, result) => {
               if (err) {
                  console.log(err);
               } else {
                  res.send("บันทึกหมวดคำถามสำเร็จ");
               }
            }
         );
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminAddQuestionType = async (req, res) => {
   try {
      // Check user
      const { type_name } = req.body;
      console.log("adminaddQusetionType", req.body);
      if (type_name === "" || type_name == null) {
         return res
            .status(400)
            .send("กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกหมวดคำถาม");
      } else {
         // console.log(req.body);
         db.query(
            "INSERT INTO tbl_type (type_name)  VALUES (?)",
            [type_name],
            (err, result) => {
               if (err) {
                  console.log(err);
               } else {
                  res.send("เพิ่มหมวดคำถามสำเร็จ");
               }
            }
         );
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
exports.adminDeleteQuestionType = async (req, res) => {
   try {
      // Check user
      const { type_id } = req.body;
      // console.log("adminDeleteQusetionType", type_id);
      if (type_id === "" || type_id == null) {
         return res
            .status(400)
            .send("กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกหมวดคำถาม");
      } else {
         console.log(req.body);
         db.query(
            "SELECT type_id,qst_id FROM tbl_question WHERE type_id = ?",
            [type_id],
            (err, result) => {
               if (err) {
                  console.log(err);
               } else {
                  if (result[0] != null) {
                     // console.log("ไม่สามารถลบได้เนื่องจากมีการใช้หมวดคำถามนี้แล้ว");
                     res.status(400).send(
                        "ไม่สามารถลบได้เนื่องจากมีการใช้หมวดคำถามนี้แล้ว"
                     );
                  } else {
                     // console.log("สามารถลบได้");
                     db.query(
                        "DELETE FROM tbl_type WHERE type_id = ?",
                        [type_id],
                        (err, result) => {
                           if (err) {
                              console.log(err);
                           } else {
                              res.send("ลบข้อมูลสำเร็จ");
                           }
                        }
                     );
                  }
               }
            }
         );
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

/******************************************************************************* */

exports.adminEditUser = async (req, res) => {
   try {
      // Check user
      res.send("adminEditUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.adminDeleteUser = async (req, res) => {
   try {
      // Check user
      const id = req.params.id;
      db.query("DELETE FROM tbl_member WHERE mem_id = ?", id, (err, result) => {
         if (err) {
            console.log(err);
         } else {
            res.send("Delete User Success.");
         }
      });
      // res.send("adminDeleteUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
