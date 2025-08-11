import { RenderElementProps } from "slate-react";

const DefaultElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const { textAlign, lineHeight, paraSpaceBefore, paraSpaceAfter, fontFamily } =
    element;

  const style: React.CSSProperties = {
    textAlign,
    lineHeight,
    marginTop: paraSpaceBefore,
    marginBottom: paraSpaceAfter,
    fontFamily,
  };

  return (
    <p {...attributes} style={style}>
      {children}
    </p>
  );
};

export default DefaultElement;
