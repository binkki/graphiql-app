import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDywaHdLzno6bWQSuJM3k9Gs3iitH4uMfY",
  authDomain: "remix-rest-graphiql.firebaseapp.com",
  projectId: "remix-rest-graphiql",
  storageBucket: "remix-rest-graphiql.appspot.com",
  messagingSenderId: "559939881844",
  appId: "1:559939881844:web:2c31713a52a3f9ebc6ba21",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
