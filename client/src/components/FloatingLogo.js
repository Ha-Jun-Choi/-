import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(3),
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

function FloatingLogo() {
  const handleClick = () => {
    window.open('https://kisy.or.kr', '_blank');
  };

  return (
    <Box>
      <Tooltip title="KISY 홈페이지 방문하기" placement="left">
        <FloatingButton
          onClick={handleClick}
          aria-label="KISY 홈페이지"
        >
          <img
            src="/logo512.png"
            alt="KISY 로고"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain'
            }}
          />
        </FloatingButton>
      </Tooltip>
    </Box>
  );
}

export default FloatingLogo;