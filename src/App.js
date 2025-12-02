import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Admin from './components/Admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './components/User';
import Login from './components/Login';
import { MyDispatchContext, MyUserContext } from './Contexts';
import { useReducer } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import cookie from 'react-cookies'
import UserDetail from './components/UserDetail';
import Organizer from './components/Organizer';
import OrganizerDetail from './components/OrganizerDetail';
import RegisterOrganizer from './components/RegisterOrganizer';
import RegisterEvent from './components/RegisterEvent';
import Event from './components/Event';


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
              <Route path='/organizers/register' element={<RegisterOrganizer />} />
              <Route path='/log-in' element={<Login />} />
              <Route path='/users/:id' element={<UserDetail/>}/>
              <Route path='/organizers' element={<Organizer/>}/>
              <Route path='/organizers/:id' element={<OrganizerDetail/>}/>
              <Route path='/event/register' element={<RegisterEvent/>}/>
              <Route path='/events' element={<Event/>}/>
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>

  );
}

export default App;
