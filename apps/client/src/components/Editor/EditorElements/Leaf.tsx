import { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
  const { bold, underline, italic, color, backgroundColor, fontSize } =
    props.leaf;

  const style: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    backgroundColor: backgroundColor,
  };

  return (
    <span {...props.attributes} style={style}>
      {props.children}
    </span>
  );
};

export default Leaf;
