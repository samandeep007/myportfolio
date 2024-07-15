import mongoose from 'mongoose';
import dbName from '@/constants'

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {};

const dbConnect = async(): Promise<void> => {
    if(connection.isConnected){
        console.log('Already connected to the database');
        return;
    }

    try {
        const db = await mongoose.connect(`process.env.MONGO_URI/${dbName}` || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected successfully");
        
    } catch (error: any) {
        console.log('Database connection failed', error);
        process.exit(1);
    }
}

export default dbConnect;




