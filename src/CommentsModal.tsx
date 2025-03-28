import React, { useState } from 'react';
import styled from 'styled-components';
import { Name } from './App';
import { db } from './firebase';
import { ref, update } from 'firebase/database';

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #282c34;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 80%;
  max-width: 600px;
  color: white;
  border-radius: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  padding: 5px 0;
  border-bottom: 1px solid gray; 
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const CommentInput = styled.input`
  width: calc(100% - 90px);
  padding: 5px;
  margin-right: 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const Button = styled.button`
  background: #61dafb;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background: #21a1f1;
  }
`;

interface CommentsModalProps {
  name: Name;
  setNames: React.Dispatch<React.SetStateAction<Name[]>>;
  names: Name[];
  onClose: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ name, setNames, names, onClose }) => {
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    if (comment.trim()) {
      let updatedComments: { [key: string]: string };
      if (name.comments["0"] === "none") {
        updatedComments = { 0: comment };
      } else {
        updatedComments = { ...name.comments, [Object.keys(name.comments).length.toString()]: comment };
      }
      
      const updatedNames = names.map(n =>
        n.id === name.id
          ? { ...n, comments: updatedComments }
          : n
      );
      setNames(updatedNames);

      const nameRef = ref(db, `names/${name.id}`);
      await update(nameRef, { comments: updatedComments });

      setComment('');
    }
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <ModalContainer>
        <h2>Comments for {name.name}</h2>
        <CommentList>
          {Object.values(name.comments).map((comment, index) => (
            <CommentItem key={index}>{comment}</CommentItem>
          ))}
        </CommentList>
        <CommentInput
          type="text"
          value={comment}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setComment(e.target.value)}
        />
        <ButtonContainer>
          <Button onClick={handleAddComment}>Add Comment</Button>
          <Button onClick={onClose}>Close</Button>
        </ButtonContainer>
      </ModalContainer>
    </>
  );
}

export default CommentsModal;