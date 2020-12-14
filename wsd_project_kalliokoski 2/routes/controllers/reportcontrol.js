import { isReportedMorning, isReportedEvening } from "../../services/reportService.js"
import { Session } from "../../deps.js"


const reportPage = async({render, session}) => {
    let mor = 'not';
    let eve = 'not';
    const mReported = await isReportedMorning(session)
    const eReported = await isReportedEvening(session)
    if (mReported) mor = 'already';
    if (eReported) eve = 'already';
    render('reporting.ejs', { morstatus: mor, evestatus: eve } );
}

const morning = async({render}) => {
    const today = new Date();
    const y = (today).getFullYear();
    const m = (today).getMonth() + 1;
    const d = (today).getDate();
    const date = y + "-" + m + "-" + d;

    const data = {
        errors: [],
        today: date,
        sleephours: 0,
        sleepquality: 1,
        morningmood: 1
    }

    render('morningreport.ejs', data);
}

const evening = async({render}) => {
    const today = new Date();
    const y = (today).getFullYear();
    const m = (today).getMonth() + 1;
    const d = (today).getDate();
    const date = y + "-" + m + "-" + d;

    const data = {
        errors: [],
        today: date,
        sportshours: 0,
        studyhours: 0,
        eating: 1,
        eveningmood: 1
    }

    render('eveningreport.ejs', data);
}

export { reportPage, morning, evening }