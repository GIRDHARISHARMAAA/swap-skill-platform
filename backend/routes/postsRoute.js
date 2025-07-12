import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getAllblogs, postblog,deleteBlog } from "../controllers/postsController.js";
import { singleUploader } from "../middleware/multer.js";




const router = express.Router();



router.route("/post").post(singleUploader,isAuthenticated,postblog);
router.route("/get").get( isAuthenticated,getAllblogs);
router.route("/delete/:id").delete( isAuthenticated,deleteBlog);

export default router;