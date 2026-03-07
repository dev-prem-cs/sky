import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// 🚨 1. Added the missing imports!
import bcrypt from "bcryptjs"; 
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/models/User"; 


// 🚨 2. Exported authOptions so layout.js can use it!
export const authOptions = {
  providers: [
    // 1. Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // 2. Email & Password Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 🚨 3. Brought back the real MongoDB check!
        await connectMongoDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          return null; // No user found
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (passwordsMatch) {
          return user; // Success!
        } else {
          return null; // Wrong password
        }
      }
    })
  ],
 callbacks: {
    // 1. The signIn callback you already wrote (Keep this exactly as is!)
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            const baseUsername = name.replace(/\s+/g, "").toLowerCase();
            const randomNum = Math.floor(Math.random() * 100000);
            const tempUsername = `${baseUsername}_${randomNum}`;

            await User.create({
              name, email, username: tempUsername, profile_pic: image, 
            });
          }
          return true; 
        } catch (error) {
          console.error("Error saving Google user: ", error);
          return false; 
        }
      }
      return true; 
    },

    // 🆕 2. The JWT Callback (Runs whenever a token is created or updated)
    async jwt({ token, user }) {
      // The 'user' variable is only available right after they hit the login button
      if (user) {
        // Fetch the user from our database using their email
        await connectMongoDB();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          // Attach the MongoDB ID and Username to the secure token
          token.id = dbUser._id.toString(); 
          token.username = dbUser.username;
        }
      }
      return token;
    },

    // 🆕 3. The Session Callback (Runs whenever you call useSession() or getServerSession())
    async session({ session, token }) {
      // Pass the data from the token into the active session
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

// Pass the authOptions to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
