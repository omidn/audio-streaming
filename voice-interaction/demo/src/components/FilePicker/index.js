import React from 'react';
import Fab from '@material-ui/core/Fab';
import withState from 'recompose/withState';
import FileAttachIcon from '@material-ui/icons/AttachFile';
import styles from './styles.css';

const FilePicker = ({ onFileSelected, setFileInput, input }) => {
  const onClickHandler = () => {
    if (input) {
      input.click();
    }
  }

  const onHandleFilePicked = (e) => {
    if (e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
      input.value = '';
    }
  };
  
  return (
    <Fab color="primary" onClick={onClickHandler}>
      <FileAttachIcon />
      <input ref={setFileInput} type="file" className={styles.fileInput} onChange={onHandleFilePicked} />
    </Fab>
  );
};

export default withState('input', 'setFileInput', null)(FilePicker);
