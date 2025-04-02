import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api';

interface User {
    id: number;
    username: string;
    email: string;
  }

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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

  return (
    <div>
      <h1>Lista utilizatorilor</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;