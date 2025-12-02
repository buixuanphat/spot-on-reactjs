import cookie from 'react-cookies'

export default (current, action) =>
{
    switch(action.type)
    {
        case 'log-in':
            cookie.save('user', action.payload)
            return action.payload;
        case 'log-out':
            cookie.remove('token');
            cookie.remove('user');
            return null;
    }
    return current;
}