/**
 * Drop existing policies for a table
 * @param table - The table name
 * @returns SQL string to drop policies
 */
export function dropPolicies(table: string): string

/**
 * Create policies that allow any user to select and modify based on current_user_id()
 * @param table - The table name
 * @returns SQL string to create user update policies
 */
export function anyUserUpdatePolicy(table: string): string

/**
 * Create policies that allow any user to select but only admins to modify
 * @param table - The table name
 * @returns SQL string to create admin-only update policies
 */
export function adminUpdatePolicy(table: string): string

/**
 * Enable row level security on a table
 * @param table - The table name
 * @returns SQL string to enable RLS
 */
export function enableRls(table: string): string

/**
 * Grant necessary permissions to a database user
 * @param user - The database user name
 * @returns SQL string to grant permissions
 */
export function fixGrants(user: string): string
