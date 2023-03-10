const auth = require("../../../middlewares/auth");
const { getAdmins, getAdminById, createAdmin, adminLogin, updateAdmin, deleteAdmin, authAdmin } = require("../controller/admin.controller");

let router = require("express").Router();

router.post("/login", adminLogin);
router.get("/auth", authAdmin);
router.get("/:id", auth, getAdminById);
router.patch("/:id", auth, updateAdmin);
router.delete("/:id", auth, deleteAdmin);
router.post("/", auth, createAdmin);
router.get("/", auth, getAdmins);

module.exports = router;