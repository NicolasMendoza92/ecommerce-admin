// se crea esta ruta con la documentacion de nextauth.org

import clientPromise from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmails = ['nicomendoza.92@gmail.com']
// vamos a ver si el email que se encuentra dentro de nuestra base de datos como admin.
async function isAdminEmail(email) {
 if (await Admin.findOne({ email })){
  return true;
 } return false;
}

export const authOptions = {
  secret:process.env.SECRET,
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@examle.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "admin@mail.com", email: "123456" };
        const adminUser = user
  
        if (credentials.email === user.email && credentials.password === user.password) {
          return user
        } else {
          return null
        }
      }
    })
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
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
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