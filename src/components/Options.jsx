import React from "react";

const Options = props => {
  return (
    <div className="options">
      <div onClick={props.hit}>Hit</div>
      <div onClick={props.stand}>Stand</div>
      <div onClick={props.doubleDown}>Double Down</div>
    </div>
  );
};

export default Options;
