import { expect, describe, it } from 'vitest'

import {
  safeConnectionString,
  parsePostgresConnectionString,
  recreatePostgresConnectionString,
} from './connectionStringUtils'

describe('connectionStringUtils', () => {
  describe('safeConnectionString', () => {
    it('should mask the password in the connection string', () => {
      const input = 'postgres://user:password123@host:54321/database'
      const expected = 'postgres://user:*****@host:54321/database'
      expect(safeConnectionString(input)).toBe(expected)
    })

    it('should mask the password in the connection string', () => {
      const input = 'postgres://user:password123@host:5432/database'
      const expected = 'postgres://user:*****@host/database'
      expect(safeConnectionString(input)).toBe(expected)
    })

    it('should handle connection strings without passwords', () => {
      const input = 'postgres://user@host:54321/database'
      const expected = 'postgres://user:*****@host:54321/database'
      expect(safeConnectionString(input)).toBe(expected)
    })

    it('should handle connection strings without passwords2', () => {
      const input = 'postgres://user:@host:54321/database'
      const expected = 'postgres://user:*****@host:54321/database'
      expect(safeConnectionString(input)).toBe(expected)
    })

    it('should handle connection strings with ssl params', () => {
      const input =
        'postgres://user:pass@acnw.host.com:5432/festbev?sslmode=verify-full&ssl=1&sslrootcert=/tmp/rds-cert.pem'
      const expected =
        'postgres://user:*****@acnw.host.com/festbev?sslmode=verify-full&ssl=1&sslrootcert=%2Ftmp%2Frds-cert.pem'
      expect(safeConnectionString(input)).toBe(expected)
    })
  })

  describe('parsePostgresConnectionString', () => {
    it('should correctly parse a full connection string', () => {
      const input = 'postgres://user:pass@host:5433/db?sslmode=require&timeout=30'
      const expected = {
        user: 'user',
        password: 'pass',
        host: 'host',
        port: 5433,
        database: 'db',
        queryParams: {
          sslmode: 'require',
          timeout: '30',
        },
      }
      expect(parsePostgresConnectionString(input)).toEqual(expected)
    })

    it('should correctly parse a full connection string', () => {
      const input = 'postgres://ggp:@127.0.0.1:54321/festbev'
      const expected = {
        user: 'ggp',
        password: undefined,
        host: '127.0.0.1',
        port: 54321,
        database: 'festbev',
        queryParams: {},
      }
      expect(parsePostgresConnectionString(input)).toEqual(expected)
    })

    it('should correctly parse a full connection string', () => {
      const input = 'postgres://user@host:5433/db?sslmode=require&timeout=30'
      const expected = {
        user: 'user',
        password: undefined,
        host: 'host',
        port: 5433,
        database: 'db',
        queryParams: {
          sslmode: 'require',
          timeout: '30',
        },
      }
      expect(parsePostgresConnectionString(input)).toEqual(expected)
    })

    it('should correctly parse a full connection string', () => {
      const input = 'postgres://user:@host:5433/db?sslmode=require&timeout=30'
      const expected = {
        user: 'user',
        password: undefined,
        host: 'host',
        port: 5433,
        database: 'db',
        queryParams: {
          sslmode: 'require',
          timeout: '30',
        },
      }
      expect(parsePostgresConnectionString(input)).toEqual(expected)
    })

    it('should use default port if not specified', () => {
      const input = 'postgres://user:pass@host/db'
      const result = parsePostgresConnectionString(input)
      expect(result.port).toBe(5432)
    })

    it('should handle connection strings without user and password', () => {
      const input = 'postgres://host/db'
      const result = parsePostgresConnectionString(input)
      expect(result.user).toBeUndefined()
      expect(result.password).toBeUndefined()
    })

    it('should throw an error for invalid connection strings', () => {
      const input = 'invalid-connection-string'
      expect(() => parsePostgresConnectionString(input)).toThrow('Invalid connection string format')
    })
  })

  describe('recreatePostgresConnectionString', () => {
    it('should recreate a full connection string', () => {
      const input = {
        user: 'user',
        password: 'pass',
        host: 'host',
        port: 5433,
        database: 'db',
        queryParams: {
          sslmode: 'require',
          timeout: '30',
        },
      }
      const expected = 'postgres://user:pass@host:5433/db?sslmode=require&timeout=30'
      expect(recreatePostgresConnectionString(input)).toBe(expected)
    })

    it("should omit port if it's the default 5432", () => {
      const input = {
        user: 'user',
        password: 'pass',
        host: 'host',
        port: 5432,
        database: 'db',
        queryParams: {},
      }
      const expected = 'postgres://user:pass@host/db'
      expect(recreatePostgresConnectionString(input)).toBe(expected)
    })

    it('should handle connection info without user and password', () => {
      const input = {
        user: undefined,
        password: undefined,
        host: 'host',
        port: 5432,
        database: 'db',
        queryParams: {},
      }
      const expected = 'postgres://host/db'
      expect(recreatePostgresConnectionString(input)).toBe(expected)
    })

    it('should properly encode query parameters', () => {
      const input = {
        user: 'user',
        password: 'pass',
        host: 'host',
        port: 5432,
        database: 'db',
        queryParams: {
          'special char': 'value with spaces',
        },
      }
      const expected = 'postgres://user:pass@host/db?special%20char=value%20with%20spaces'
      expect(recreatePostgresConnectionString(input)).toBe(expected)
    })
  })
})
