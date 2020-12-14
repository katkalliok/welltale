import { executeQuery } from "../database/database.js";

const wAverages = async(week, year, session) => {
    const userid = (await session.get('user')).id;
    //The first and last date of the week
    let date = new Date(year, 0, (1 + (week - 1) * 7));
    date.setDate(date.getDate() + (1 - date.getDay()));
    date.setDate(date.getDate() + 1);
    const day1 = date.toDateString();
    
    let date2 = new Date(year, 0, (1 + (week - 1) * 7 ));
    date2.setDate(date2.getDate() + (1 - date2.getDay()));
    date2.setDate(date2.getDate() + 7);
    const day7 = date2.toDateString();

    const waverages = {
        empty: true,
        avesleephours: 0,
        avesports: 0,
        avestudy: 0,
        avesleepquality: '',
        avemood: ''
    }

    //Check if there's anything on that week
    const result = await executeQuery("SELECT * FROM stats WHERE user_id = $1 AND EXTRACT(WEEK FROM date) = $2 AND EXTRACT(ISOYEAR FROM date) = $3;", userid, week, year);
    if (result && result.rowCount > 0) {
        waverages.empty = false;
    
        waverages.avesleephours = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='sleephours' AND date >= $2 AND date <= $3;", userid, day1, day7);
        waverages.avesports = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='sportshours' AND date >= $2 AND date <= $3;", userid, day1, day7);
        waverages.avestudy = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='studyhours' AND date >= $2 AND date <= $3;", userid, day1, day7);
        waverages.avesleepquality = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='sleepquality' AND date >= $2 AND date <= $3;", userid, day1, day7);
        const avemormood = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='morningmood' AND date >= $2 AND date <= $3;", userid, day1, day7);
        const aveevemood = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='eveningmood' AND date >= $2 AND date <= $3;", userid, day1, day7);
        waverages.avemood = (avemormood + aveevemood) / 2
    }

    return waverages;
}

const mAverages = async(month, year, session) => {
    const userid = (await session.get('user')).id;
    const nofDays = new Date(year, month, 0).getDate();
    const day1 = year + '-' + month + '-' + '01';
    const lastDay = year + '-' + month + '-' + nofDays.toString();

    const maverages = {
        empty: true,
        avesleephours: 0,
        avesports: 0,
        avestudy: 0,
        avesleepquality: '',
        avemood: ''
    }
    console.log(month);

    const result = await executeQuery("SELECT * FROM stats WHERE user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(ISOYEAR FROM date) = $3;", userid, month, year);

    if (result && result.rowCount > 0) {
        maverages.empty = false;
    
        maverages.avesleephours = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='sleephours' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        maverages.avesports = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='sportshours' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        maverages.avestudy = await executeQuery("SELECT AVG(hours) FROM stats WHERE user_id=$1 AND type='studyhours' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        maverages.avesleepquality = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='sleepquality' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        const avemormood = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='morningmood' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        const aveevemood = await executeQuery("SELECT AVG(rating) FROM stats WHERE user_id=$1 AND type='eveningmood' AND date >= $2 AND date <= $3;", userid, day1, lastDay);
        maverages.avemood = (avemormood + aveevemood) / 2
    }

    return maverages;
}


//Weekly averages for a requested week
const weekAverages = async(request, render, session ) => {
    const body = request.body();
    const params = await body.value; //Week and month

    const week = params.get('week').substring(6, 8);
    console.log(week);
    const wyear = params.get('week').substring(0, 4);
    console.log(wyear);

    const waverages = wAverages(week, wyear, session);
    
    return { week: params.get('week'), waverages: waverages };
}

//Monthly averages for a requested month
const monthAverages = async(session, request) => {
    const body = request.body();
    const params = await body.value; //Week and month

    const month = params.get('month').substring(5);
    const myear = params.get('month').substring(1, 4);
    console.log(month);
    console.log(myear);

    const maverages = mAverages(month, myear, session);

    return { month: params.get('month'), maverages: maverages };
}



export { wAverages, mAverages, weekAverages, monthAverages }