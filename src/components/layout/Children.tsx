import React from "react";

interface ChildrenProps {
  children: React.ReactNode;
}

const Children: React.FC<ChildrenProps> = ({ children }) => {
  return <div style={{ minHeight: "80vh" }}>{children}</div>;
};

export default Children;
