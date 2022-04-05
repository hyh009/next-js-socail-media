import classes from "./input.module.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { Avator } from "../../Common";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "../../Layout";

export const Input = ({
  label,
  type,
  name,
  value,
  changeHandler,
  icon,
  placeholder,
  require,
  invalid,
  setShowPassword,
  loading,
}) => {
  const Icon = icon;
  return (
    <div className={classes.container}>
      {label && (
        <label
          className={`${classes.label} ${
            require === "require" ? classes.required : ""
          }`}
        >
          {label}
        </label>
      )}
      <div
        className={`${classes.inputContainer} ${invalid && classes.invalid}`}
      >
        {icon && !loading && (
          <Icon
            style={{ cursor: name === "password" && "pointer" }}
            className={`${classes.icon}`}
            onClick={
              setShowPassword
                ? () => setShowPassword((prev) => !prev)
                : undefined
            }
          />
        )}
        {icon && loading && (
          <div className={classes.icon}>
            <Spinner />
          </div>
        )}
        <input
          className={classes.input}
          type={type}
          placeholder={placeholder}
          onChange={changeHandler}
          value={value}
          name={name}
        />
      </div>
    </div>
  );
};

export const InputWithAvator = ({
  usernmae,
  profilePicUrl,
  type,
  label,
  placeholder,
  name,
  value,
  changeHandler,
  require,
  invalid,
}) => {
  return (
    <div className={classes.container}>
      {label && (
        <label
          className={`${classes.label} ${
            require === "require" ? classes.required : ""
          }`}
        >
          {label}
        </label>
      )}
      <div
        className={`${classes[`box-shadow-inputContainer`]} ${
          invalid && classes.invalid
        }`}
      >
        <Avator src={profilePicUrl} alt={usernmae} size="small" />
        <input
          className={classes.input}
          type={type}
          placeholder={placeholder}
          onChange={changeHandler}
          value={value}
          name={name}
        />
      </div>
    </div>
  );
};

export const TextArea = ({
  label,
  name,
  value,
  placeholder,
  changeHandler,
  cols,
  rows,
  require,
}) => {
  return (
    <div className={classes.container}>
      {label && (
        <label
          className={`${classes.label} ${
            require === "require" ? classes.required : ""
          }`}
        >
          {label}
        </label>
      )}
      <textarea
        className={classes.textarea}
        name={name}
        cols={cols ? cols : "30"}
        rows={rows ? rows : "5"}
        value={value}
        placeholder={placeholder}
        onChange={changeHandler}
      ></textarea>
    </div>
  );
};

export const GooglePlaceAutoCompelete = (props) => {
  const { setAddress, address } = props;
  const Icon = props.icon;
  const handleSelect = async (value) => {
    setAddress(value);
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes[`autoComplete-container`]}>
            <div className={classes[`autoComplete-input-container`]}>
              <Icon />
              <input
                {...getInputProps({
                  placeholder: props.placeholder,
                  className: classes["place-input"],
                })}
              />
            </div>
            <div className={classes.suggestion}>
              {loading ? (
                <div className={classes[`suggestion-items`]}>...loading</div>
              ) : null}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? classes["suggestion-items-active"]
                  : classes["suggestion-items"];
                const key = uuidv4();
                return (
                  <div key={key}>
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      <Icon className={classes[`location-icon`]} />
                      <span>{suggestion.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};
