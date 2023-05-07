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

router.post('/v2upload', upload.single('image'), async (req, res) => {
    try {
        const { createWorker } = Tesseract;
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        await worker.setParameters({
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
          })
        
        const image = req.file.buffer;

        const {data} = await worker.recognize(image);
        return res.send(data.text);
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;
