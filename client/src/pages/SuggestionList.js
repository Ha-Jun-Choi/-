import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

function SuggestionList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchSuggestions();
  }, []);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          건의사항 목록
        </Typography>

        {suggestions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            아직 등록된 건의사항이 없습니다.
          </Typography>
        ) : (
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
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default SuggestionList;
