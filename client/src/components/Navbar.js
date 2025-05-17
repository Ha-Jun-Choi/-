import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // 네비게이션 링크 목록
  const pages = [
    { name: '건의사항 목록', path: '/suggestions' },
    { name: '건의하기', path: '/suggestions/new' },
    { name: '공지사항', path: '/notices' },
    { name: '관리자', path: '/admin' },
    { name: '주의사항', path: '/guidelines' },
  ];

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          {/* 데스크탑 로고 (왼쪽) */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center', // 로고와 텍스트를 세로 중앙 정렬
            }}
          >
            <img
              src="/logo512.png"
              alt="마음의 소리함 로고"
              style={{
                height: '64px',
                marginRight: '10px'
              }}
            />
            마음의 소리함
          </Typography>

          {/* 모바일 로고 (왼쪽) */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center', // 로고와 텍스트를 세로 중앙 정렬
            }}
          >
            <img
              src="/logo512.png"
              alt="마음의 소리함 로고"
              style={{
                height: '64px',
                marginRight: '8px'
              }}
            />
            마음의 소리함
          </Typography>

          {/* 로고와 메뉴 사이에 공간을 채워 메뉴를 오른쪽으로 밀어내는 Box */}
          <Box sx={{ flexGrow: 1 }} />

          {/* 데스크탑 메뉴 버튼 (오른쪽) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}> {/* md 이상에서만 표시 */}
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#333', display: 'block' }} // 글자색 유지
                component={RouterLink}
                to={page.path}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* 모바일 메뉴 아이콘 (오른쪽) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}> {/* xs에서만 표시 */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={RouterLink} to={page.path}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
