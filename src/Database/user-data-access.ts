import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../Models/User";

export async function findUserByUsernamePassword(
  username: string,
  password: string
): Promise<User> {
  let client: PoolClient;
  client = await connectionPool.connect();
  try {
    let result: QueryResult;
    console.log("declared query");

    result = await client.query(
      `SELECT users.id, users.username, users.firstname, users.lastname, users.password, users.email, role.role_name
        FROM projectZero.users INNER JOIN projectZero.role ON users.role_id = role.id
        WHERE users.username = $1 AND users.password = $2;`,
      [username, password]
    );
    console.log("got query");
    const usersMatchingUsernamePassword = result.rows.map((u) => {
      return new User(u.id, u.username, u.password, u.email, u.role_name);
    });
    if (usersMatchingUsernamePassword.length > 0) {
      console.log("it's a match!!!!");
      return usersMatchingUsernamePassword[0];
    } else {
      throw new Error("Username and Password not matched to a valid user");
    }
  } catch (e) {
    throw new Error(`Failed to validate User with DB: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function getAllUsers(): Promise<User[]> {
  let client: PoolClient = await connectionPool.connect();
  try {
    let result: QueryResult = await client.query(
      `SELECT users.id, users.username, users.firstname, users.lastname, users.password, users.email, role.role_name
        FROM projectZero.users INNER JOIN projectZero.role ON users.role_id = role.id;`
    );
    for (let row of result.rows) {
      console.log(row.username);
    }
    return result.rows.map((u) => {
      return new User(u.id, u.username, u.password, u.email, u.role_name);
    });
  } catch (e) {
    throw new Error(`Failed to query for all users: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function getUserById(id: number): Promise<User[]> {
  let client: PoolClient = await connectionPool.connect();
  try {
    let result: QueryResult = await client.query(
      `SELECT users.id, users.username, users.firstname, users.lastname, users.password, users.email, role.role_name
        FROM projectZero.users INNER JOIN projectZero.role on users.role_id =role.id 
        where ${id} = users.id`
    );

    return result.rows.map((u) => {
      return new User(u.id, u.username, u.password, u.email, u.role_name);
    });
  } catch (e) {
    throw new Error(`Failed to query for all users: ${e.message}`);
  } finally {
    client && client.release();
  }
}

// export async function patchUser(id:number, userName:string, firstName:string, lastName:string, passWord:string, email:string, role:string):promise<User>{
//   let client: PoolClient = await connectionPool.connect();
//   let patchId =id, patchUserName= userName, patchFirstName= firstName, patchLastName= lastName, patchPassWord= passWord, patchEmail= email, patchRole= role

//   try {
//     let result: QueryResult = await client.query(
//       `UPDATE projectZero.users SET first_name = 'Robert', last_name = 'Walter'`
//     );
// }
