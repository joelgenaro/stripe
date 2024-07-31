const express = require("express");
const path = require("path");
const multer = require("multer");
const yearUpload = multer({
    storage: multer.diskStorage({
        destination: "public/uploads/years",
        filename: (req, file, cb) => {
            cb(null, "year_" + Date.now() + path.extname(file.originalname));
        }
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/uploads/questions'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
});
const questionImgUpload = multer({ storage: storage });

const router = express.Router();
const AuthCtrl = require("../../controllers/AuthController");
const MembershipCtrl = require("../../controllers/MembershipController");
const YearCtrl = require("../../controllers/YearController");
const SubjectCtrl = require("../../controllers/SubjectController");
const ModuleCtrl = require("../../controllers/ModuleController");
const TopicCtrl = require("../../controllers/TopicController");
const SubTopicCtrl = require("../../controllers/SubTopicController");
const MessageCtrl = require("../../controllers/MessageController");
const BillingCtrl = require("../../controllers/BillingController");
const PrivateBillingCtrl = require("../../controllers/PrivateBillingController");
const InvoiceCtrl = require("../../controllers/InvoiceController");
const AdminUserCtrl = require("../../controllers/admin/UserController");
const AdminStaffCtrl = require("../../controllers/admin/StaffController");
const AdminYearCtrl = require("../../controllers/admin/YearController");
const AdminSubjectCtrl = require("../../controllers/admin/SubjectController");
const AdminModuleCtrl = require("../../controllers/admin/ModuleController");
const AdminTopicCtrl = require("../../controllers/admin/TopicController");
const AdminSubTopicCtrl = require("../../controllers/admin/SubTopicController");
const AdminQuestionCtrl = require("../../controllers/admin/QuestionController");
const AdminSeoCtrl = require("../../controllers/admin/SeoController");
const AdminMembershipPricingCtrl = require("../../controllers/admin/PricingController");
const AdminMessageCtrl = require("../../controllers/admin/MessageController");
const AdminTransactionCtrl = require("../../controllers/admin/TransactionController");

const { normalMiddleware, userMiddleware, staffMiddleware, adminMiddleware } = require("../../middlewares/AuthMiddleware");

router.post("/register", AuthCtrl.register);
router.post("/premium-register", AuthCtrl.premiumRegister);
router.post("/premiun-google-register", AuthCtrl.googlePremiumSignUp);

router.post("/register/google", AuthCtrl.googleSignUp);
router.get("/verify-email/:token", AuthCtrl.verifyEmail);
router.get("/verify-changed-email/:token", AuthCtrl.verifyChangedEmail);
router.post("/forgot-password", AuthCtrl.forgotPwd);
router.post("/reset-password", AuthCtrl.resetPwd);

router.get("/verify-expire-time/:token", AuthCtrl.verifyExpireTime);

router.post("/login", AuthCtrl.login);
router.post("/login/google", AuthCtrl.googleLogin);
router.post("/login-manual", AuthCtrl.manualLogin);
router.put("/users/:id", userMiddleware, AuthCtrl.updateProfile);
router.patch("/users/:id", userMiddleware, AuthCtrl.updatePassword);
router.get("/memberships", MembershipCtrl.fetch);
router.get("/memberships/get-membership-price", MembershipCtrl.getPrice);
router.get("/memberships/:id", MembershipCtrl.fetchById);
router.get('/my-memberships', userMiddleware, MembershipCtrl.getPurchasedMemberships);
router.get('/my-invoices', userMiddleware, MembershipCtrl.getInvoices);
router.get('/check-membership', userMiddleware, MembershipCtrl.checkPurchasedMembership);
router.get('/check-membership-slug', userMiddleware, MembershipCtrl.checkPurchasedMembershipBySlug);
router.get("/years", YearCtrl.fetch);
router.get("/subjects/get-subject-by-slug", SubjectCtrl.fetchBySlug);
router.get("/subjects/:id", SubjectCtrl.fetchById);
router.get("/modules/get-module-by-slug", ModuleCtrl.fetchBySlug);
router.get("/modules/:id", ModuleCtrl.fetchById);
router.get("/topics/get-topic-by-slug", TopicCtrl.fetchBySlug);
router.get("/topics/:id", TopicCtrl.fetchById);
router.get("/sub-topics/get-subtopic-by-slug", SubTopicCtrl.fetchBySlug);
router.get("/sub-topics/:id", SubTopicCtrl.fetchById);
router.post("/message", MessageCtrl.create);
router.post("/billing/invoice", BillingCtrl.invoice);
router.post("/billing/:gateway", normalMiddleware, BillingCtrl.purchase);
router.get("/billing/:gateway/return", normalMiddleware, BillingCtrl.gatewayReturn);
router.post("/billing/:gateway/webhook", BillingCtrl.webhook);
// router.post("/private-billing/invoice", userMiddleware, PrivateBillingCtrl.invoice);
router.post("/private-billing", userMiddleware, PrivateBillingCtrl.emailMe);
router.post("/private-billing/:gateway", userMiddleware, PrivateBillingCtrl.purchase);


router.get("/private-billing/:gateway/return", userMiddleware, PrivateBillingCtrl.gatewayReturn);
router.get("/invoices", userMiddleware, InvoiceCtrl.fetch);
router.get("/invoices/:id", userMiddleware, InvoiceCtrl.fetchById);
router.get("/invoices/get-new-invoices/:id", userMiddleware, InvoiceCtrl.fetchByNew);

router.get("/admin/users", staffMiddleware, AdminUserCtrl.fetch);
router.put("/admin/users/me", staffMiddleware, AdminUserCtrl.updateProfile);
router.put("/admin/users/:id", staffMiddleware, AdminUserCtrl.update);
router.put("/admin/users/:id/password", staffMiddleware, AdminUserCtrl.changePassword);
router.get("/admin/users/me", staffMiddleware, AdminUserCtrl.fetchByMe);
router.patch("/admin/users/me", staffMiddleware, AdminUserCtrl.updatePassword);
router.get("/admin/users/:id", staffMiddleware, AdminUserCtrl.fetchById);
router.delete("/admin/users/:id", staffMiddleware, AdminUserCtrl.remove);

router.post("/admin/users/:id/invoice", adminMiddleware, InvoiceCtrl.create);
router.put("/admin/users/:id/invoice", adminMiddleware, InvoiceCtrl.update);
router.delete("/admin/users/:id/invoice/:invoiceId", adminMiddleware, InvoiceCtrl.deleteInvoice);
router.post("/admin/users/:id/membership", adminMiddleware, MembershipCtrl.create);
router.put("/admin/users/:id/membership", adminMiddleware, MembershipCtrl.update);
router.delete("/admin/users/:id/membership/:membershipId", adminMiddleware, MembershipCtrl.deleteMembershipHistory);
router.post("/admin/users/lastInvoice", adminMiddleware, InvoiceCtrl.getLastInvoiceNumber);
router.put("/admin/users/login-mng/:id", staffMiddleware, AdminStaffCtrl.loginMng);

router.get("/admin/staffs", adminMiddleware, AdminStaffCtrl.fetch);
router.get("/admin/staffs/:id", adminMiddleware, AdminStaffCtrl.fetchById);
router.post("/admin/staffs", adminMiddleware, AdminStaffCtrl.create);
router.put("/admin/staffs/:id", adminMiddleware, AdminStaffCtrl.update);
router.put("/admin/staffs/login-mng/:id", adminMiddleware, AdminStaffCtrl.loginMng);
router.put("/admin/staffs/:id/password", adminMiddleware, AdminStaffCtrl.changePassword);
router.delete("/admin/staffs/:id", adminMiddleware, AdminStaffCtrl.remove);

router.get("/admin/years", staffMiddleware, AdminYearCtrl.fetch);
router.get("/admin/years/get-all", staffMiddleware, AdminYearCtrl.fetchAll);
router.get("/admin/years/get-all-populate", staffMiddleware, AdminYearCtrl.fetchAllPopulate);
router.post("/admin/years", staffMiddleware, yearUpload.single("image"), AdminYearCtrl.create);
router.put("/admin/years/:id", staffMiddleware, yearUpload.single("image"), AdminYearCtrl.update);
router.delete("/admin/years/:id", staffMiddleware, AdminYearCtrl.remove);

router.get("/admin/subjects", staffMiddleware, AdminSubjectCtrl.fetch);
router.post("/admin/subjects", staffMiddleware, AdminSubjectCtrl.create);
router.get("/admin/subjects/:id", staffMiddleware, AdminSubjectCtrl.fetchById);
router.put("/admin/subjects/:id", staffMiddleware, AdminSubjectCtrl.update);
router.delete("/admin/subjects/:id", staffMiddleware, AdminSubjectCtrl.remove);

router.get("/admin/modules", staffMiddleware, AdminModuleCtrl.fetch);
router.post("/admin/modules", staffMiddleware, AdminModuleCtrl.create);
router.get("/admin/modules/:id", staffMiddleware, AdminModuleCtrl.fetchById);
router.put("/admin/modules/:id", staffMiddleware, AdminModuleCtrl.update);
router.delete("/admin/modules/:id", staffMiddleware, AdminModuleCtrl.remove);

router.get("/admin/topics", staffMiddleware, AdminTopicCtrl.fetch);
router.post("/admin/topics", staffMiddleware, AdminTopicCtrl.create);
router.get("/admin/topics/:id", staffMiddleware, AdminTopicCtrl.fetchById);
router.put("/admin/topics/:id", staffMiddleware, AdminTopicCtrl.update);
router.delete("/admin/topics/:id", staffMiddleware, AdminTopicCtrl.remove);

router.get("/admin/sub-topics", staffMiddleware, AdminSubTopicCtrl.fetch);
router.post("/admin/sub-topics", staffMiddleware, AdminSubTopicCtrl.create);
router.get("/admin/sub-topics/:id", staffMiddleware, AdminSubTopicCtrl.fetchById);
router.put("/admin/sub-topics/:id", staffMiddleware, AdminSubTopicCtrl.update);
router.delete("/admin/sub-topics/:id", staffMiddleware, AdminSubTopicCtrl.remove);

router.get("/admin/questions", staffMiddleware, AdminQuestionCtrl.fetch);
router.post("/admin/questions", staffMiddleware, AdminQuestionCtrl.create);
router.get("/admin/questions/parents", staffMiddleware, AdminQuestionCtrl.fetchParents);
router.get("/admin/questions/:id", staffMiddleware, AdminQuestionCtrl.fetchById);
router.put("/admin/questions/:id", staffMiddleware, AdminQuestionCtrl.update);
router.delete("/admin/questions/:id", staffMiddleware, AdminQuestionCtrl.remove);
router.post("/admin/questions/image", questionImgUpload.single('file'), AdminQuestionCtrl.uploadImage);

router.get("/admin/seos", staffMiddleware, AdminSeoCtrl.fetch);
router.post("/admin/seos", staffMiddleware, AdminSeoCtrl.create);
router.get("/admin/seos/:id", staffMiddleware, AdminSeoCtrl.fetchById);
router.post("/admin/seos/url", AdminSeoCtrl.fetchByUrl);
router.put("/admin/seos/:id", staffMiddleware, AdminSeoCtrl.update);
router.delete("/admin/seos/:id", staffMiddleware, AdminSeoCtrl.remove);

router.get("/admin/membership-pricing", staffMiddleware, AdminMembershipPricingCtrl.fetch);
router.get('/admin/membership-pricing/:id', staffMiddleware, AdminMembershipPricingCtrl.fetchById);
router.post('/admin/membership-pricing', staffMiddleware, AdminMembershipPricingCtrl.create);
router.put('/admin/membership-pricing/:id', staffMiddleware, AdminMembershipPricingCtrl.update);
router.delete('/admin/membership-pricing/:id', staffMiddleware, AdminMembershipPricingCtrl.remove);

router.get("/admin/messages/get-new-message-nums", adminMiddleware, AdminMessageCtrl.getNewMessageNums);
router.get("/admin/messages", adminMiddleware, AdminMessageCtrl.fetch);
router.put("/admin/messages/:id", adminMiddleware, AdminMessageCtrl.update);
router.delete("/admin/messages/:id", adminMiddleware, AdminMessageCtrl.remove);

router.get("/admin/transactions", staffMiddleware, AdminTransactionCtrl.fetch);
router.get("/admin/transactions/get-statistics", staffMiddleware, AdminTransactionCtrl.getStatistics);

module.exports = router;