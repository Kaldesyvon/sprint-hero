import React from 'react';
import styled from 'styled-components';
import NameItem from './NameItem';
import { Name } from './App';

const ListContainer = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface NameListProps {
  names: Name[];
  setNames: React.Dispatch<React.SetStateAction<Name[]>>;
  showVotes: boolean;
}

const NameList: React.FC<NameListProps> = ({ names, setNames, showVotes }) => {
  return (
    <ListContainer>
      {names.map((name, index) => (
        <NameItem key={name.id} name={name} setNames={setNames} names={names} index={index} showVotes={showVotes} />
      ))}
    </ListContainer>
  );
}

export default NameList;
