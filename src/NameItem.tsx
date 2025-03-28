import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import CommentsModal from './CommentsModal';
import { Name } from './App';
import Cookies from 'js-cookie';
// import { db } from './firebase';
import { ref, update } from 'firebase/database';

const ItemContainer = styled.div<{ isFirst: boolean, showVotes: boolean, hasVotes: boolean }>`
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
  width: 60%;
  max-width: 600px;

  ${(props) =>
    props.isFirst && props.showVotes && props.hasVotes &&
    css`
      font-size: xxx-large;
      font-weight: bold;
      width: 80%;
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
  showVotes: boolean;
}

const NameItem: React.FC<NameItemProps> = ({ name, setNames, names, index, showVotes }) => {
  const [showComments, setShowComments] = useState(false);

  const handleVote = async () => {
    const votedName = Cookies.get('votedName');
    if (votedName) {
      alert('You have already voted for a name.');
      return;
    }

    const updatedNames = names.map(n => n.id === name.id ? { ...n, votes: n.votes + 1 } : n);
    setNames(updatedNames);

    // const nameRef = ref(db, `names/${name.id}`);
    // await update(nameRef, { votes: name.votes + 1 });

    Cookies.set('votedName', name.id.toString(), { expires: 365 });
  };

  return (
    <ItemContainer isFirst={index === 0} showVotes={showVotes} hasVotes={name.votes > 0}>
      <NameDisplay>{name.name}</NameDisplay>
      {showVotes && <div>{name.votes}</div>}
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
