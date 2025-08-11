import { RenderElementProps } from "slate-react";

const CheckboxElement = ({ attributes, children, element }: RenderElementProps) => {
  const { checked } = element;

  return (
    <div {...attributes}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        style={{ marginRight: '0.5rem' }}
      />
      <span>{children}</span>
    </div>
  );
};

export default CheckboxElement
