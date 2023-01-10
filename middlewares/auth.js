// const { default: LocaleProvider } = require("antd/lib/locale-provider");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
   try {
      // NOTE headers[ในนี้ใช้ตัวพิมพ์เล็กเท่านั้น]
      const token = req.headers["authtoken"];
      if (!token) {
         return res.status(401).send("No Token, Authorization Denied!!!");
      }
      const decoded = jwt.verify(token, "jwtSecret");
      req.user = decoded.user;
      console.log("middleware", decoded);
      next();
   } catch (error) {
      console.log(error);
      return res.status(401).send("Token Invalid!!!");
   }
};

exports.officerCheck = async (req, res, next) => {
   try {
      //NOTE req.user มาจากการ decoded token จาก midleware auth
      const mem_id = req.user.mem_id;
      console.log("adminCheck mem_id : ", mem_id);
      await db.query("SELECT * FROM tbl_member WHERE mem_id = ?", [mem_id], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            // console.log(result[0]);
            // res.send(result[0]);
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               //console.log(result);
               return res.status(400).send("This username does not exist. ");
            } else {
               // Username ไม่ได้ถูกปิดการใช้งาน
               // FIXME อาจมีการแก้ไขในอนาคต
               if (result[0].sta_id === 2) {
                  return res.status(400).send("This Username Disable. ");
               } else {
                  console.log("adminCheck DB Tbl_mem", result[0].lv_id);
                  if (result[0].lv_id === 1 || result[0].lv_id === 2) {
                     next();
                  } else {
                     return res.status(403).send("Admin Access Denied");
                     // res.status(403).send(err, "");
                  }
               }
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(401).send("Token Invalid!!!");
   }
};

exports.adminCheck = async (req, res, next) => {
   try {
      //NOTE req.user มาจากการ decoded token จาก midleware auth
      const mem_id = req.user.mem_id;
      console.log("adminCheck mem_id : ", mem_id);
      await db.query("SELECT * FROM tbl_member WHERE mem_id = ?", [mem_id], async (err, result) => {
         if (err) {
            console.log(err);
            return res.status(400).send("Query Database ERROR!!!");
         } else {
            // console.log(result[0]);
            // res.send(result[0]);
            if (result[0] == null) {
               // Username มีข้อมูลหรือไม่
               //console.log(result);
               return res.status(400).send("This username does not exist. ");
            } else {
               // Username ไม่ได้ถูกปิดการใช้งาน
               // FIXME อาจมีการแก้ไขในอนาคต
               if (result[0].sta_id === 2) {
                  return res.status(400).send("This Username Disable. ");
               } else {
                  console.log("adminCheck DB Tbl_mem", result[0].lv_id);
                  if (result[0].lv_id === 1) {
                     next();
                  } else {
                     return res.status(403).send("Admin Access Denied");
                     // res.status(403).send(err, "");
                  }
               }
            }
         }
      });
   } catch (error) {
      console.log(error);
      res.status(401).send("Token Invalid!!!");
   }
};
