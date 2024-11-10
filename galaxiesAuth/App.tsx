import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AuthProvider } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home'; // remember to add this import ...
import Login from './app/screens/Login';
import { useAuth } from './app/context/AuthContext'

/*
of course so if we want to create the simple push stack navigation,
we're going to use createNativeStackNavigator so that is our stack, used below for <Stack.Navigator>
*/
const Stack = createNativeStackNavigator();

/*
now it begins: we're gonna wrap our whole application in the just created AuthProvider
and now we can have the stack and screens in here 
*/
export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
} // end export default function App

/*
I kind of like to have like my own little layout and we could probably have this in a different file
but for now I'm just going to do it in here so I'm just going to call this Layout
and then we're going to use the <Navigation> container to build our navigation
so a navigation container that will be wrapped around everything and in here (above)
we're gonna have our <Layout>; great now we just need a bit more for the layout ...

and within the navigation container inside of the navigation container we can now say <Stack.Navigator>
and within that stack Navigator we're gonna Define the different screens of our app

so as we want to make this dependent on the authentication State we're gonna now use our hook
that we added which exports the authState and on logout we're gonna get this from use authentication
so that is also why this statement can't be up here because then we don't have access to the authentication provider yet
the <Layout> is a child of the <AuthProvider> so we can actually access it through the context
that is the important part here to make the logic work and now we can say okay what's the authState.authenticated
if we are authenticated we're gonna of course show the inside area in my case that's just the the Home component
so Home component would be home; in the other case which means we're not authenticated,
we're gonna use <Stack.Screen> and that is gonna be the login and also component log in

additionally we probably want to have for the home page a little button to logout the user
so you can do this with the navigation uh by just setting the options to an object
and then for header right we can pass in a button or whatever we want and the cool thing is
at this point we have the onLogout function so we don't even need to do some manual injection
or whatever in the inside page we can just do this from here and manage everything from here
and really this line (authState?.authenticated ?) is all the magic we need to protect our app
*/
export const Layout = () => {
  const { authState, onLogout } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <Stack.Screen name="Home" 
          component={Home}
          options={{
            headerRight: () => <Button onPress={onLogout} title="Sign Out" />
          }}></Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        )
        }

      </Stack.Navigator>
    </NavigationContainer>
  )
} // end export const Layout

/*

*/


/*
// original code ...
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/