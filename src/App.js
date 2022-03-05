import React, {useState, useRef} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBkgFgJectTX6hUPILDvGUA3bed_C1lGWY",
  authDomain: "superchat-99881.firebaseapp.com",
  projectId: "superchat-99881",
  storageBucket: "superchat-99881.appspot.com",
  messagingSenderId: "1019730784319",
  appId: "1:1019730784319:web:37b341f8775ecc9629c88a"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom(){

  const scrollCheck= useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(250);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagesRef.add({ 
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue("");

    scrollCheck.current.scrollIntoView({behavior: "smooth"});
  }

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/> )}

        <div ref={scrollCheck}></div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit">SEND</button>

      </form>

    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="img"/>
      <p>{text}</p>
    </div>
  )
}

export default App;
