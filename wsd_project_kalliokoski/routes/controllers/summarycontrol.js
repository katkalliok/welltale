import { weekAverages, monthAverages, wAverages, mAverages } from '../../services/summaryService.js';

const summarypage = ({render, session}) => {
    const date = new Date();
    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return [d.getUTCFullYear(), weekNo];
    }
    
    const week = getWeekNumber(date)[0] + "-W" + getWeekNumber(date)[1];
    const month = date.getFullYear() + "-" + (date.getMonth() + 1);
    const waverages = wAverages(getWeekNumber(date)[1], date.getFullYear(), session);
    const maverages = mAverages(date.getMonth + 1, date.getFullYear(), session);
    render('summary.ejs', { week: week, month: month, maverages: maverages, waverages: waverages } );
}

const updateSummary = ({request, render, session}) => {
    const weekstats = weekAverages(session, request);
    const monthstats = monthAverages(session, request);

    render('summary.ejs', { week: weekstats.week, month: monthstats.month, maverages: monthstats.maverages, waverages: weekstats.waverages } )
}


export { summarypage, updateSummary }
