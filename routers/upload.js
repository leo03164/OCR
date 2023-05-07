const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { buffer } = req.file;
        Tesseract.recognize(
            buffer,
            'eng',
            { logger: m => console.log(m) }
          ).then(({ data: { text } }) => {
            console.log(text);
            return res.json({ text });
          })
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

// 使用 Express 路由處理 POST 請求，並將上傳的單個圖片作為 'image' 的名稱參數
router.post('/v2upload', upload.single('image'), async (req, res) => {
    try {
        // 從 Tesseract 包中創建一個 worker 對象
        const { createWorker } = Tesseract;
        const worker = await createWorker();
        // 加載 Tesseract 語言庫
        await worker.loadLanguage('eng');
        // 初始化語言庫
        await worker.initialize('eng');
        
        // 設置 Tesseract 的參數
        await worker.setParameters({
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
          })
        
        // 從上傳的圖片中讀取圖像數據
        const image = req.file.buffer;

        // 使用 Tesseract 進行圖像識別
        const {data} = await worker.recognize(image);
        // 將識別結果發送回客戶端
        return res.send(data.text);
    } catch (error) {
        // 如果發生錯誤，則將錯誤消息發送回客戶端
        return res.send(error);
    }
});


module.exports = router;
