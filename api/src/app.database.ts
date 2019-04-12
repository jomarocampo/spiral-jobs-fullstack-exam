import { Module as NestJSModule } from '@nestjs/common';
import { getConnection, createConnection, Repository } from 'typeorm';
import { DatabaseConfig } from './app.config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

const connect = async () => {
  console.log(DatabaseConfig)
  try {
    // create connection
    await createConnection(DatabaseConfig as any);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await connect();
  }
};

// #region User Seeder
const seedUser = async () => {

  const connection = getConnection();
  const userRepo = connection.getRepository(User);

  // populate when user table is empty
  const users = await userRepo.find();
  if (users.length > 0) {
    return Promise.resolve();
  }

  // create users
  const created_users = [];

  const created_user = await createUser(userRepo, 'System Administrator', 'admin@gmail.com', 'P@ssword123');
  created_users.push(created_user);

  // save
  await userRepo.save(created_users);
};

const createUser = async (repo: Repository<User>, name: string, email: string, password: string) => {

  
  const user = repo.create();
  user.name = name;
  user.email = email;
  user.password = await bcrypt.hash(password, 10);
  user.jwt_secret = '';
  user.last_login = new Date();
  user.is_deleted = false;

  // metadata
  user.created_by = null;
  user.created_date = new Date();
  user.modified_by = null;
  user.modified_date = new Date();

  return Promise.resolve(user);
};
// #endregion

@NestJSModule({
  providers: [

    {
      provide: '',
      useFactory: async () => {
        await connect();
        // seeders
        await seedUser();
      },
    },

  ],
})
export class AppDatabaseModule { }
