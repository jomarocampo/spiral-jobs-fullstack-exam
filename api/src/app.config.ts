import { User } from './entities/user.entity';

export const DatabaseConfig = {
    name: 'default',
    type: 'postgres',
    host: (process.env.DB_HOST, 'localhost'),
    port: (process.env.DB_PORT, 5432),
    database: (process.env.DB_NAME, 'spiral'),
    username: (process.env.DB_USERNAME, 'postgres'),
    password: (process.env.DB_PASSWORD, 'P@ssword123'),
    synchronize: true,
    entities: [
        // __dirname + '/*/**/*.entity{.ts,.js}',
        User
    ],
};  