import { executeQuery } from "../database/database.js";
//import { Session } from "../deps.js";
import { bcrypt } from "../deps.js";
import { validate, required, lengthBetween, isEmail, isInt, isNumber, minNumber, maxNumber } from "../deps.js";

//Tänne raportointifunktiot! Tarkkana sessiojuttujen kaa.

const isReportedMorning = async( session ) => {
  let reported = false;
  const today = new Date();
  const y = (today).getFullYear();
  const m = (today).getMonth() + 1;
  const d = (today).getDate();
  const date = y + '-' + m + '-' + d;
  const userid = (await session.get('user')).id;
  const result = await executeQuery("SELECT * FROM stats WHERE user_id=$1 AND date=$2 AND type='morningmood';", userid, date);
  if (result && result.rowCount > 0) {
    reported = true;
  }
  return reported;
}

const isReportedEvening = async( session ) => {
  let reported = false;
  const today = new Date();
  const y = (today).getFullYear();
  const m = (today).getMonth() + 1;
  const d = (today).getDate();
  const date = y + "-" + m + "-" + d;
  const userid = (await session.get('user')).id;
  const result = await executeQuery("SELECT * FROM stats WHERE user_id=$1 AND date=$2 AND type='eveningmood';", userid, date);
  if (result && result.rowCount > 0) {
    reported = true;
  };
  return reported;
}


const morningReport = async({ session, request, render, response }) => {
    const user = await session.get('user');
    const id = user.id;
    const body = request.body();
    const params = await body.value;
    const data = {
        errors: [],
        today: params.get('date').replace(/\"/g, "'"),
        sleephours: Number(params.get('sleephours')),
        sleepquality: Number(params.get('sleepquality')),
        morningmood: Number(params.get('morningmood'))
    }

    //Catch invalid values. Using if clauses until using validation rules won't crash the app
    if (!data.sleephours) {
      data.errors.push('Please enter number of hours slept');
      render('morningreport.ejs', data);
    } else if (!Number(data.sleephours) || Number(data.sleephours) < 0 || Number(data.sleephours) > 24) {
      data.errors.push('Sleep hours must be a number between 0 and 24');
      render('morningreport.ejs', data);
    } else if (!data.sleepquality) {
      data.errors.push('Please enter your rating for the quality of your sleep last night');
      render('morningreport.ejs', data);
    } else if (!Number.isInteger(data.sleepquality) || Number(data.sleepquality) < 1 || Number(data.sleepquality) > 5) {
      data.errors.push('Sleep quality rating must be an integer from 1 to 5');
      render('morningreport.ejs', data);
    } else if (!data.morningmood) {
      data.errors.push('Please enter your rating for the general mood this morning');
      render('morningreport.ejs', data);
    } else if (!Number(data.morningmood) || Number(data.morningmood) < 1 || Number(data.morningmood) > 5 ) {
      data.errors.push('Morning mood must be an integer from 1 to 5');
      render('morningreport.ejs', data);
    }
    
    if (data.errors.length === 0) {
      const id = (await session.get('user')).id;

      // Object.prototype.toString.call(data.today);
      // Object.prototype.toString.call(data.sleephours);

      //Lisää kaikki tiedot tietokantaan.
      const today = await executeQuery('SELECT * FROM stats WHERE date=$1 AND user_id=$2;', data.today, id);
      if (today.rowCount > 0) {
        await executeQuery("DELETE FROM stats WHERE date=$1 AND user_id=$2;", data.today, id);
      }

      //sleephours
      await executeQuery("INSERT INTO stats (user_id, date, type, hours) VALUES ($1, $2, 'sleephours', $3);", id, data.today, data.sleephours);
      //sleepquality
      await executeQuery("INSERT INTO stats (user_id, date, type, rating) VALUES ($1, $2, 'sleepquality', $3);", id, data.today, data.sleepquality);
      //morningmood
      await executeQuery("INSERT INTO stats (user_id, date, type, rating) VALUES ($1, $2, 'morningmood', $3);", id, data.today, data.morningmood);


      response.redirect('/behavior/reporting');
    }


}


const eveningReport = async({ session, request, render, response }) => {
  // const user = await session.get('user');
  // const id = user.id;
  const body = request.body();
  const params = await body.value;
  const data = {
      errors: [],
      today: params.get('date').replace(/\"/g, "'"),
      sportshours: Number(params.get('sportshours')),
      studyhours: Number(params.get('studyhours')),
      eating: Number(params.get('eating')),
      eveningmood: Number(params.get('eveningmood'))
  }

  //Catch invalid values. Using if clauses until using validation rules won't crash the app
  if (!data.sportshours) {
    data.errors.push('Please enter the number of hours spent on sports and exercise today');
    render('eveningreport.ejs', data);
  } else if (!Number(data.sportshours) || Number(data.sportshours) < 0 || Number(data.sportshours) > 24) {
    data.errors.push('Sports hours must be a number between 0 and 24');
    render('eveningreport.ejs', data);
  } else if (!data.studyhours) {
    data.errors.push('Please enter the number of hours spent on studying today')
    render('eveningreport.ejs', data);
  } else if (!Number(data.studyshours) || Number(data.studyhours) < 0 || Number(data.studyhours)) {
    data.errors.push('Study hours must be a number between 0 and 24');
    render('eveningreport.ejs', data);
  } else if (!data.eating) {
    data.errors.push('Please enter your rating for the regularity and quality of your eating habits today');
    render('eveningreport.ejs', data);
  } else if (!Number.isInteger(data.eating) || Number(data.eating) < 1 || Number(data.eating) > 5) {
    data.errors.push('Eating regularity and quality rating must be an integer from 1 to 5');
    render('eveningreport.ejs', data);
  } else if (!data.eveninggmood) {
    data.errors.push('Please enter your rating for the general mood this evening');
    render('eveningreport.ejs', data);
  } else if (!Number(data.eveningmood) || Number(data.eveningmood) < 1 || Number(data.eveningmood) > 5 ) {
    data.errors.push('Evening mood must be an integer from 1 to 5');
    render('eveningreport.ejs', data);
  } 
  
  if (data.errors.lenght === 0) {
    const id = (await session.get('user')).id;

    //Lisää kaikki tiedot tietokantaan.
    const today = await executeQuery("SELECT * FROM stats WHERE date=$1 AND user_id=$2 AND (type='eveningmood' OR type='sportshours' OR type='studyhours' OR type='eating');", data.today, id);
    if (today.rowCount > 0) {
      await executeQuery("DELETE FROM stats WHERE date=$1 AND user_id=$2 AND (type='eveningmood' OR type='sportshours' OR type='studyhours' OR type='eating');", data.today, id);
    }

    //sportshours
    await executeQuery("INSERT INTO stats (user_id, date, type, hours) VALUES ($1, $2, 'sportshours', $3);", id, data.today, data.sportshours);
    //studyhours
    await executeQuery("INSERT INTO stats (user_id, date, type, hours) VALUES ($1, $2, 'studyhours', $3);", id, data.today, data.studyhours);
    //eating
    await executeQuery("INSERT INTO stats (user_id, date, type, rating) VALUES ($1, $2, 'eating', $3);", id, data.today, data.eating);
    //eveningmood
    await executeQuery("INSERT INTO stats (user_id, date, type, rating) VALUES ($1, $2, 'eveningmood', $3);", id, data.today, data.eveningmood);


    response.redirect('/behavior/reporting');
  }


}

export { isReportedMorning, isReportedEvening, morningReport, eveningReport }