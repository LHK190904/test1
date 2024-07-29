import React from "react";
import { Steps } from "antd";

const { Step } = Steps;

const Stepper = ({ currentStep }) => {
  const steps = ["25%", "50%", "75%", "100%"];

  return (
    <Steps current={currentStep - 1} size="default">
      {steps.map((step, index) => (
        <Step key={index} title={step} />
      ))}
    </Steps>
  );
};

export default Stepper;
