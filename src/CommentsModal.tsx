import React, { useState } from 'react';
import styled from 'styled-components';
import { Name } from './App';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
`;

const CommentInput = styled.input`
  width: calc(100% - 90px);
  padding: 5px;
  margin-right: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
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
      const updatedComments = { ...name.comments, [Object.keys(name.comments).length]: comment };
      const updatedNames = names.map(n =>
        n.id === name.id
          ? { ...n, comments: updatedComments }
          : n
      );
      setNames(updatedNames);

      const nameDoc = doc(db, 'names', name.id);
      await updateDoc(nameDoc, { comments: updatedComments });

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
          onChange={(e: any) => setComment(e.target.value)}
        />
        <Button onClick={handleAddComment}>Add Comment</Button>
        <Button onClick={onClose}>Close</Button>
      </ModalContainer>
    </>
  );
}

export default CommentsModal;
