const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// 공지사항 목록 조회
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 공지사항 작성
router.post('/', async (req, res) => {
  const notice = new Notice({
    title: req.body.title,
    content: req.body.content
  });

  try {
    const newNotice = await notice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 공지사항 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: '공지사항이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 공지사항 수정 (PUT 또는 PATCH 사용 가능, 여기서는 PUT 사용)
router.put('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (notice == null) {
      return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
    }

    if (req.body.title != null) {
      notice.title = req.body.title;
    }
    if (req.body.content != null) {
      notice.content = req.body.content;
    }

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;