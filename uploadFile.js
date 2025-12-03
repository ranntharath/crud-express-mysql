import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./upload"),
  filename: (req, file, cb) => {
    // const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({storage})