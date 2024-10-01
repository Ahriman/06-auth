import { firebase } from "@firebase/config";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";



export const loginUser = defineAction({

    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ email, password, remember_me }, { cookies } ) => {

        // Cookies
        if( remember_me ) {

            cookies.set('email', email, {
                expires: new Date( Date.now() + 1000 * 60 * 60 * 24 * 365 ), // 1 año
                path: '/',
            });

        } else {
            cookies.delete('email', {
                path: '/',
            });
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                firebase.auth, 
                email, 
                password
            );

            const user = userCredential.user;

            // Crea un objeto con solo propiedades serializables
            const serializableUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || null, // Asegúrate de manejar casos donde displayName pueda ser undefined
            };

            // Respuesta JSON simple
            return {
                success: true,
                message: 'Login successful',
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || null,
                },
            };
            
        } catch (error) {

            const firebaseError = error as AuthError;

            if (firebaseError.code === 'auth/email-already-in-use') {
                throw new Error('El correo ya está en uso.');
            }

            if (firebaseError.code === 'auth/invalid-credential') {
                throw new Error('Las credenciales no son correctas.');
            }

            console.log(error);
            throw new Error('No se pudo iniciar sesión');
        }

    }

});