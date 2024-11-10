import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'; // add useEffect for use below ...
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
    /*
    AFTER TESTING THE USEEFFECT BELOW IN LOGIN.TSX:
    First, test the useEffect example in the original code at the bottom (also SEE COMMENTS below)...
    Then, replace all of that code with the following code:
    so if we wanted to make this simple I could change this view now to be something like the code that follows
    */
    const [users, setUsers] = useState<any[]>([]); // a little useState for users

    /*
    then I'm calling all the users; and then I'm displaying them in a list
    I did set the key each child launches a list I should have a unique key
    NOTE!: it's underscore ID I'm sorry that should fix it
    we're automatically logged in because of the logic we implemented in our App.tsx 
    */
    useEffect(() => {
        const loadUser = async () => {
            try{
                // make a call to a protected endpoint
                const result = await axios.get(`${API_URL}/users`);
                setUsers(result.data);
            } catch (e: any) {
                alert(e.message);
            }
        };
        loadUser();
    }, []) // end useEffect

    return (
        <ScrollView>
            {users.map((user) => (
                <Text key={user._id}>{user._id}</Text>
            ))}
        </ScrollView>
    );

    /*
    now the interesting question is if we put the call we got here (in Login.tsx) on the login screen
    into our home screen would we see a result and on the home page, I actually want to have result.data
    (on the console.log line ...); If we run that, this is it we are getting datar here on the login page
    (on the console.log in the developer tools in the browser ...) 
    */

    /*
    // original code for Home.tsx
    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/users`);
            console.log(' ~ file: Login.tsx:16 ~ testCall ~result:', result.data);
        };
        testCall();
    }, []) // end useEffect

    return (
        <View>
            <Text>Home</Text>
        </View>
    );
    */

};

export default Home;