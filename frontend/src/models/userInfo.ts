export interface UserInfo {
   
        firstName: string;
        lastName: string;
        username: string;
        userType: 'group' | 'admin' | 'client';
        groupId: number;
        adminId: number;
        clientId: number;
    
      
}