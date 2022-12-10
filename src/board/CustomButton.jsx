import { useState } from "react";

export default function CustomButton({ resetBoard }) {
  // Used for button animation
  const [effect, setEffect] = useState(false);

  function handleClick() {
    setEffect(true);
    resetBoard();
  }

  return (
    <button
      onClick={handleClick}
      className={`${
        effect && "animate-wiggle"
      } m-2 rounded-md bg-green-600 px-4 py-2 text-2xl font-bold hover:scale-90 hover:bg-green-400`}
      onAnimationEnd={() => setEffect(false)}
    >
      Start
    </button>
  );
}
