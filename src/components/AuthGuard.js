import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function AuthGuard({ children }) {
  const { authenticated, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    // redirecționează doar după ce loading-ul s-a încheiat
    if (!loading && !authenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [authenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return authenticated ? children : null;
}
