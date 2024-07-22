/* eslint-disable react/prop-types */

const Input = ({ placeholder, name, handleInput, value }) => {
  return (
    <div>
      <input
        className="input-field"
        placeholder={placeholder}
        name={name}
        onChange={handleInput}
        value={value}
      />
    </div>
  );
};

export default Input;
