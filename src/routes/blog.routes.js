import { Router } from "express";
import { 
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    updateBlog, 
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);


router.route('/c').post(createBlog);
router.route('/:blogId')
        .get(getBlogById)
        .delete(deleteBlog)
        .patch(updateBlog);

router.route('/').get(getAllBlogs);        

export default router;