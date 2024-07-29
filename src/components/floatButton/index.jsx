import React, { useState } from "react";

function FloatButton() {
  const [isAtTop, setIsAtTop] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsAtTop(true);
  };

  return (
    <button
      onClick={handleScrollTop}
      className="fixed bottom-10 right-12 bg-[#F7EF8A] hover:bg-[#F7EF8A] text-black font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out ${isAtTop ? 'invisible' : 'visible'}"
    >
      ↑
    </button>
  );
}

export default FloatButton;
