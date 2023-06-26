import React from 'react';
import styled from './Button.module.css';

type Props = {
    type: "primary" | "secondary"
    variant?: "outline"
    handleClick?: {(e: React.MouseEvent<HTMLButtonElement>): void}
}

const Button: React.FC<Props> = ({ type, variant, children, handleClick }) => {
    return <button onClick={(e) => typeof handleClick == "function" && handleClick(e)} className={`${styled.button} ${styled[type]} ${variant && styled[variant]}`}>{children}</button>
}

export default Button;