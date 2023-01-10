const db = require("../configs/db");
const path = require("path");
const fs = require("fs");

exports.addQuestion = async (req, res) => {
   try {
      const { type_id, qst_title, qst_detail, qst_name, qst_mail } = req.body;
      var file_new_Name = "0";
      var reqPath = "";
      if (req.files === null) {
         file_new_Name = "0";
         console.log("file_new_Name : ", file_new_Name);
         console.log("body : ", req.body);

         // return res.status(400).json({ msg: "No file uploaded" });
      } else {
         file = req.files.file;
         if (!file.name.match(/\.(png|jpg|jpeg|pdf|PNG|JPG|JPEG|PDF)$/)) {
            return res.status(400).send("ไฟล์ไม่ถูกต้อง");
         } else if (file2.size > 209715200) {
            return res.status(400).send("ขนาดไฟล์ไม่เกิน 200 MB");
         } else {
            file_new_Name = `${Date.now()}${path.extname(file.name)}`;

            console.log(req.user);
            console.log("files : ", req.files);
            console.log("body : ", req.body);
            console.log("file : ", file_new_Name);

            reqPath = path.join(__dirname, "../");
         }
      }

      if (type_id == 0 || type_id == null) {
         return res.status(400).send("กรุณาเลือกหมวดคำถาม");
      } else {
         if (qst_title === "" || qst_title == null) {
            return res.status(400).send("กรุณากรอกหัวข้อคำถาม");
         } else {
            if (qst_detail === "" || qst_detail == null) {
               return res.status(400).send("กรุณากรอกรายระเอียด");
            } else {
               if (qst_name === "" || qst_name == null) {
                  return res.status(400).send("กรุณากรอกชื่อผู้ต้ังคำถาม");
               } else {
                  if (qst_mail === "" || qst_mail == null) {
                     return res.status(400).send("กรุณากรอกอีเมล");
                  } else {
                     if (file_new_Name != 0) {
                        file.mv(
                           `${reqPath}/img/qst/${file_new_Name}`,
                           (err) => {
                              if (err) {
                                 console.error(err);
                                 return res.status(500).send(err);
                              }
                           }
                        );
                     }
                     db.query(
                        "INSERT INTO tbl_question (qst_title, qst_detail,qst_img, qst_name, qst_mail, qst_date, type_id, mem_id,sta_id ) VALUES (?,?,?,?,?,now(),?,?,?)",
                        [
                           qst_title,
                           qst_detail,
                           file_new_Name,
                           qst_name,
                           qst_mail,
                           type_id,
                           req.user.mem_id,
                           3,
                        ],
                        (err, result) => {
                           if (err) {
                              console.log(err);
                           } else {
                              res.send("บันทึกคำถามสำเร็จ");
                           }
                        }
                     );
                  }
               }
            }
         }
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.listQuestion = async (req, res) => {
   try {
      // Check user

      db.query(
         'SELECT ROW_NUMBER() OVER(ORDER BY q.qst_id) AS num_row,q.qst_id,t.type_name,q.qst_title,q.qst_img,q.qst_detail,q.qst_name,q.qst_name,q.qst_mail,q.qst_date,q.type_id,q.mem_id,s.sta_id,s.sta_name,r.reply_id,r.reply_detail,r.reply_url,DATE_FORMAT(qst_date, "%d-%m-%Y") AS date_q,DATE_FORMAT(reply_date, "%d-%m-%Y") AS date_a FROM tbl_reply r RIGHT JOIN (tbl_question q INNER JOIN tbl_status s ON q.sta_id = s.sta_id INNER JOIN tbl_type t ON t.type_id = q.type_id) ON r.reply_id = q.reply_id WHERE q.mem_id = ?',
         [req.user.mem_id],
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
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.readQuestion = async (req, res) => {
   try {
      // Check user
      console.log(req.body, req.user);
      db.query(
         "SELECT * FROM tbl_question WHERE mem_id = ? and qst_id = ?;",
         [req.user.mem_id, req.body.qst_id],
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
      //res.send("adminListUser");
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.updateQuestion = async (req, res) => {
   try {
      // Check user
      const {
         sta_id,
         type_id,
         qst_title,
         qst_img,
         qst_detail,
         qst_name,
         qst_mail,
         qst_id,
      } = req.body;
      var qst_img_new = qst_img;
      var img_Dname = "0";
      var req2Path = "";
      var file2;
      if (req.files === null) {
         img_Dname = qst_img;
         console.log("img_Dname : ", qst_img_new);
         console.log("body : ", req.body);
      } else {
         if (req.files != null) {
            file2 = req.files.file;
            console.log(file2.size);
            if (!file2.name.match(/\.(png|jpg|jpeg|pdf|PNG|JPG|JPEG|PDF)$/)) {
               return res.status(400).send("นามสกุลไฟล์ไม่ถูกต้อง");
            } else if (file2.size > 209715200) {
               return res.status(400).send("ขนาดไฟล์ไม่เกิน 200 MB");
            } else {
               img_Dname = `${Date.now()}${path.extname(file2.name)}`;
               // console.log(req.user);
               // console.log("files : ", req.files);
               // console.log("body : ", req.body);
               // console.log("img_Dname : ", img_Dname);
               qst_img_new = img_Dname;
               req2Path = path.join(__dirname, "../");
            }
         }
      }

      // console.log(req.body, req.user);

      // console.log("img : ", img_Dname);
      // console.log("qst_img : ", qst_img);
      //NOTE res.send(req.body);

      if (sta_id === 4 || sta_id == null) {
         return res
            .status(400)
            .send("ไม่สามารถแก้ไขได้เนื่องจากได้คำถามได้รับการตอบแล้ว");
      } else {
         if (type_id === 0 || type_id == null) {
            return res
               .status(400)
               .send("กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณาเลือกหมวดคำถาม");
         } else {
            if (qst_title === "" || qst_title == null) {
               return res
                  .status(400)
                  .send(
                     "กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกหัวข้อคำถาม"
                  );
            } else {
               if (img_Dname === "" || qst_detail == null) {
                  return res
                     .status(400)
                     .send(
                        "กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกรายระเอียด"
                     );
               } else {
                  if (qst_detail === "" || qst_detail == null) {
                     return res
                        .status(400)
                        .send(
                           "กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกรายระเอียด"
                        );
                  } else {
                     if (qst_name === "" || qst_name == null) {
                        return res
                           .status(400)
                           .send(
                              "กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกชื่อผู้ต้ังคำถาม"
                           );
                     } else {
                        if (qst_mail === "" || qst_mail == null) {
                           return res
                              .status(400)
                              .send(
                                 "กรุณาแก้ไขข้อมูลก่อนกดยืนยัน หรือ กรุณากรอกอีเมล"
                              );
                        } else {
                           console.log("qst_img_new : ", img_Dname);
                           if (req.files != null) {
                              file2.mv(
                                 `${req2Path}/img/qst/${img_Dname}`,
                                 (err) => {
                                    if (err) {
                                       console.error(err);
                                       return res.status(500).send(err);
                                    }
                                 }
                              );

                              const path = "./img/qst/" + qst_img;
                              try {
                                 fs.unlinkSync(path);
                                 //file2 removed
                              } catch (err) {
                                 console.error(err);
                              }
                           }
                           console.log("img on check : ", img_Dname);
                           db.query(
                              "UPDATE tbl_question SET type_id = ? , qst_title = ?, qst_img = ? ,  qst_detail = ? , qst_name = ? , qst_mail = ?  WHERE qst_id = ?",
                              [
                                 type_id,
                                 qst_title,
                                 img_Dname,
                                 qst_detail,
                                 qst_name,
                                 qst_mail,
                                 qst_id,
                              ],
                              (err, result) => {
                                 if (err) {
                                    console.log("ERR");
                                    console.log(err);
                                 } else {
                                    res.send("บันทึกคำถามสำเร็จ");
                                 }
                              }
                           );
                        }
                     }
                  }
               }
            }
         }
      }
   } catch (error) {
      console.log("Server Error!!!");
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.deleteQuestion = async (req, res) => {
   try {
      // Check user
      const { qst_id } = req.body;

      console.log("delete qusetion", req.body);

      db.query(
         "SELECT sta_id,qst_img FROM tbl_question WHERE qst_id = ?",
         [qst_id],
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
                  console.log(result[0]);
                  if (result[0].sta_id != 3) {
                     return res
                        .status(400)
                        .send(
                           "ไม่สามารถลบข้อมูลได้เนื่องจากมีการตอบคำถามกลับแล้ว"
                        );
                  } else {
                     if (result[0].qst_img != 0) {
                        // console.log("ลบรูป");
                        const path = "./img/qst/" + result[0].qst_img;
                        try {
                           fs.unlinkSync(path);
                           //file2 removed
                        } catch (err) {
                           console.error(err);
                        }
                     }
                     db.query(
                        "DELETE FROM tbl_question WHERE qst_id = ?",
                        [qst_id],
                        async (err, result) => {
                           if (err) {
                              console.log(err);
                              return res
                                 .status(400)
                                 .send("Query Database ERROR!!!");
                           } else {
                              res.send("ลบข้อมูลสำเร็จ");
                           }
                        }
                     );
                  }
                  // if(result[0] == )
                  // return res.send(result);
               }
            }
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

exports.updateInformation = async (req, res) => {
   try {
      // Check user
      const { mem_id, mem_name, mem_mail, mem_tal, mem_img } = req.body;
      var mem_img_new = mem_img;
      var img_Dname = "0";
      var req2Path = "";
      var file2;
      console.log("body : ", req.body);

      //ตรวจสอบเพื่อนเปลี่ยนชื่อไฟล์
      if (req.files === null) {
         img_Dname = mem_img;
         console.log("img_Dname : ", mem_img_new);
         // console.log("body : ", req.body);
      } else {
         if (req.files != null) {
            file2 = req.files.file;
            console.log(file2);

            if (!file2.name.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
               return res.status(400).send("ไฟล์รูปไม่ถูกต้อง");
            } else if (file2.size > 20971520) {
               return res.status(400).send("ขนาดไฟล์ไม่เกิน 20 MB");
            } else {
               img_Dname = `${Date.now()}${path.extname(file2.name)}`;
               // console.log(req.user);
               // console.log("files : ", req.files);
               // console.log("body : ", req.body);
               // console.log("img_Dname : ", img_Dname);
               mem_img_new = img_Dname;
               req2Path = path.join(__dirname, "../");
            }
         }
      }

      // console.log(req.body, req.user);

      // console.log("img : ", img_Dname);
      // console.log("mem_img : ", mem_img);
      //NOTE res.send(req.body);

      db.query(
         "SELECT * FROM (SELECT * FROM tbl_member WHERE NOT mem_id = ?) as a WHERE mem_mail = ? OR mem_tal = ?",
         [mem_id, mem_mail, mem_tal],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(500).send("Query Database ERROR!!!");
            } else {
               if (result.length > 0) {
                  // ถ้ามีคนใช้ Username นี้แล้วไม่ออก
                  return res
                     .status(400)
                     .send(
                        "ชื่อผู้ใช้ หรือ อีเมล หรือ เบอร์โทรศัพท์ มีผู้ใช้งานแล้ว"
                     );
               }

               if (mem_name === "" || mem_name === null) {
                  return res.status(400).send("กรุณากรอก ชื่อ - สกุล ");
               } else {
                  if (mem_mail === "" || mem_mail === null) {
                     return res.status(400).send("กรุณากรอก อีเมล ");
                  } else {
                     if (mem_tal === "" || mem_tal === null) {
                        return res.status(400).send("กรุณากรอก เบอร์โทรศัพท์");
                     } else {
                        // console.log("ผ่านไม่มีอะไรซ้ำ");
                        if (req.files != null) {
                           file2.mv(
                              `${req2Path}/img/user/${img_Dname}`,
                              (err) => {
                                 if (err) {
                                    console.error(err);
                                    return res.status(500).send(err);
                                 }
                              }
                           );
                           // delete img
                           const path = "./img/user/" + mem_img;
                           try {
                              fs.unlinkSync(path);
                              //file2 removed
                           } catch (err) {
                              console.error(err);
                           }
                        }
                        console.log("img on check : ", img_Dname);
                        db.query(
                           "UPDATE tbl_member SET mem_name = ?, mem_mail = ?, mem_tal = ?, mem_img = ? WHERE mem_id = ?",
                           [mem_name, mem_mail, mem_tal, img_Dname, mem_id],
                           (err, result) => {
                              if (err) {
                                 console.log("ERR");
                                 console.log(err);
                              } else {
                                 res.send("บันทึกข้อมูลส่วนตัวสำเร็จ");
                              }
                           }
                        );
                     }
                  }
               }
            }
         }
      );
   } catch (error) {
      console.log("Server Error!!!");
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
