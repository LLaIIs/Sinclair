import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EntradaScreen from './app/entrada';
import LoginScreen from './app/login';
import Login2Screen from './app/login2';
import Login3Screen from './app/login3';
import Login4Screen from './app/login4';
import RedefinirScreen from './app/redefinir';
import CadastroScreen from './app/cadastro';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entrada">
        <Stack.Screen name="Entrada" component={EntradaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="login2" component={Login2Screen} options={{ title: 'Inserir Senha' }} />
        <Stack.Screen name="login3" component={Login3Screen} options={{ title: 'Confirmar Número' }} />
        <Stack.Screen name="login4" component={Login4Screen} options={{ title: 'Inserir Número de Telefone' }} />
        <Stack.Screen name="redefinir" component={RedefinirScreen} options={{ title: 'Redefinir Senha' }} />
        <Stack.Screen name="cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
