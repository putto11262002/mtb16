// src/components/islands/LogoPlaceholder.jsx

const LogoPlaceholder = ({ imageUrl, imageAlt }) => {
  return (
    <div className="w-32 h-32 flex items-center justify-center">
      <img src={imageUrl} alt={imageAlt} className="max-w-full max-h-full object-contain" />
    </div>
  );
};

export default LogoPlaceholder;
