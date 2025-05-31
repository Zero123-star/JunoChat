import React, { useEffect, useState } from 'react';
import { fetchUsers, banUser } from '../api';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/uiButton';

interface User {
    id: number;
    username: string;
    email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { isModerator, user: currentUser } = useAuth();
  const [banning, setBanning] = useState<number | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response);
      } catch (error) {
        console.error('Eroare la obținerea utilizatorilor:', error);
      }
    };

    getUsers();
  }, []);

  const handleBan = async (userId: number) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    setBanning(userId);
    try {
      await banUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      alert('Failed to ban user.');
    } finally {
      setBanning(null);
    }
  };

  return (
    <div>
      <h1>Lista utilizatorilor</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2">
            {user.username} - {user.email}
            {isModerator && user.id !== currentUser?.id && (
              <Button
                size="sm"
                variant="destructive"
                disabled={banning === user.id}
                onClick={() => handleBan(user.id)}
              >
                {banning === user.id ? 'Banning...' : 'Ban'}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;