const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const suggestionsRouter = require('./routes/suggestions');
const noticesRouter = require('./routes/notices'); // notices 라우터 불러오기

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mind-voice-box', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// API 라우트
app.use('/api/suggestions', suggestionsRouter);
app.use('/api/notices', noticesRouter); // /api/notices 경로로 오는 요청을 noticesRouter가 처리하도록 설정

// 프로덕션 환경에서 React 앱 서빙
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // 개발 환경에서도 React 앱 서빙
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// 포트 설정
const PORT = process.env.PORT || 5001;  // 5000에서 5001로 변경
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});