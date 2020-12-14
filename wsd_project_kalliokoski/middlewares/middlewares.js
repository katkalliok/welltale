import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestsMiddleware = async({ request, session }, next) => {
  await next();
  const time = new Date();
  const user = await session.get('user');
  let id = 'unauthenticated';
  if (user) id = user.id;
  console.log(`${request.method} request to ${request.url.pathname} at ${time} by the user id ${id}`);
}

const serveStaticFiles = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });

  } else {
    await next();
  }
}

const accessControl = async({ session, request, response, render }, next) => {
  if (request.url.pathname === '/') {
    await next();
  } else if (request.url.pathname.startsWith('/auth')) {
    await next();
  } else if (request.url.pathname.startsWith('/api')) {
    await next();
  } else {
      const auth = await session.get('authenticated');
      if (!auth) await response.redirect('/auth/login');
      else await next();
  }
  
}

export { errorMiddleware, requestsMiddleware, serveStaticFiles, accessControl };