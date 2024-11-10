 // remember to import the Text, StyleSheet, TextInput, and Button, used below ... 
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import React, { useEffect } from 'react'; // add useEffect for use below ...
import { useState } from 'react';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    // So for the login what we need is of course two input fields for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // and we're gonna also get on login and on register from our useAuth hook
    const { onLogin, onRegister} = useAuth();

    /*
    let's try something: I'm going to add a useEffect here to make (AND TEST!) a simple API call
    grab the AuthContext (possibly just getting the route to his local API??)
    TEST by doing something like get all users; we're gonna try this
    const testCall and no dependency; so this is just a verification that our stuff actually works
    we want to check if we can get a result right here on this login page and I highly doubt it
    because let's see where are we axios request failed with status code 401 which
    basically means we are not authenticated to make this request and that is good news
    because that means we're trying to access something from the API but we're not allowed to do that 
    */
    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/users`);
            console.log(' ~ file: Login.tsx:16 ~ testCall ~result:', result);
        };
        testCall();
    }, []) // end useEffect

    /*
    so the cool thing is because we have the API calls and the token handling all
    inside of our Provider (see AuthContext.tsx), our functions here for the actual login
    and registration are pretty easy because we just need to call onRegister or onLogin (from AuthContext.tsx)
    with email and password and then either show a result or pretty much do nothing
    because that will update the authState and our App.tsx our authState will automatically
    switch to the login area (see the Layout function ...)
    */
    const login = async () => {
        const result = await onLogin!(email,password);
        if (result && result.error) {
            alert(result.msg);
        }
    }; // end const login

    // We automatically call the login after a successful registration
    /*

    */
    const register = async () => {
        const result = await onRegister!(email, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            /*
            additionally I made a little change here so automatically after register,
            I call login because my API has no kind of verification of the email 
            */
            login();
        }
    }; // end const register

    // original code: <Text>Login</Text>
    /*
    with that in place let's quickly build our login view; I'm going to use a simple view; it's just a standard view setup 
    we get the text inputs onChange we're gonna use setEmail or setPassword and for password
    we've also set secureTextEntry to make sure that this actually looks like a password input cool
    besides that we have our two buttons for login and registration 
    */
    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password} />
                <Button onPress={login} title="Sign In" />
                <Button onPress={register} title="Create Account" />
                </View>
        </View>
    ); // end return

}; // end const Login

/*
for the view we definitely want to have some kind of styling so let's put this here
I'm also going to add a few Styles and then I'm going to walk you through
what we just did here so here we go:
*/
const styles = StyleSheet.create({
    form: { /* then our Form */
        gap: 10, /* gap of 10 */
        width: '60%' /* here has a little gap between the elements and using 60 of the width */
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    container: { /* simple container - we actually have a container styling */
        alignItems: 'center', /* yeah we just align all the items in the center  */
        width: '100%'
    }
})

export default Login;