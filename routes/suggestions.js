const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');

// 모든 건의사항 조회
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새로운 건의사항 생성
router.post('/', async (req, res) => {
  const suggestion = new Suggestion({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    grade: req.body.grade,
    class: req.body.class
  });

  try {
    const newSuggestion = await suggestion.save();
    res.status(201).json(newSuggestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 건의사항 상태 업데이트
router.patch('/:id', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: '건의사항을 찾을 수 없습니다.' });
    }

    if (req.body.status) suggestion.status = req.body.status;
    if (req.body.response) suggestion.response = req.body.response;
    suggestion.updatedAt = Date.now();

    const updatedSuggestion = await suggestion.save();
    res.json(updatedSuggestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 건의사항 삭제
router.delete('/:id', async (req, res) => {
  try {
    const result = await Suggestion.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '건의사항을 찾을 수 없습니다.' });
    }
    res.json({ message: '건의사항이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 