import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NameList from './NameList';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const AppContainer = styled.div`
  text-align: center;
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ResetButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 0.8rem;
  cursor: pointer;
`;

export interface Name {
  id: string;
  name: string;
  votes: number;
  comments: { [key: string]: string };
}

const App: React.FC = () => {
  const [names, setNames] = useState<Name[]>([]);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const fetchNames = async () => {
      console.log("connecting...")
      try {
        const namesCollection = collection(db, 'names');
        const snapshot = await getDocs(namesCollection);
        const namesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Name[];
        setNames(namesList);
        console.log('Connected to Firestore successfully.');
      } catch (error) {
        console.error('Error connecting to Firestore:', error);
      }
    };

    const subscribeToUpdates = () => {
      const namesCollection = collection(db, 'names');
      onSnapshot(namesCollection, snapshot => {
        const namesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Name[];
        setNames(namesList);
      });
    };

    fetchNames();
    subscribeToUpdates();

    const timer = setTimeout(() => {
      setConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    const resetNames = names.map(name => ({ ...name, votes: 0, comments: {} }));
    resetNames.forEach(async name => {
      const nameDoc = doc(db, 'names', name.id);
      await updateDoc(nameDoc, { votes: 0, comments: {} });
    });
    setNames(resetNames);
    Cookies.remove('votedName');
  };

  return (
    <div className="base">
      {confetti && <Confetti />}
      <AppContainer>
        <Title>ISTC Sprint Hero</Title>
        <NameList names={names} setNames={setNames} />
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </AppContainer>
    </div>
  );
}

export default App;
