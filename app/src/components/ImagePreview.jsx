import { X } from 'lucide-react';

const ImagePreview = ({ imageUrl, onRemove }) => {
  if (!imageUrl) return null;

  return (
    <div className="relative inline-block">
      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-full h-64 object-cover rounded-lg shadow-md"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;
