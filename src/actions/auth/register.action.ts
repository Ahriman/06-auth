import { defineAction } from "astro:actions";
import { z } from 'astro:schema';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from "firebase/auth";
import { firebase } from "@firebase/config";

export const registerUser = defineAction({

    accept: 'form',
    input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ name, email, password, remember_me }, { cookies } ) => {

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

        // const input = { name, email, password, remember_me };

        // console.log({ name, email, password, remember_me });

        // Creación de usuario
        try {

            const { user } = await createUserWithEmailAndPassword(
                firebase.auth, 
                email, 
                password
            );

            // Actualizar el nombre de usuario (displayName en Firebase)
            updateProfile(firebase.auth.currentUser!, {
                displayName: name,
            });

            // Verificar el correo electrónico
            await sendEmailVerification(firebase.auth.currentUser!, {
                // url: 'http://localhost:4321/protected?emailVerified=true',
                url: `${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`,
            });

            // return user;

            return {
                uid: user.uid,
                email: user.email,
            };
            
        } catch (error) {
            console.log('ERROR',error);

            const firebaseError = error as AuthError;

            if (firebaseError.code === 'auth/email-already-in-use') {
                throw new Error('El correo ya está en uso.');
            }

            throw new Error('Error al crear el usuario');
        }



        // return {
        //     ok: true,
        //     msg: 'Usuario creado correctamente',
        // };

    }

});