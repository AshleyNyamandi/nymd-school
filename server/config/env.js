import { config } from "dotenv";


config();

export const { PORT, 
                NODE_ENV,
                MONGO_URI, 
                JWT_SECRET, 
                JWT_EXPIRES_IN,
                JWT_REFRESH_SECRET,
                BCRYPT_SECRET_KEY,
                BCRYPT_SALT,
                SUPABASE_URL,
                SUPABASE_SERVICE_ROLE,
                EMAIL,
                EMAIL_PASSWORD,
                CLIENT_URL
                 } = process.env;