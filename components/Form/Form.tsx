import React, { FormEvent, HTMLInputTypeAttribute } from "react";
import styles from './Form.module.css';

type FormProps = {
    onSubmit: { (e: FormEvent<HTMLFormElement>): void }

}

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            {children}
        </form>
    )
}

export const FormSection: React.FC = ({ children }) => <div className={styles.section}>{children}</div>

type FormInputProps = {
    label: string
    type: HTMLInputTypeAttribute
    id: string
    value: string | number
    required?: boolean
    handleChange: {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void}
}

export const FormInput: React.FC<FormInputProps> = ({ type, label, id, value, required, handleChange }) => {
    return (
        <>
            <label htmlFor={id} >{label}</label>
            <input className={styles.input} type={type} id={id} name={id} onChange={handleChange} value={value} required={required} />
        </>
    )
}

export const FormTextArea: React.FC<Omit<FormInputProps, "type">> = ({ label, id, value, required, handleChange}) => {
    return (
        <>
            <label htmlFor={id} >{label}</label>
            <textarea className={`${styles.input} ${styles.textarea}`} id={id} onChange={handleChange} value={value} required={required} />
        </>
    )
}

export default Form;