import TextBlock from './TextBlock';

function Canvas({ elements, onUpdateElement }) {

  return (
    <div className="w-full h-full bg-orange-200 border-2 border-dashed rounded-lg relative overflow-hidden">
      {elements.map(el => {
        if (el.type === 'text') {
          return <TextBlock key={el.id} element={el} onUpdate={onUpdateElement} />;
        }
        return null;
      })}
    </div>
  );
}

export default Canvas;