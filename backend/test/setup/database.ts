import { Connection } from 'mongoose';


export async function clearDatabase(
 connection: Connection
){

 await connection.db?.dropDatabase();

}