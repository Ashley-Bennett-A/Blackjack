import React from "react";

const Chip = props => {
  let classes = `chip ${props.color}`;
  return (
    <div className={classes} onClick={() => props.addStake(props.value)}>
      {props.value}
    </div>
  );
};

export default Chip;
