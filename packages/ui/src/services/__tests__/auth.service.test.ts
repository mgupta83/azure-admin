import { describe, it, expect } from 'vitest';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  it('should be a singleton', () => {
    const instance1 = AuthService.getInstance();
    const instance2 = AuthService.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('should return null when no user is set', () => {
    const authService = AuthService.getInstance();
    expect(authService.getUser()).toBeNull();
    expect(authService.getAccessToken()).toBeNull();
  });

  it('should detect monitoring access based on group membership', () => {
    const authService = AuthService.getInstance();
    
    const userWithAccess = {
      id: '1',
      displayName: 'Test User',
      email: 'test@example.com',
      groups: ['az_monitoring', 'other_group']
    };
    
    const userWithoutAccess = {
      id: '2',  
      displayName: 'Test User 2',
      email: 'test2@example.com',
      groups: ['other_group']
    };
    
    expect(authService.hasMonitoringAccess(userWithAccess)).toBe(true);
    expect(authService.hasMonitoringAccess(userWithoutAccess)).toBe(false);
  });
});