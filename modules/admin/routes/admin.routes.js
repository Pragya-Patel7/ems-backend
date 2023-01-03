const auth = require("../../../middlewares/auth");
const { getAdmins, getAdminById, createAdmin, adminLogin, updateAdmin, deleteAdmin } = require("../controller/admin.controller");

let router = require("express").Router();

router.get("/", getAdmins);
router.get("/:id", auth, getAdminById);
router.post("/", createAdmin);
router.patch("/:id", auth, updateAdmin);
router.delete("/:id", auth, deleteAdmin);
router.post("/login", adminLogin);

module.exports = router;