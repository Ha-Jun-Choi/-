import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SuggestionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
        setError('제목, 내용, 작성자는 필수 입력 항목입니다.');
        return;
      }
      
      // 서버가 실행 중인지 확인
      try {
        await axios.get('/api/suggestions');
      } catch (err) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        return;
      }

      // axios 요청에서 전체 URL 대신 상대 경로 사용
      const response = await axios.post('/api/suggestions', formData);  // response 변수 추가
      
      console.log('서버 응답:', response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/suggestions');
      }, 2000);
    } catch (err) {
      console.error('에러 상세:', err);
      if (!err.response) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setError(err.response?.data?.message || '건의사항 제출에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          건의사항 작성
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            건의사항이 성공적으로 제출되었습니다!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="제목"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="내용"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="작성자"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              제출하기
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SuggestionForm;
