import { useAuth } from '../auth/AuthContext';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AuthGuard({ children }) {
  const { authenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!authenticated) {
      navigation.navigate('Login');
    }
  }, [authenticated]);

  return authenticated ? children : null;
}