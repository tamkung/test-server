//IMPORT
const bcrypt = require("bcryptjs");
const db = require("../configs/db");
const jwt = require("jsonwebtoken");


//POST
/* Pattern Data JSON
{
    "mem_user":"....",
    "mem_pwd":"....",
    "mem_name":"....",
    "mem_mail":"....@mail.com",
    "mem_tal":"....",
    "mem_img":"."
} */

exports.register = async (req, res) => {
   try {
      // Check user
      const { mem_user, mem_pwd, mem_name, mem_mail, mem_tal, mem_img, lv_id } = req.body;
      //res.send(req.body);
      db.query(
         "SELECT * FROM tbl_member WHERE mem_user = ? OR mem_mail = ? OR mem_tal = ? ",
         [mem_user, mem_mail, mem_tal],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(500).send("Query Database ERROR!!!");
            } else {
               if (result.length > 0) {
                  // ถ้ามีคนใช้ Username นี้แล้วไม่ออก
                  return res.status(400).send("ชื่อผู้ใช้ หรือ อีเมล หรือ เบอร์โทรศัพท์ มีผู้ใช้งานแล้ว");
               }
               // เข้ารหัส Encrypt
               const salt = await bcrypt.genSalt(10);
               const passwordHash = await bcrypt.hash(mem_pwd, salt);
               if (mem_user === "" || mem_user === null) {
                  return res.status(400).send("กรุณากรอก ชื่อผู้ใช้");
               } else {
                  if (mem_pwd === "" || mem_pwd === null) {
                     return res.status(400).send("กรุณากรอก รหัสผ่าน ");
                  } else {
                     if (mem_name === "" || mem_name === null) {
                        return res.status(400).send("กรุณากรอก ชื่อ - สกุล ");
                     } else {
                        if (mem_mail === "" || mem_mail === null) {
                           return res.status(400).send("กรุณากรอก อีเมล ");
                        } else {
                           if (mem_tal === "" || mem_tal === null) {
                              return res.status(400).send("กรุณากรอก เบอร์โทรศัพท์");
                           } else {
                              if (lv_id === "0" || lv_id === null) {
                                 return res.status(400).send("กรุณาเลือกระดับการเข้าถึงข้อมูล");
                              } else {
                                 console.log(req.body);
                                 db.query(
                                    "INSERT INTO tbl_member (mem_user, mem_pwd, mem_name, mem_mail, mem_tal, mem_img, lv_id, sta_id, date_create, date_update ) VALUES (?,?,?,?,?,?,?,?,now(),now())",
                                    [mem_user, passwordHash, mem_name, mem_mail, mem_tal, mem_img, lv_id, 1],
                                    (err, result) => {
                                       if (err) {
                                          console.log(err);
                                       } else {
                                          res.send("Register Success");
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
         }
      );
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

//POST
/* Pattern Data JSON
{
    "mem_user":"....",
    "mem_pwd":"....",
} */
exports.login = async (req, res) => {
   try {
      // Check user
      // const { mem_user, mem_pwd } = req.body;
      const mem_user = req.body.mem_user;
      const mem_pwd = req.body.mem_pwd;
      console.log("mem_user", mem_user);
      //res.send(req.body);
      if (mem_user == "" || mem_user == null) {
         res.status(400).send("กรุณากรอกชื่อผู้ใช้");
      } else {
         if (mem_pwd == "" || mem_pwd == null) {
            res.status(400).send("กรุณากรอกรหัสผ่าน");
         } else {
            db.query(
               "SELECT * FROM tbl_member INNER JOIN tbl_level on tbl_member.lv_id = tbl_level.lv_id WHERE mem_user = ?",
               [mem_user],
               async (err, result) => {
                  if (err) {
                     console.log(err);
                     return res.status(400).send("Query Database ERROR!!!");
                  } else {
                     //res.send(result[0]);
                     if (result[0] == null) {
                        // Username มีข้อมูลหรือไม่
                        //console.log(result);
                        return res.status(400).send("ไม่มีชื่อผู้ใช้นี้ในระบบ");
                     } else {
                        // Username ไม่ได้ถูกปิดการใช้งาน
                        // FIXME อาจมีการแก้ไขในอนาคต
                        if (result[0].sta_id === 2) {
                           return res.status(400).send("ผู้ใช้ถูกปิดการใช้งาน");
                        }
                        // check Password
                        const isMatch = await bcrypt.compare(mem_pwd, result[0].mem_pwd);
                        console.log(isMatch);
                        if (!isMatch) {
                           return res.status(400).send("รหัสผ่านไม่ถูกต้อง!!!");
                        }

                        // Create Payload
                        const payLoad = {
                           user: {
                              mem_id: result[0].mem_id,
                              mem_user: result[0].mem_user,
                              mem_name: result[0].mem_name,
                              mem_mail: result[0].mem_mail,
                              mem_tal: result[0].mem_tal,
                              mem_img: result[0].mem_img,
                              lv_id: result[0].lv_id,
                              lv_name: result[0].lv_name,
                           },
                        };

                        // Genarate Token
                        // NOTE jwtSecret คือ Secret Code
                        jwt.sign(payLoad, "jwtSecret", { expiresIn: 60 * 60 }, (err, token) => {
                           if (err) {
                              throw err;
                           } else {
                              res.send({ token, payLoad });
                           }
                        });

                        //res.send(payLoad);
                     }
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

//POST

exports.currentUser = async (req, res) => {
   try {
      // console.log("HELLO", req.user);
      // req.user มาจากการ decode midleware
      db.query(
         "SELECT * FROM tbl_member INNER JOIN tbl_level on tbl_member.lv_id = tbl_level.lv_id WHERE mem_user = ?",
         [req.user.mem_user],
         async (err, result) => {
            if (err) {
               console.log(err);
               return res.status(400).send("Query Database ERROR!!!");
            } else {
               // console.log(result[0]);
               // res.send(result[0]);
               if (result[0] == null) {
                  // Username มีข้อมูลหรือไม่
                  //console.log(result);
                  return res.status(400).send("ไม่มีชื่อผู้ใช้นี้ในระบบ");
               } else {
                  // Username ไม่ได้ถูกปิดการใช้งาน
                  // FIXME อาจมีการแก้ไขในอนาคต
                  if (result[0].sta_id === 2) {
                     return res.status(400).send("ผู้ใช้ถูกปิดการใช้งาน ");
                  }
                  console.log(result[0]);
                  res.send(result[0]);
               }
            }
         }
      );
   } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
   }
};

exports.forgot_password = async (req, res) => {
   try {
      // console.log("Forgot_Password : ", req.body);
      db.query("SELECT mem_tal FROM tbl_member WHERE mem_mail = ?", [req.body.mem_mail], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            // console.log(result[0]);
            // res.send(result[0]);
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               console.log(result);
               return res.status(400).send("ไม่มีอีเมลนี้ในระบบ");
            } else {
               // Username ไม่ได้ถูกปิดการใช้งาน
               // FIXME อาจมีการแก้ไขในอนาคต
               if (result[0].sta_id === 2) {
                  return res.status(400).send("ผู้ใช้ถูกปิดการใช้งาน ");
               }
               console.log(result[0]);
               res.send(result[0]);
            }
         }
      });
   } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
   }
};

exports.change_password = async (req, res) => {
   try {
      const mem_user = req.body.mem_user;
      const mem_pwd = req.body.mem_pwd;
      console.log("change_password : ", req.body);
      db.query("SELECT mem_pwd,mem_tal FROM tbl_member WHERE mem_user = ?", [mem_user], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            // console.log(result[0]);
            // res.send(result[0]);
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               console.log(result);
               return res.status(400).send("กรุณากรอกข้อมูล");
            } else {
               // Username ไม่ได้ถูกปิดการใช้งาน
               // FIXME อาจมีการแก้ไขในอนาคต
               if (result[0].sta_id === 2) {
                  return res.status(400).send("ผู้ใช้ถูกปิดการใช้งาน ");
               }
               console.log(result[0]);
               const isMatch = await bcrypt.compare(mem_pwd, result[0].mem_pwd);
               console.log(isMatch);
               if (!isMatch) {
                  return res.status(400).send("รหัสผ่านไม่ถูกต้อง!!!");
               }
               res.send(result[0].mem_tal);
            }
         }
      });
   } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
   }
};

exports.new_password = async (req, res) => {
   try {
      const { mem_pwd, mem_tal } = req.body;

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(mem_pwd, salt);
      console.log("Forgot_Password : ", req.body, passwordHash);
      db.query("UPDATE tbl_member SET mem_pwd = ? WHERE mem_tal = ?", [passwordHash, mem_tal], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            res.send("บันทึกรหัสผ่านใหม่สำเร็จ");
         }
      });
   } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
   }
};

//GET
exports.listUser = async (req, res) => {
   try {
      res.send(req.body);
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

//PUT
exports.editUser = async (req, res) => {
   try {
      res.send(req.body);
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};

//DELETE
exports.deleteUser = async (req, res) => {
   try {
      res.send(req.body);
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!!!");
   }
};
