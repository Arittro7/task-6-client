import { useRef } from 'react';
import Draggable from 'react-draggable';

function TextBlock({ element, onUpdate }) {
  
  const nodeRef = useRef(null); 
  

  const handleStop = (e, data) => {
    onUpdate(element.id, { x: data.x, y: data.y });
  };

  const handleChange = (e) => {
    onUpdate(element.id, { text: e.target.value });
  };

  return (
    
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: element.x, y: element.y }}
      onStop={handleStop}
      nodeRef={nodeRef} 
    >
      <div ref={nodeRef} className="absolute p-1 border-2 border-dashed border-red-400 bg-white bg-opacity-75 hover:border-solid" style={{ width: 250 }}>
        <div className="drag-handle cursor-move bg-blue-700 text-white text-xl px-2 py-0.5 w-full text-center">
          Move
        </div>
        <textarea
          defaultValue={element.text}
          onChange={handleChange}
          className="w-full h-24 p-2 bg-transparent focus:outline-none resize-y"
          placeholder="Type something..."
        />
      </div>
    </Draggable>
  );
}

export default TextBlock;