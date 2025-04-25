/**
 * Role-Based Access Control Service
 * 
 * This module provides RBAC functionality for implementing
 * least-privilege access controls throughout the application.
 */

import { User } from 'firebase/auth';

// Define permission types
export type Permission = 
  | 'read:all'
  | 'write:all'
  | 'delete:all'
  | 'read:client_data'
  | 'write:recommendations'
  | 'read:own_data'
  | 'write:own_profile'
  | 'read:public';

// Define role types with their associated permissions
export interface Role {
  name: string;
  permissions: Permission[];
}

// Define available roles
export const Roles: Record<string, Role> = {
  ADMIN: {
    name: 'admin',
    permissions: ['read:all', 'write:all', 'delete:all']
  },
  ADVISOR: {
    name: 'advisor',
    permissions: ['read:client_data', 'write:recommendations']
  },
  CLIENT: {
    name: 'client',
    permissions: ['read:own_data', 'write:own_profile']
  },
  GUEST: {
    name: 'guest',
    permissions: ['read:public']
  }
};

/**
 * Retrieves the user's roles from their Firebase custom claims.
 * In a real implementation, this would interact with Firebase custom claims.
 */
export function getUserRoles(user: User | null): Role[] {
  if (!user) {
    return [Roles.GUEST]; // Default to guest role for unauthenticated users
  }
  
  // In production, retrieve roles from user custom claims via Firebase
  // For now, assign CLIENT role to all authenticated users
  return [Roles.CLIENT];
}

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  const roles = getUserRoles(user);
  return roles.some(role => role.permissions.includes(permission));
}

/**
 * Assigns a role to a user.
 * In production, this would update Firebase custom claims.
 */
export async function assignRole(userId: string, role: Role): Promise<void> {
  // Mock implementation - in production this would update Firebase custom claims
  console.log(`Assigning role ${role.name} to user ${userId}`);
  
  // In production:
  // 1. Call a secure Firebase function to update custom claims
  // 2. The function would verify the requestor has admin privileges
  // 3. Update the user's claims with the new role
}

/**
 * Removes a role from a user.
 * In production, this would update Firebase custom claims.
 */
export async function removeRole(userId: string, role: Role): Promise<void> {
  // Mock implementation - in production this would update Firebase custom claims
  console.log(`Removing role ${role.name} from user ${userId}`);
  
  // Similar implementation to assignRole, but removing the role
}

/**
 * Higher-order component to protect UI components based on required permission.
 */
export function withPermission<T>(Component: React.ComponentType<T>, requiredPermission: Permission) {
  return (props: T & { user: User | null }) => {
    const { user, ...rest } = props;
    
    if (!hasPermission(user, requiredPermission)) {
      // Return null or an "Access Denied" component
      return null;
    }
    
    return <Component {...rest as T} />;
  };
}

/**
 * Checks if a resource belongs to the current user (for own-data permissions).
 */
export function isOwnResource(user: User | null, resourceOwnerId: string): boolean {
  if (!user) return false;
  return user.uid === resourceOwnerId;
}
