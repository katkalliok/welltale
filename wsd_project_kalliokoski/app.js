import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { config } from "./deps.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { Session } from "./deps.js";


const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const conf = config();
const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

// const ejsEngine = engineFactory.getEjsEngine();
// const oakAdapter = adapterFactory.getOakAdapter();
// app.use(viewEngine(oakAdapter, ejsEngine, {
//     viewRoot: "./views"
// }));

app.use(middleware.errorMiddleware);
app.use(middleware.requestsMiddleware);
app.use(middleware.serveStaticFiles);
app.use(middleware.accessControl);
app.use(router.routes());


app.listen({ port: Number(conf.APPPORT) });