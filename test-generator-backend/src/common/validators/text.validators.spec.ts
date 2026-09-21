import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateSchoolClassDto } from 'src/modules/admin/dto/create-class.dto';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';
import { CreateChapterDto } from 'src/modules/chapter/dto/create-chapter.dto';
import { CreateAdminDto } from 'src/modules/auth/dto/create-admin.dto';
import { ConfirmResetPasswordDto } from 'src/modules/auth/dto/confirm-reset-password.dto';
import { UpdateClassDto } from 'src/modules/admin/dto/update-class.dto';

function errorsFor<T extends object>(
  cls: new () => T,
  plain: Record<string, unknown>,
) {
  const instance = plainToInstance(cls, plain);
  return {
    instance,
    fields: validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    }).map((error) => error.property),
  };
}

describe('name validation', () => {
  it.each(['', '   ', '\t\n'])(
    'rejects blank class, book and chapter names (%j)',
    (blank) => {
      expect(errorsFor(CreateSchoolClassDto, { name: blank }).fields).toContain(
        'name',
      );
      expect(
        errorsFor(CreateBookDto, {
          book_name: blank,
          class_name: 'Class 9',
          description: '',
          edition: '',
        }).fields,
      ).toContain('book_name');
      expect(
        errorsFor(CreateChapterDto, {
          bookId: '00000000-0000-4000-8000-000000000001',
          chapter_name: blank,
          order: 1,
        }).fields,
      ).toContain('chapter_name');
      expect(errorsFor(UpdateClassDto, { name: blank }).fields).toContain(
        'name',
      );
    },
  );

  it('trims surrounding whitespace from valid names', () => {
    const { instance, fields } = errorsFor(CreateSchoolClassDto, {
      name: '  Class 9  ',
    });
    expect(fields).toEqual([]);
    expect(instance.name).toBe('Class 9');
  });
});

describe('admin password validation', () => {
  const admin = (password: unknown) =>
    errorsFor(CreateAdminDto, { email: 'a@test.com', password }).fields;

  it('accepts passwords with inner spaces', () => {
    expect(admin('correct horse battery')).toEqual([]);
  });

  it.each(['        ', ' leading-space', 'trailing-space ', '\tpassword1'])(
    'rejects %j instead of trimming it',
    (password) => {
      expect(admin(password)).toContain('password');
    },
  );

  it('does not trim the password it accepts', () => {
    const { instance } = errorsFor(CreateAdminDto, {
      email: 'a@test.com',
      password: 'pass word 123',
    });
    expect(instance.password).toBe('pass word 123');
  });

  it('applies the same rule to password resets', () => {
    expect(
      errorsFor(ConfirmResetPasswordDto, {
        email: 'a@test.com',
        token: '12345678',
        newPassword: ' new-password',
      }).fields,
    ).toContain('newPassword');
    expect(
      errorsFor(ConfirmResetPasswordDto, {
        email: 'a@test.com',
        token: '1234abcd',
        newPassword: 'new-password',
      }).fields,
    ).toContain('token');
  });
});
