import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import CommentsModal from './CommentsModal';
import { Name } from './App';
import Cookies from 'js-cookie';
import { readFileSync } from 'fs';

const ItemContainer = styled.div<{ isFirst: boolean }>`
  color: lightgray;
  font-size: xx-large;
  border-style: solid;
  border-color: gray;
  border-width: 3px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 60%
  ${(props) =>
    props.isFirst &&
    css`
      font-size: xxx-large;
      font-weight: bold;
    `}
`;

const NameDisplay = styled.div`
  flex-grow: 1;
`;

const Button = styled.button`
  margin-left: 10px;
`;

interface NameItemProps {
  name: Name;
  setNames: React.Dispatch<React.SetStateAction<Name[]>>;
  names: Name[];
  index: number;
}

const NameItem: React.FC<NameItemProps> = ({ name, setNames, names, index }) => {
  const [showComments, setShowComments] = useState(false);

  const handleVote = () => {
    const votedName = Cookies.get('votedName');
    if (votedName) {
      alert('You have already voted for a name.');
      return;
    }

    setNames(
      names.map((n) => (n.id === name.id ? { ...n, votes: n.votes + 1 } : n))
    );
    Cookies.set('votedName', name.id.toString(), { expires: 365 });
  };

  return (
    <ItemContainer isFirst={index === 0}>
      <NameDisplay>{name.name}</NameDisplay>
      <div>{name.votes}</div>
      <Button onClick={handleVote}>Vote</Button>
      <Button onClick={() => setShowComments(true)}>Expand</Button>
      {showComments && (
        <CommentsModal
          name={name}
          setNames={setNames}
          names={names}
          onClose={() => setShowComments(false)}
        />
      )}
    </ItemContainer>
  );
}

export default NameItem;