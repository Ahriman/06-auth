// No funciona por el nombre del archivo
// Demostración

import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/protected'];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
    
    // console.log(context.url);

    const authHeaders = request.headers.get('Authorization') ?? '';
    console.log(authHeaders);

    if (privateRoutes.includes(url.pathname)) {
        return checkLocalAuth(authHeaders, next);
    }

    return next();

});


const checkLocalAuth = ( authHeaders: string, next: MiddlewareNext ) => {

    if ( authHeaders ) {

        const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass';
        const decodedValue = atob(authValue).split(':');
        const [ user, password ] = decodedValue;
        console.log(decodedValue);

        if ( user === 'admin' && password === 'admin' ) {
            return next();
        }
        
    }
    
    return new Response('Autenticación requerida', { 
        status: 401,
        headers: { 
            'WWW-Authenticate': 'Basic realm="Secure Area"' 
        },
    });

}   