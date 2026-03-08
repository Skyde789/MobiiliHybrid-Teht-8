import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from './screens/TodoScreen';
import CustomNavigationBar from './components/CustomNavigationBar';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Todos"
          screenOptions={{ header: (props) => <CustomNavigationBar {...props} />, }}>
          <Stack.Screen name="Todos" component={TodoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
