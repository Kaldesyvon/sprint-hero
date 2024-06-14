import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NameList from './NameList';
import Cookies from 'js-cookie';
import Confetti from 'react-confetti';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

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

const FinishButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #61dafb;
  border: none;
  color: black;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #21a1f1;
  }
`;

export interface Name {
  id: string;
  name: string;
  votes: number;
  comments: { [key: string]: string };
}

const App: React.FC = () => {
  const [names, setNames] = useState<Name[]>([]);
  const [showVotes, setShowVotes] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const fetchNames = () => {
      try {
        console.log("fetching");
        const namesRef = ref(db, 'names');
        onValue(namesRef, (snapshot) => {
          console.log("got database");
          const data = snapshot.val();
          const namesList = data
            ? Object.keys(data).map(key => ({ id: key, name: data[key].name, votes: data[key].votes, comments: data[key].comments }))
            : [];
          setNames(namesList);
          console.log('Connected to Realtime Database successfully.');
        });
      } catch (e) {
        console.log("failed to fetch: " + (e as Error).message);
      }
    };

    fetchNames();
  }, []);

  const handleReset = () => {
    const resetNames = names.map(name => ({ ...name, votes: 0, comments: { "0": "none" } }));
    resetNames.forEach(async name => {
      const nameRef = ref(db, `names/${name.id}`);
      await set(nameRef, { ...name, votes: 0, comments: { "0": "none" } });
    });
    setNames(resetNames);
    Cookies.remove('votedName');
    setShowVotes(false);
    setConfetti(false);
  };

  const handleFinish = () => {
    setShowVotes(true);
    setConfetti(true);
  };

  const sortedNames = showVotes ? [...names].sort((a, b) => b.votes - a.votes) : names;

  return (
    <div className="base">
      {confetti && <Confetti />}
      <AppContainer>
        <FinishButton onClick={handleFinish}>Finish</FinishButton>
        <Title>ISTC Sprint Hero</Title>
        <NameList names={sortedNames} setNames={setNames} showVotes={showVotes} />
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </AppContainer>
    </div>
  );
}

export default App;
