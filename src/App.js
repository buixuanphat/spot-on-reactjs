import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './screen/Admin'
import User from './screen/User'
import RegisterOrganizer from './screen/RegisterOrganizer'
import Login from './screen/Login'
import UserDetail from './screen/UserDetail'
import Organizer from './screen/Organizer'
import OrganizerDetail from './screen/OrganizerDetail'
import RegisterEvent from './screen/RegisterEvent'
import Event from './screen/Event'
import Index from './screen/Index'
import EventDetail from './screen/EventDetails'
import Merchandise from './screen/Merchandise'
import CreateMerchandise from './screen/CreateMerchandise'
import Voucher from './screen/Voucher'
import { useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer'
import cookie from 'react-cookies'
import { MyDispatchContext, MyUserContext } from './Contexts';
import Header from './components/Header';
import Footer from './components/Footer';
import EventManger from './screen/EventManager';
import MerchandiseDetail from './screen/MerchandiseDetails';
import CreateVoucher from './screen/CreateVoucher';
import VoucherDetails from './screen/VoucherDetails';
import CreateUser from './screen/CreateUser';
import Stats from './screen/Stats';
import PostManager from './screen/PostManger';
import PostDetails from './screen/PostDetails';
import TicketInfo from './screen/TicketInfo';

function App() {

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load('user'));
  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route path='/admin' element={<Admin />} />
              <Route path='/users' element={<User />} />
              <Route path='/log-in' element={<Login />} />
              <Route path='/users/:id' element={<UserDetail />} />
              <Route path='/users/create' element={<CreateUser />} />


              <Route path='/organizers/register' element={<RegisterOrganizer />} />
              <Route path='/organizers' element={<Organizer />} />
              <Route path='/organizers/:id' element={<OrganizerDetail />} />


              <Route path='/events/register' element={<RegisterEvent />} />
              <Route path='/events' element={<Event />} />
              <Route path='/' element={<Index />} />
              <Route path='/events/:id' element={<EventDetail />} />
              <Route path='/events-manager' element={<EventManger />} />
              <Route path='/events-ticket/:eventId' element={<TicketInfo />} />


              <Route path='/merchandises' element={<Merchandise />} />
              <Route path='/merchandises/create' element={<CreateMerchandise />} />
              <Route path='/merchandises/:id' element={<MerchandiseDetail />} />


              <Route path='/vouchers' element={<Voucher />} />
              <Route path='vouchers/create' element={<CreateVoucher />} />
              <Route path='vouchers/:id' element={<VoucherDetails />} />


              <Route path='/stats' element={<Stats />} />

              <Route path='/posts' element={<PostManager />} />
              <Route path='/posts/:id' element={<PostDetails />} />

            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>

  );
}

export default App;
