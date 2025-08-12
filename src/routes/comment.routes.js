import { Router } from "express";
import { 
    addComment,
    deleteComment,
    getAllComments,
    getCommentById,
    updateComment, 
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route('/:id').post(addComment);
router.route('/:commentId')
        .get(getCommentById)
        .patch(updateComment)
        .delete(deleteComment);

router.route('/').get(getAllComments);
        
export default router; 
