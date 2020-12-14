import { register, login, landingData } from "../../services/userService.js";


const getLanding = async({render}) => {
  const data = await landingData();
    render('landing.ejs', data);
}

const showRegistrationForm = ({render}) => {
    render('register.ejs', { errors: [], email: '' } );
}

const showLoginForm = async({render}) => {
        render('login.ejs', { errors: [] } );
}

const registration = async({request, response, render}) => {
    await register(request, response, render, session);
}

const authenticate = async({request, response, render, session}) => {
    await login(request, response, render, session);
}

const logged = async(session) => {
    const authenticated = await session.get('authenticated');
    return authenticated;
  }
  
  const logout = async({session, response}) => {
    if (await logged(session)) {
      const user = await session.get('user');
      if (user) {
        await session.set('user', null);
        await session.set('authenticated', false);
        response.redirect('/auth/login');
      }
    }
  }

  const getLogout = async({render, session, response}) => {
      if (await session.get('authenticated') === true) render('logout.ejs');
      else response.redirect('/auth/login');
  }


 
export { registration, authenticate, showRegistrationForm, showLoginForm, getLanding, logout, getLogout};