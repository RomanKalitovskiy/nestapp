import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  const createTestingController = async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'test' }]),
      findOne: (id: number) =>
        Promise.resolve(
          id === 1 ? { id, email: 'test@test.com', password: 'test' } : null,
        ),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
          ...attrs,
        }),
      remove: (id: number) =>
        Promise.resolve({ id, email: 'test@test.com', password: 'test' }),
    };

    const fakeAuthService: Partial<AuthService> = {
      signup: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    return module.get(UsersController);
  };

  it('should be defined', () => {
    expect(createTestingController()).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const controller = await createTestingController();
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0]).toEqual({
      id: 1,
      email: 'test@test.com',
      password: 'test',
    });
  });

  it('findUser returns a user with the given id', async () => {
    const controller = await createTestingController();
    const user = await controller.findUser('1');
    expect(user).toEqual({ id: 1, email: 'test@test.com', password: 'test' });
  });

  it('findUser throws an error if user with given id is not found', async () => {
    const controller = await createTestingController();
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const controller = await createTestingController();
    const user = await controller.signin(
      { email: 'test@test.com', password: 'test' },
      session,
    );

    expect(session.userId).toEqual(1);
    expect(user).toEqual({ id: 1, email: 'test@test.com', password: 'test' });
  });
});
