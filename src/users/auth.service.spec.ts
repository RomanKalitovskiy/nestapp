import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  const createFakeUsersService = async () => {
    const users: User[] = [];
    const fakeUsersService: Partial<UsersService> = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      create: async (email: string, password: string) => {
        const user = { id: users.length, email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    return module.get(AuthService);
  };

  it('can create an instance of auth service', async () => {
    expect(await createFakeUsersService()).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const service = await createFakeUsersService();
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const service = await createFakeUsersService();
    await service.signup('asdf@asdf.com', 'asdf');

    try {
      await service.signup('asdf@asdf.com', 'asdf');
      fail('Should have thrown an error');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(BadRequestException);
      if (err instanceof BadRequestException) {
        expect(err.message).toBe('email in use');
      }
    }
  });

  it('throws if signin is called with an unused email', async () => {
    const service = await createFakeUsersService();

    try {
      await service.signin('asdf@asdf.com', 'asdf');
      fail('Should have thrown an error');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(BadRequestException);
      if (err instanceof BadRequestException) {
        expect(err.message).toBe('email or password is invalid');
      }
    }
  });

  it('throws if an invalid password is provided', async () => {
    const service = await createFakeUsersService();
    await service.signup('asdf@asdf.com', 'asdf');

    try {
      await service.signin('asdf@asdf.com', 'asdfasdf');
      fail('Should have thrown an error');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(BadRequestException);
      if (err instanceof BadRequestException) {
        expect(err.message).toBe('email or password is invalid');
      }
    }
  });

  it('returns a user if correct password is provided', async () => {
    const service = await createFakeUsersService();
    await service.signup('asdf@asdf.com', 'asdf');

    const user = await service.signin('asdf@asdf.com', 'asdf');

    expect(user).toBeDefined();
  });
});
