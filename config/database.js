import { MongoClient } from 'mongodb'
// or as an es module:

// Connection URL

const client = new MongoClient('mongodb://localhost:27017');

// Database Name

 client.connect().then(()=>{
    console.log('Connected successfully to server');
 }).catch(()=>{
    console.log('something wrong unable to connect to server');
 })
  
 
 export const db = client.db("carRentalStore");


 