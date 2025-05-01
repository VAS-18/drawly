import dotenv from 'dotenv';

dotenv.config({path: "../../../.env"});

const JWT_SECRET = process.env.JWT_TOKEN;

export default JWT_SECRET;