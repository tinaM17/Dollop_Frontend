interface ButtonProps {
  text: string;
  backgroundColor?: string;
  onClick: () => void; // Include onClick prop
  className?: string; // Add className property
}

const Button = ({ text, backgroundColor = '#0084b4',onClick,className }: ButtonProps) => {
  const combinedClassName = `rounded ${className}`;

  return (
    <button className={combinedClassName} style={{ backgroundColor, color: 'white', border:'none' }} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;

