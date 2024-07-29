import React from "react";
import { useInView } from "react-intersection-observer";

const RevealAppear = ({ children }) => {
  const { ref, inView } = useInView({
    // triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

export default RevealAppear;
