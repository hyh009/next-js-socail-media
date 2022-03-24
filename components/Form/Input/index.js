import classes from "./input.module.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { Avator } from "../../Common";
import { v4 as uuidv4 } from "uuid";

export const Input = (props) => {
  const Icon = props.icon;
  return (
    <div className={classes.container}>
      {props.label && (
        <label
          className={`${classes.label} ${
            props.require === "require" ? classes.required : ""
          }`}
        >
          {props.label}
        </label>
      )}
      <div
        className={`${classes.inputContainer} ${
          props.invalid && classes.invalid
        }`}
      >
        {props.icon && (
          <Icon
            style={{ cursor: props.name === "password" && "pointer" }}
            className={`${classes.icon} ${
              props.iconAnimation === "spin" && classes.spin
            }`}
            onClick={
              props?.setShowPassword
                ? () => props.setShowPassword((prev) => !prev)
                : undefined
            }
          />
        )}
        <input
          className={classes.input}
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.changeHandler}
          value={props.value}
          name={props.name}
        />
      </div>
    </div>
  );
};

export const InputWithAvator = (props) => {
  return (
    <div className={classes.container}>
      {props.label && (
        <label
          className={`${classes.label} ${
            props.require === "require" ? classes.required : ""
          }`}
        >
          {props.label}
        </label>
      )}
      <div
        className={`${classes[`box-shadow-inputContainer`]} ${
          props.invalid && classes.invalid
        }`}
      >
        <Avator src={props.profilePicUrl} alt={props.usernmae} size="small" />
        <input
          className={classes.input}
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.changeHandler}
          value={props.value}
          name={props.name}
        />
      </div>
    </div>
  );
};

export const TextArea = (props) => {
  return (
    <div className={classes.container}>
      {props.label && (
        <label
          className={`${classes.label} ${
            props.require === "require" ? classes.required : ""
          }`}
        >
          {props.label}
        </label>
      )}
      <textarea
        className={classes.textarea}
        name={props.name}
        cols={props?.cols ? props.cols : "30"}
        rows={props?.rows ? props.rows : "5"}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.changeHandler}
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
