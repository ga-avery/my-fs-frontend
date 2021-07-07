import './FileUploader.css';
import { useState, memo, useEffect } from "react";
const BACKEND = process.env.BACKEND;
const TextToClip = props => {
  const { text } = props;

  const copy = event => {
    event.stopPropagation();
    event.preventDefault();
    const copy = document.createElement('textarea');
    copy.textContent = text;
    copy.style.position = 'fixed';
    copy.style.left = '-900';
    copy.style.top = '-900';
    document.body.appendChild(copy);
    copy.select();
    document.execCommand('copy');
    copy.remove();
  };

  return (
    <span
      onClick={copy}
      className="fileUploader__clip"
    >{text}
    </span>
  );
};


const Upload = props => {
  const { file, isAuthenticated, files, setFiles } = props;
  const id = props?.user?.id;
  const [progress, setProgress] = useState(0);
  const [copy, setCopy] = useState('');


  useEffect(() => {
    console.log('Upload', id);
    const request = new XMLHttpRequest();
    request.open('POST', `${BACKEND}/`);
    // in the future do this instead of the easily hackable solution following
    // if (localStorage.getItem('jwt')) {
    //   request.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
    // }
    if (isAuthenticated) {
      request.setRequestHeader('X-User-ID', id);
    }
    const data = new FormData();
    data.append('file', file);
    request.upload.addEventListener('progress', event => {
      setProgress(event.loaded / event.total);
    });
    request.addEventListener('readystatechange', _ => {
      if (request.readyState === XMLHttpRequest.DONE) {
        setCopy(request.responseText);
        setFiles(files.concat(request.responseText));
      }
    });
    request.send(data);
    // eslint-disable-next-line
  }, [file]);

  return (
    <div className="fileUploader__upload">
      <span className="fileUploader__uploadContent">
        {file.name} <br />
        <progress max="1" value={progress} /> <br />
        {copy ? <TextToClip text={copy} /> : ''}
      </span>
    </div>
  );
};
const MemoizedUpload = memo(Upload);

export const FileUploader = props => {
  const [files, setFiles] = useState([]);

  /**
   * @param {DragEvent} event 
   */
  const onDrop = async event => {
    event.stopPropagation();
    event.preventDefault();
    let items;
    if (event.dataTransfer.items) {
      items = Array.from(event.dataTransfer.items)
        .filter(item => item.kind === 'file' && item.type !== '')
        .map(item => item.getAsFile());
    } else {
      items = [];
      for (const file of event.dataTransfer.files) {
        items.push(file);
      }
    }
    setFiles(files.concat(items));
  };


  /**
   * @param {DragEvent} event 
   */
  const onDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div className="fileUploader"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span>drag files here...</span>
      {
        files.length
          ? files.map((file, idx) => <MemoizedUpload {...props} key={idx} file={file} />)
          : ''
      }
    </div>
  );
  // }
};
