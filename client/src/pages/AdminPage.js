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
  InputLabel,
  Divider,
  CircularProgress // CircularProgress 임포트 추가
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
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // 공지사항 상태 추가
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true); // 공지사항 로딩 상태
  const [noticeError, setNoticeError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null); // 수정할 공지사항 상태
  const [editNoticeTitle, setEditNoticeTitle] = useState(''); // 수정 모달 제목 상태
  const [editNoticeContent, setEditNoticeContent] = useState(''); // 수정 모달 내용 상태

  useEffect(() => {
    if (isAuthenticated) {
      fetchSuggestions();
      fetchNotices(); // 인증되면 공지사항도 불러오도록 추가
    }
  }, [isAuthenticated]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('/api/suggestions');
      setSuggestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('건의사항을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 공지사항 불러오는 함수 추가
  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices');
      setNotices(response.data);
      setLoadingNotices(false);
    } catch (err) {
      setNoticeError('공지사항을 불러오는데 실패했습니다.');
      setLoadingNotices(false);
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

  const handleDelete = async (suggestionId) => {
    try {
      await axios.delete(`/api/suggestions/${suggestionId}`);
      fetchSuggestions();
    } catch (err) {
      setError('삭제에 실패했습니다.');
    }
  };

  const handleResponseSubmit = async () => {
    try {
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

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      await axios.post('/api/notices', {
        title: noticeTitle,
        content: noticeContent
      });
      setNoticeTitle('');
      setNoticeContent('');
      alert('공지사항이 등록되었습니다.');
      fetchNotices(); // 등록 후 공지사항 목록 새로고침
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert('공지사항 등록에 실패했습니다.');
    }
  };

  // 공지사항 수정 모달 열기
  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setEditNoticeTitle(notice.title);
    setEditNoticeContent(notice.content);
  };

  // 공지사항 수정 저장
  const handleSaveEditedNotice = async () => {
    if (!selectedNotice) return;
    try {
      await axios.put(`/api/notices/${selectedNotice._id}`, {
        title: editNoticeTitle,
        content: editNoticeContent
      });
      alert('공지사항이 수정되었습니다.');
      setSelectedNotice(null); // 모달 닫기
      fetchNotices(); // 수정 후 공지사항 목록 새로고침
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  // 공지사항 삭제
  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/notices/${noticeId}`);
        alert('공지사항이 삭제되었습니다.');
        fetchNotices(); // 삭제 후 공지사항 목록 새로고침
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        alert('공지사항 삭제에 실패했습니다.');
      }
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

        {/* 공지사항 작성 폼 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            공지사항 작성
          </Typography>
          <form onSubmit={handleNoticeSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="내용"
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              공지사항 등록
            </Button>
          </form>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 공지사항 목록 (관리자용) */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            등록된 공지사항
          </Typography>
          {loadingNotices ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : noticeError ? (
            <Alert severity="error" sx={{ mt: 4 }}>
              {noticeError}
            </Alert>
          ) : notices.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              아직 등록된 공지사항이 없습니다.
            </Typography>
          ) : (
            notices.map((notice) => (
              <Card key={notice._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {notice.title}
                    </Typography>
                    <Box> {/* 수정/삭제 버튼을 담을 Box 추가 */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditNotice(notice)} // 수정 버튼
                      >
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteNotice(notice._id)} // 삭제 버튼
                      >
                        삭제
                      </Button>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    작성자: {notice.author} | 날짜: {new Date(notice.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {notice.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>


        <Divider sx={{ my: 3 }} />

        {/* 건의사항 목록 */}
        <Box sx={{ mt: 2 }}>
           <Typography variant="h6" gutterBottom>
            건의사항 목록
          </Typography>
          {loading ? ( // 건의사항 로딩 상태 사용
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : suggestions.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              아직 등록된 건의사항이 없습니다.
            </Typography>
          ) : (
            suggestions.map((suggestion) => (
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
            ))
          )}
        </Box>

        {/* 건의사항 답변 모달 */}
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

        {/* 공지사항 수정 모달 */}
        <Dialog open={!!selectedNotice} onClose={() => setSelectedNotice(null)}>
          <DialogTitle>공지사항 수정</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="제목"
              type="text"
              fullWidth
              variant="standard"
              value={editNoticeTitle}
              onChange={(e) => setEditNoticeTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="내용"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="standard"
              value={editNoticeContent}
              onChange={(e) => setEditNoticeContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedNotice(null)}>취소</Button>
            <Button onClick={handleSaveEditedNotice}>저장</Button>
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
