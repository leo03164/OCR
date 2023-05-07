const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 設定儲存上傳檔案的資料夾

const PORT = process.env.PORT || 3000;

const uploadRouter = require('./routers/upload.js');
app.use('/', uploadRouter);

app.post('/test', upload.single('image'), (req, res) => {
  console.log(req.file); // 上傳的檔案會被儲存在 req.file 中
  return res.send('上傳成功！');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
