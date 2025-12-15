import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useState } from 'react';
import { MyDispatchContext, MyUserContext } from '../Contexts';
import { AppBar, Drawer } from '@mui/material';
import { Avatar, Button, Stack } from '@mui/joy';
import { Link, useNavigate } from 'react-router-dom';
import Merchandise from '../screen/Merchandise';
import Event from '../screen/Event';
import Organizer from '../screen/Organizer';
import User from '../screen/User';
import Voucher from '../screen/Voucher';


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
        <Drawer open={openDrawer} onClose={() => { setOpenDrawer(false) }}>
          <Button
            color="danger"
            onClick={() => {
              dispatch({ 'type': 'log-out' });
              nav('/log-in');
            }}
          >Đăng xuất</Button>
          <Stack direction='column'>

            {user && user.role === 'admin' &&
              <Link
                component={<User />}
                to="/users"
                color="primary"
                underline="hover"
                variant="plain"
              >
                Người dùng
              </Link>
            }
            {user && user.role === 'admin' &&
              <Link
                component={<Organizer />}
                to='/organizers'
                color="primary"
                underline="hover"
                variant="plain">
                Ban tổ chức
              </Link>
            }
            {user && (user.role === 'organizer' || user.role === 'admin') &&
              <Link
                component={<Event />}
                to='/events'
                color="primary"
                underline="hover"
                variant="plain">
                Sự kiện
              </Link>
            }
               {user && (user.role === 'organizer' || user.role === 'admin') &&
              <Link
                component={<Merchandise />}
                to='/merchandises'
                color="primary"
                underline="hover"
                variant="plain">
                Đồ lưu niệm
              </Link>
            }
                   {user && (user.role === 'organizer' || user.role === 'admin') &&
              <Link
                component={<Voucher />}
                to='/vouchers'
                color="primary"
                underline="hover"
                variant="plain">
                Mã giảm giá
              </Link>
            }
          </Stack>
        </Drawer>
      </Box>
  );
}
export default Header;