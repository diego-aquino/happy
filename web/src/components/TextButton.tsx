/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { ButtonHTMLAttributes } from 'react';

import '../styles/components/TextButton.css';

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'green' | 'green-dark' | 'red';
}

const TextButton: React.FC<TextButtonProps> = (props) => {
  const { color, className, children, ...rest } = props;

  return (
    <button
      className={`
        textButton textButton--${color}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default TextButton;
