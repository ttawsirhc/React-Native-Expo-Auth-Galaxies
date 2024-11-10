// let's begin by a few Imports
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // we also import the SecureStore

/*
let's begin with an auth props interface so that's going to be the interface of our provider
that will make it a lot easier to interact and get all of the information
we can actually put this to the side for a moment ...
*/
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
} // end interface AuthProps

/*
also added, right to the beginning a key so this will be the key 
under which we're going to find our JWT or whatever you want to store in SecureStorage 
*/
const TOKEN_KEY = 'my-jwt';
/*
the API URL I'm just going to use my own API at api.develop Adder apps
you can also do this for testing you can check out the documentation here
pretty much what we're going to use is a post to users to register a user
and a slash auth to get a JWT and then some of the other calls
just to test if we are allowed to make a request by the way
you can also run this locally you can find all of this on galaxies.dev
in the tutorial link below this video
*/
export const API_URL = 'https://localhost:8000/api/user/login/'; // this will need to change when it's mine
// so then we're going to add our AuthContext
const AuthContext = createContext<AuthProps>({});

// um an easy export so we got our use of that we can import just like a hook in our pages 
export const useAuth = () => {
    return useContext(AuthContext);
} // end export const useAuth

/*
then the actual const auth provider begins; just the default setup for context;
I'm gonna just add any in here; and then this provider will manage a few things
*/ 
export const AuthProvider = ({children}: any) => {
    /*
    now we just need to make sure that we Implement all the functionalities
    and also cover the state so the state in here is our authState
    it will be either null so this would be the initial case
    as we initialize it with that or have some information about the token
    and the flag for authenticated so looks more complicated than it actually is
    it is just a state
    */
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    }); // end const authState

    /*
    now there's one more thing that we need to take care of and that is
    once we start the application, so we are writing the item to storage
    where um we're not loading we're deleting it but we are not loading it
    so let's add a useEffect to our auth provider which will be called
    right when our application starts; so there we go

    we don't have any dependencies for our useEffect today; so on load we check:
    is there a totem (token) and if we do get back a totem (token) (see if statement below ...)
    */
    useEffect(() => {
        // we're just going to implement a load token because that's going to be an asynchronous function 
        const loadToken = async () => {
            // that's the setup we want to have and now what we need is of course grabbing the token from our SecureStorage 
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            // let's put a little log in here so we can later see this uh stored token
            console.log("stored:", token)
            /*
            if we do have that total (token) we of course can just say okay then
            we're going to use this for our headers and we're going to also update our state
            with that information because then we can immediately log in our user 
            */
            if (token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true

                });
            }
        } // end const loadToken
        loadToken(); // I'm just going to call this (loadToken function) afterwards from here 
    }, []) // end useEffect
    /*
    and now we need two or maybe we need three functions in here
    we need register
    so let me bring them in one by one; we're going to start with probably the registration
    because that's actually the easiest call so to register our users
    we just need to make an axios.post request using axios to our API_URL/users
    and pass the email and password to it nothing else a standard registration
    */
    const register = async (email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/users`, {email, password});
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        } // end try
    }; // end const register
    /*
    we need login
    so we got the whole flow from our login page to the other pages

    now once we log in it gets interesting because in the login case
    (copy and paste register code above) we can pretty much start with that again
    */
    const login = async (email: string, password: string) => {
        try {
            // original: return await axios.post(`${API_URL}/auth`, {email, password});
            /*
            so we need email and password again for the login we're making a post request to the auth endpoint this time
            so I'm going to say const result in this case because we're actually interested in it

            */
            const result = await axios.post(`${API_URL}/auth`, {email, password});
            console.log(" ~ file: AuthContext.tsx:41 ~ login ~ result:", result)

            /*
            and now once we get back the data here  I'm gonna first of all update our state
            we gonna add the total (token) that we get back from the API to our state
            and we're going to say okay the user is now authenticated

            and you can already imagine that in the end we're gonna do the opposite
            we lock all the user we're going to reset that back to zero 
            */
            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            /*
            now the important part of the JWT authentication is that you're gonna attach that header
            or the key or the token or whatever you want to call it to all the future requests
            that you make to the API to show that you are authenticated and we can do this by using axis
            and that's why I installed it in the beginning 

            this is a bit harder with fetch to implement an Interceptor with axios
            we can just say default.headers.common equals this and then for every request
            that we do with axios our totem (token) will be easily attached and we can also
            have more sophisticated logic with axios, but that is basically everything that we need

            at least for my API, if you have a different API that you're using
            make sure some expect to some expected in a different way but usually
            it's in the authorization header and then Bearer and the token
            */
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            /*
            now what we also want to do of course at this point is store the total (token)
            so we got it next time when we start the app because it might still be valid
            so we now use the SecureStore from Expo and say setItemAsync
            and to this function we're going to passva key which we defined up there
            because I don't like to have strings in here I don't want to make a typo
            and then I'm not loading the key or I'm not setting it correctly
            so I'm going to use my const here and then the value is of course result.data.token
            */
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            // cool and then we have stored this and we can just return the result to whoever is interested in this 
            return result;
        
        // otherwise we can just return our error again and that's pretty much it 
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        } // end try
    }; // end const login

    /*
    and we need sign out
    now once we want to log out the user we just need to do the whole opposite of this
    we don't need to make an HTTP call by the way to the API that's not required
    but what we need is delete the item, reset the header, and then reset our authentication state
 
    */
    const logout = async () => {
        // Delete token from storage
        await SecureStore.deleteItemAsync(TOKEN_KEY)

        // Update HTTP Headers
        axios.defaults.headers.common['Authorization'] = '';

        // Reset auth state
        setAuthState({
            token: null,
            authenticated: false
        });
    } // end const logout
    
    /*
    and by the way everything that we do (in register above) goes to our value here
    we just need to make sure that we follow the interface AuthProps, above, ...
    */
    const value = {
        /*
        to keep this consistent with the interface authProps, at the top of this file,
        we need to call this on onRegister: register and then the value would be happy

        so once we got all of these three things in place the user is pretty much locked out
        and at the top level of our app, we're gonna check for the authentication state
        so if the state changes we'revgonna automatically render our login page instead of the inside area again

        and now we just need to make sure that we're actually putting everything in here so onLogin, 
        onLogout, and then we also should have the authState in here; perfect
        */
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }; // end const value

    // um but most importantly in the end we're gonna return this object which wraps the context around all of the children 
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

} // end export const AuthProvider