import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">
              마음의 소리함
            </Button>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/suggestions">
            건의사항 목록
          </Button>
          <Button color="inherit" component={RouterLink} to="/suggestions/new">
            건의하기
          </Button>
          <Button color="inherit" component={RouterLink} to="/admin">
            관리자
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 