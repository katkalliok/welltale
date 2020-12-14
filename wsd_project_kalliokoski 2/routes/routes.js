import { Router } from "../deps.js";
import { showRegistrationForm, showLoginForm, registration, getLanding, logout, getLogout } from "./controllers/usercontroller.js";
import { reportPage, morning, evening } from "./controllers/reportcontrol.js";
import { eveningReport, morningReport } from "../services/reportService.js";
import { summarypage, updateSummary } from "./controllers/summarycontrol.js";
import { weekAverages } from "../services/summaryService.js";
import { register, login } from "../services/userService.js";
//import { logout, getLogout } from "./controllers/usercontroller.js"
import * as wellApi from "./apis/wellnessapi.js";

const router = new Router();

router.get('/', getLanding);
router.get('/behavior/reporting', reportPage);
router.post('/behavior/reporting/proceed/morning', morning);
router.post('/behavior/reporting/proceed/evening', evening);
router.post('/behavior/reporting/morning', morningReport);
router.post('/behavior/reporting/evening', eveningReport);
router.get('/behavior/summary', summarypage);
router.post('/behavior/summary/week', updateSummary);
router.get('/auth/registration', showRegistrationForm);
router.post('/auth/registration', register);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', login);
router.get('/auth/logout', getLogout);
router.post('/auth/logout', logout);
router.get('/api/users', wellApi.getUser);
router.post('/api/users', wellApi.createUser);

export { router };