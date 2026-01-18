import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useState } from 'react';
import { MyDispatchContext, MyUserContext } from '../Contexts';
import { AppBar, Chip, Drawer } from '@mui/material';
import { Avatar, Stack } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DiscountIcon from '@mui/icons-material/Discount';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import PublicIcon from '@mui/icons-material/Public';

const Header = () => {

  const user = useContext(MyUserContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigate();

  return (
    user == null ? <></> :
      <Box>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                SpotOn
              </Typography>

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  {user && <Avatar size='sm' src={user.avatar} />}
                </IconButton>
              </Box>

            </Toolbar>
          </AppBar>
        </Box>
        <Drawer
          open={openDrawer}
          onClose={() => { setOpenDrawer(false) }}>
          <div style={{ width: '250px' }}>
            <Stack direction='column'>

              {/* ADMIN */}
              {user && user.role === 'admin' &&
                <Chip
                  icon={<GroupIcon />}
                  label="Người dùng"
                  variant="outlined"
                  onClick={() => {
                    nav('/users')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }

              {user && user.role === 'admin' &&
                <Chip
                  icon={<CorporateFareIcon />}
                  label="Ban tổ chức"
                  variant="outlined"
                  onClick={() => {
                    nav('/organizers')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }

              {user && (user.role === 'admin') &&
                <Chip
                  icon={<EventIcon />}
                  label="Sự kiện"
                  variant="outlined"
                  onClick={() => {
                    nav('/events-manager')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }

              {user && (user.role === 'admin') &&
                <Chip
                  icon={<BarChartIcon />}
                  label="Thống kê"
                  variant="outlined"
                  onClick={() => {
                    nav('/stats')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }





              {/* ORGANIZER */}
              {user && (user.role === 'organizer') &&
                <Typography variant='h5' sx={{ mx: '30px', mt: '30px' }} >
                  Ban tổ chức
                </Typography>}

              {user && (user.role === 'organizer') &&
                <Chip
                  icon={<EventIcon />}
                  label="Sự kiện"
                  variant="outlined"
                  onClick={() => {
                    nav('events')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />

              }
              {user && (user.role === 'organizer') &&
                <Chip
                  icon={<StorefrontIcon />}
                  label="Đồ lưu niệm"
                  variant="outlined"
                  onClick={() => {
                    nav('merchandises')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />}


              {user && (user.role === 'organizer') &&
                <Chip
                  icon={<DiscountIcon />}
                  label="Mã giảm giá"
                  variant="outlined"
                  onClick={() => {
                    nav('vouchers')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }



              {/* STAFF */}
              {user && user.role === 'staff' &&
                <Chip
                  icon={<CorporateFareIcon />}
                  label="Ban tổ chức"
                  variant="outlined"
                  onClick={() => {
                    nav('/organizers')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }

              {user && (user.role === 'staff') &&
                <Chip
                  icon={<EventIcon />}
                  label="Sự kiện"
                  variant="outlined"
                  onClick={() => {
                    nav('/events-manager')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }

              {user && (user.role === 'staff') &&
                <Chip
                  icon={<PublicIcon />}
                  label="Bài viết"
                  variant="outlined"
                  onClick={() => {
                    nav('/posts')
                  }}
                  sx={{ my: '10px', mx: '30px' }} />
              }



              <Chip
                color='error'
                icon={<LogoutIcon />}
                label="Đăng xuất"
                variant="outlined"
                onClick={() => {
                  dispatch({ 'type': 'log-out' });
                  nav('/log-in');
                }}
                sx={{ my: '10px', mx: '30px' }} />
            </Stack>
          </div>
        </Drawer>
      </Box>
  );
}
export default Header;