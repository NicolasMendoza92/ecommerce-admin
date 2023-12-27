// se crea esta ruta con la documentacion de nextauth.org

import clientPromise from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmails = ['nicomendoza.92@gmail.com', 'admin@gmail.com']
// vamos a ver si el email que se encuentra dentro de nuestra base de datos como admin.
async function isAdminEmail(email) {
  if (await Admin.findOne({ email })) {
    return true;
  } return false;
}

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const admin = {email:'admin@gmail.com', password:'Admin123'}
        const { email, password } = credentials;

        try {
          if (!admin) {
            return null;
          }
          if (email === admin.email && password === admin.password ) {
            return admin;
          } else{
            return null;
          }
          
        } catch (error) {
          console.log('error', error)
        }
      },

    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // hacemos console log de session para ver que es lo que tenemos que verificar en el objeto que trae, como email , name etc.
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
}

export default NextAuth(authOptions);

// funcion para ver si somos el administrador adecuado
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // si no eres admin => pasa lo siguiente. El no lo damos con el "!"
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    throw 'You are not an admin';
  }
}