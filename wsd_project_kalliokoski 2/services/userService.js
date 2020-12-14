import { executeQuery } from "../database/database.js";
import { Session } from "../deps.js";
import { bcrypt } from "../deps.js";
import { validate, required, lengthBetween, isEmail, isInt } from "../deps.js";



const createUser = async(email, password) => {
  await executeQuery("INSERT INTO appusers (email, password) VALUES ($1, $2);", email, password);
}

const landingData = async() => {
  let date = new Date();
  date.setDate(date.getDate());
  let yester = new Date();
  yester.setDate(yester.getDate() - 1);
  const yesterday = yester.toISOString().substring(0,10);
  const today = date.toISOString().substring(0,10);

  const yestermorning = await executeQuery("SELECT AVG(rating) FROM stats WHERE date=$1 AND type='morningmood';", yesterday);
  const yesterevening = await executeQuery("SELECT AVG(rating) FROM stats WHERE date=$1 AND type='eveningmood';", yesterday);

  const todaymorning = await executeQuery("SELECT AVG(rating) FROM stats WHERE date=$1 AND type='morningmood';", today);
  const todayevening = await executeQuery("SELECT AVG(rating) FROM stats WHERE date=$1 AND type='eveningmood';", today);

  let aveyester = 0;
  let avetoday = 0;


  if (yestermorning && yestermorning.rowCount > 0) {
    if (yesterevening && yesterevening.rowCount > 0 ) {
      aveyester = (Number(yestermorning.rowsOfObjects()[0].avg) + Number(yesterevening.rowsOfObjects()[0].avg)) / 2;
    }
    else aveyester = Number(yestermorning.rowsOfObjects()[0].avg);
  } else if (yesterevening && yesterevening.rowCount > 0) {
    aveyester = Number(yesterevening.rowsOfObjects()[0].avg);
  }

  if (todaymorning && todaymorning.rowCount > 0) {
    if (todayevening && todayevening.rowCount > 0 ) {
      avetoday = (Number(todaymorning.rowsOfObjects()[0].avg) + Number(todayevening.rowsOfObjects()[0].avg)) / 2;
    }
    else avetoday = Number(todaymorning.rowsOfObjects()[0].avg);
  } else if (todayevening && todayevening.rowCount > 0) {
    avetoday = Number(todayevening.rowsOfObjects()[0].avg);
  }
  let better = '';
  if (aveyester && avetoday && (aveyester > avetoday)) better = false;
  else if (aveyester && avetoday && (aveyester < avetoday)) better = true;
  return { yesterday: aveyester, today: avetoday, better: better }
}

const register = async({request, response, render}) => {
  const validationRules = {
    email: [required, isEmail]
  };

  //console.log(request);

  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');
  const errors = [];

  const [emailPasses, error] = await validate({ email: email } , validationRules);

  // here, we would validate the data, e.g. checking that the 
  // email really is an email

  if (!emailPasses) {
    errors.push('Invalid email address');
    render('register.ejs', { errors: errors, email: email } )
  } else if (password.length < 4) {
    errors.push('The password must be at least 4 characters of length');
    render('register.ejs', { errors: errors, email: email } )
    return
  } else if (password !== verification) {
    errors.push('The entered passwords did not match');
    render('register.ejs', { errors: errors, email: email } );
    return
  } else {
    const existingUsers = await executeQuery("SELECT * FROM appusers WHERE email = $1", email);
    if (existingUsers.rowCount > 0) {
      errors.push('The email is already reserved.');
      render('register.ejs', { errors: errors, email: email } );
      return
    }
    // otherwise, store the details in the database
    const hash = await bcrypt.hash(password);
    // when storing a password, store the hash    
    await executeQuery("INSERT INTO appusers (email, password) VALUES ($1, $2);", email, hash);
    response.redirect('/behavior/reporting');
  }
};

const login = async({request, response, render, session}) => {

  const validationRules = {
    email: [required, isEmail]
  };
  const errors = [];

  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  const [emailPasses, error] = await validate({ email: email } , validationRules);

  if (!emailPasses) {
      errors.push('Invalid email address');
      render('login.ejs', { errors: errors, email: email });
      return;
  } else {
    const res = await executeQuery("SELECT * FROM appusers WHERE email = $1;", email);
    if (res.rowCount === 0) {
        errors.push('Invalid email address');
        render('login.ejs', { errors: errors, email: email } );
        return;
    }

    const userObj = res.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        errors.push('Invalid password');
        render('login.ejs', { errors: errors, email: email } );
        return;
    }

    await session.set('authenticated', true);
    await session.set('user', {
      id: userObj.id,
      email: userObj.email
    });
    response.redirect('/');
  }
}


export { createUser, register, login, landingData };