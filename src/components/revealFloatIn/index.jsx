import React from "react";
import { useInView } from "react-intersection-observer";

const RevealFloatIn = ({ children, floatDirection }) => {
  const { ref, inView } = useInView({
    // triggerOnce: true,
    threshold: 0.1,
  });

  const floatClass =
    floatDirection === "left" ? "-translate-x-20" : "translate-x-20";

  return (
    <div
      ref={ref}
      className={`transition-transform duration-1000 ease-out transform ${
        inView ? "translate-x-0 opacity-100" : `${floatClass} opacity-0`
      }`}
    >
      {children}
    </div>
  );
};

export default RevealFloatIn;
