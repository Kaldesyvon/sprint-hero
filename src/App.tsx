// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import { TeamMember } from './assets/teamMember';
// import TeamList from './components/TeamList';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <TeamList/>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import styled from 'styled-components';
import NameList from './NameList';
import Cookies from 'js-cookie';


// display: flex;
// flex-direction: column;
// align-items: center;
// margin: 20px;
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
  id: number;
  name: string;
  votes: number;
  comments: string[];
}

const App: React.FC = () => {
  const initialNames = [
    { id: 0, name: 'Aďo B.', votes: 0, comments: [] },
    { id: 1, name: 'Anka M.', votes: 0, comments: [] },
    { id: 2, name: 'Daniel R.', votes: 0, comments: [] },
    { id: 3, name: 'Ivan O.', votes: 0, comments: [] },
    { id: 4, name: 'Kika K.', votes: 0, comments: [] },
    { id: 5, name: 'Lenka N.', votes: 0, comments: [] },
    { id: 6, name: 'Martin N.', votes: 0, comments: [] },
    { id: 7, name: 'Samo S.', votes: 0, comments: [] },
    { id: 8, name: 'Tomas V.', votes: 0, comments: [] },
    { id: 9, name: 'Vlado K.', votes: 0, comments: [] },
  ]

  const [names, setNames] = useState<Name[]>(initialNames);

  const handleReset = () => {
    setNames(initialNames);
    Cookies.remove('votedName');
  };

  return (
    <div className="base">
      <AppContainer>
        <Title>ISTC Sprint Hero</Title>
        <NameList names={names} setNames={setNames} />
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </AppContainer>

    </div>
  );
}

export default App;
