const express = require("express")
const controls = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const multer = require("multer")
const path = require("path")
const router = express.Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.originalname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

router.post("/create", controls.createUser)
router.post("/login", controls.login)
router.get("/user", auth, controls.getuser)
router.post("/add", auth, upload.single("file"), controls.birthnote)
router.put("/changes", auth, upload.single("file"), controls.update)
router.delete("/remove", auth, controls.RemoveRemainder)
router.get("/upcoming", auth, controls.upcoming)
router.get("/today", auth, controls.today)
router.post("/logout", auth, controls.logout)
router.get('/cronjob_1', controls.cronjob_1)
router.get('/cronjob_2', controls.cronjob_2)

module.exports = router;