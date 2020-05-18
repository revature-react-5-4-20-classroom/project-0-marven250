import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../Models/User";
import { Reimbursement } from "../Models/Reimbursement";
import { reimbursementRouter } from "../Routers/reimbursementRoutes";

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
      return new User(
        u.id,
        u.username,
        u.firstname,
        u.lastname,
        u.password,
        u.email,
        u.role_name
      );
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
      return new User(
        u.id,
        u.username,
        u.firstname,
        u.lastname,
        u.password,
        u.email,
        u.role_name
      );
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
      return new User(
        u.id,
        u.username,
        u.firstname,
        u.lastname,
        u.password,
        u.email,
        u.role_name
      );
    });
  } catch (e) {
    throw new Error(`Failed to query for all users: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function patchUser(
  id: number,
  userName: string,
  firstName: string,
  lastName: string,
  passWord: string,
  email: string,
  role: string
) {
  let client: PoolClient = await connectionPool.connect();
  // let patchId =id, patchUserName= userName, patchFirstName= firstName, patchLastName= lastName, patchPassWord= passWord, patchEmail= email, patchRole= role

  try {
    if (userName && firstName && lastName && passWord && email && role) {
      let result: QueryResult = await client.query(
        `UPDATE projectZero.users SET username= $2, firstname = $3, lastname = $4, password= $5, email = $6, role_id= $7 WHERE id = $1`,
        [id, userName, firstName, lastName, passWord, email, role]
      );
      console.log(result);
      let result2: QueryResult = await client.query(
        ` SELECT * from projectZero.users WHERE id = $1`,
        [id]
      );
      return result2.rows[0];
    }
    if (userName) {
      let result: QueryResult = await client.query(
        `UPDATE projectZero.users SET username= $2 WHERE id = $1 `,
        [id, userName]
      );
      console.log(result);
      let result2: QueryResult = await client.query(
        ` SELECT * from projectZero.users WHERE id = $1`,
        [id]
      );
      return result2.rows[0];
    }
    if (userName && firstName) {
      let result: QueryResult = await client.query(
        `UPDATE projectZero.users SET username= $2, firstname = $3 WHERE id = $1 `,
        [id, userName, firstName]
      );

      console.log(result);
      let result2: QueryResult = await client.query(
        ` SELECT * from projectZero.users WHERE id = $1`,
        [id]
      );
      return result2.rows[0];
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    client && client.release();
  }
}

export async function postReimbursement(
  id: number,
  author: number,
  amount: number,
  dateSubmitted: number,
  dateResolved: number,
  description: string,
  resolver: number,
  status: number,
  type: number
) {
  let client: PoolClient = await connectionPool.connect();
  try {
    console.log("attempting to add reimbursement");
    let result: QueryResult = await client.query(
      `INSERT INTO projectzero.reimbursement Values (default, $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type,
      ]
    );
    console.log(result, "!!!!!!!!");
    return new Reimbursement(
      id,
      author,
      amount,
      dateSubmitted,
      dateResolved,
      description,
      resolver,
      status,
      type
    );
  } catch (e) {
    console.log("Unable to  create new reimbursement", e.message);
  } finally {
    client && client.release();
  }
}

export async function patchReimbursement(
  id: number,
  dateResolved: number,
  status: number
) {
  let client: PoolClient = await connectionPool.connect();
  // let patchId =id, patchUserName= userName, patchFirstName= firstName, patchLastName= lastName, patchPassWord= passWord, patchEmail= email, patchRole= role

  if (status && dateResolved) {
    try {
      let result: QueryResult = await client.query(
        `UPDATE projectZero.reimbursement SET dateresolved= $2, rstatus= $3  WHERE id = $1`,
        [id, dateResolved, status]
      );
      console.log(result, "1234567890123456789");
    } catch (e) {
      console.error(e.message);
    }

    try {
      let result2: QueryResult = await client.query(
        ` SELECT * from projectZero.reimbursement WHERE id = $1`,
        [id]
      );
      console.log(result2.rows, "!!!!!!!!!!!");
      return result2.rows;
    } catch (e) {
      console.log(e.message);
    } finally {
      client && client.release();
    }
  }
}
