// se crea esta ruta con la documentacion de nextauth.org

import clientPromise from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = ['nicomendoza.92@gmail.com'];

// vamos a ver si el email que se encuentra dentro de nuestra base de datos como admin.
// async function isAdminEmail(email) {
//  return !! (await Admin.findOne({ email }));
// }

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // hacemos console log de session para ver que es lo que tenemos que verificar en el objeto que trae, como email , name etc.
  callbacks: {
    session: async ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    }
  }
}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // si no eres admin => pasa lo siguiente. El no lo damos con el "!"
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'You are not an admin';
  }
}