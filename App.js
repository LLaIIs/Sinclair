import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './app/(auth)';
import Search from './app/search';
import tabs from '../app/(tabs)';
import Details from '../app/details';
import { FavoritesProvider } from "./context/FavoritesContext";
const Stack = createStackNavigator();

function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
    <Stack.Navigator initialRouteName="Entrada">
      <Stack.Screen name="Entrada" component={EntradaScreen} options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" component={Auth} options={{ headerShown:false}} />
      {/* <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Login2" component={Login2Screen} options={{ title: 'Inserir Senha' }} />
      <Stack.Screen name="Login3" component={Login3Screen} options={{ title: 'Confirmar Número' }} />
      <Stack.Screen name="Login4" component={Login4Screen} options={{ title: 'Inserir Número de Telefone' }} />
      <Stack.Screen name="Redefinir" component={RedefinirScreen} options={{ title: 'Redefinir Senha' }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="Pesquisa2" component={Pesquisa2Screen} options={{ title: 'Pesquisa2' }} /> */}
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="(tabs)" component={tabs} options={{ headerShown:false}} />
      <Stack.Screen name="Search" component={Search}/>
    </Stack.Navigator>
    </NavigationContainer>
    </FavoritesProvider>
  );
}

export default App;
