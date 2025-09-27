import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  rows,
  ...props 
}) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <InputComponent
        id={name}
        name={name}
        type={type === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`form-control ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormInput;
