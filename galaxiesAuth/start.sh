npx create-expo-app galaxiesAuth -t expo-template-blank-typescript
cd ./galaxiesAuth

#  axios: You can use fetch these days but axios allows us to easily manage the header  
#  also, we will have to attach our bearer token later to the API calls so use axios
npm install axios
# II. install react navigation
# a. Then we can have a little stack navigation and
# b. switch between the login page and our inside page and for that we also need to
npm install @react-navigation/native @react-navigation/native-stack

# run Expo install react-native-screens, right native safe area context
npx expo install react-native-screens react-native-safe-area-context
# finally we're gonna add the Expo secure store
# so that is the most important part probably because this is the package
# that we're going to use to actually store our JWT once we get it from the
# API and to use that 
npx expo install expo-secure-store