import { ReactComponent as PassworD } from "../../Asset/icon/Vector (2).svg";
import React, { FC } from "react";

interface IconProps {
  color?: any;
  size?: any;
}

const Password: FC<IconProps> = ({ color, size }) => {
  return <PassworD width={size} height={size} style={{ fill: color }} />;
};

export default Password;