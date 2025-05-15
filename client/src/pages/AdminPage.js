import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import axios from 'axios';

function AdminPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (isAuthenticated) {
      fetchSuggestions();
    }
  }, [isAuthenticated]);

  const fetchSuggestions = async () => {
    try {
      // 변경 전: http://localhost:5000/api/suggestions
      const response = await axios.get('/api/suggestions');
      setSuggestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('건의사항을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // 실제로는 서버에서 인증을 처리해야 합니다
    // 아래에서 비밀번호 변경
    if (password === 'gram#') {
      setIsAuthenticated(true);
    } else {
      setError('비밀번호가 틀렸습니다.');
    }
  };

  const handleStatusChange = async (suggestionId, newStatus) => {
    try {
      // 변경 전: http://localhost:5000/api/suggestions/${suggestionId}
      await axios.patch(`/api/suggestions/${suggestionId}`, {
        status: newStatus
      });
      fetchSuggestions();
    } catch (err) {
      setError('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (suggestionId) => {
    try {
      // 변경 전: http://localhost:5000/api/suggestions/${suggestionId}
      await axios.delete(`/api/suggestions/${suggestionId}`);
      fetchSuggestions();
    } catch (err) {
      setError('삭제에 실패했습니다.');
    }
  };

  const handleResponseSubmit = async () => {
    try {
      // 변경 전: http://localhost:5000/api/suggestions/${selectedSuggestion._id}
      await axios.patch(`/api/suggestions/${selectedSuggestion._id}`, {
        response,
        status
      });
      setSelectedSuggestion(null);
      setResponse('');
      fetchSuggestions();
    } catch (err) {
      setError('답변 등록에 실패했습니다.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            관리자 로그인
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleLogin}>
            로그인
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 페이지
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {suggestions.map((suggestion) => (
            <Card key={suggestion._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h2">
                    {suggestion.title}
                  </Typography>
                  <Chip
                    label={getStatusLabel(suggestion.status)}
                    color={getStatusColor(suggestion.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  작성자: {suggestion.author}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {suggestion.content}
                </Typography>

                {suggestion.response && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      답변
                    </Typography>
                    <Typography variant="body2">
                      {suggestion.response}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedSuggestion(suggestion);
                      setResponse(suggestion.response || '');
                      setStatus(suggestion.status);
                    }}
                  >
                    답변하기
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(suggestion._id)}
                  >
                    삭제
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog open={!!selectedSuggestion} onClose={() => setSelectedSuggestion(null)}>
          <DialogTitle>답변 작성</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="답변 내용"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>상태</InputLabel>
              <Select
                value={status}
                label="상태"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="pending">검토중</MenuItem>
                <MenuItem value="in-progress">처리중</MenuItem>
                <MenuItem value="completed">완료</MenuItem>
                <MenuItem value="rejected">반려</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedSuggestion(null)}>취소</Button>
            <Button onClick={handleResponseSubmit}>저장</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'default';
    case 'in-progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return '검토중';
    case 'in-progress':
      return '처리중';
    case 'completed':
      return '완료';
    case 'rejected':
      return '반려';
    default:
      return status;
  }
};

export default AdminPage;
