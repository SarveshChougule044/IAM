const AuthFormInput = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rightElement = null,
}) => {
  const errorId = `${id}-error`;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required ? "(required)" : ""}
      </label>

      <div className="form-control">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? "form-input--error" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete={name}
        />
        {rightElement}
      </div>

      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default AuthFormInput;