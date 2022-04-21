import React,{Dispatch, SetStateAction} from "react"
import { InputTypes } from "../../../utils/types";
import classes from "./input.module.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { Avator } from "../../Common";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "../../Layout";
import { IconType } from "react-icons";
interface InputProps {
  name:string
  value:string
  type:InputTypes
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?:string
  Icon?:IconType
  placeholder?:string
  require?:"require"
  invalid?:boolean
  setShowPassword?:Dispatch<SetStateAction<boolean>>
  loading?:boolean
}

interface InputWithAvatorProps {
  profilePicUrl:string
  alt:string
  name:string
  value:string
  changeHandler:(e: React.ChangeEvent<HTMLInputElement>) => void
  type:InputTypes
  label?:string
  placeholder?:string
  require?:"require"
  invalid?:boolean,
}

interface TextAreaProps  {
  name:string
  value:string
  changeHandler :(e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label?:string
  placeholder?:string
  cols?:number,
  rows?:number,
  require?:"require",
}

interface GoogleAutoCompleteProps {
  setAddress:Dispatch<SetStateAction<string>>
  address:string
  Icon?:IconType
  placeholder?:string
}
export const Input:React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  changeHandler,
  Icon,
  placeholder,
  require,
  invalid,
  setShowPassword,
  loading,
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
        className={`${classes.inputContainer} ${invalid && classes.invalid}`}
      >
        {Icon && !loading && (
          <Icon
            style={{ cursor: name === "password" && "pointer" }}
            className={`${classes.icon}`}
            onClick={
              setShowPassword
                ? () => setShowPassword((prev)=>!prev)
                : undefined
            }
          />
        )}
        {Icon && loading && (
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

export const InputWithAvator:React.FC<InputWithAvatorProps> = ({
  profilePicUrl,
  type,
  label,
  placeholder,
  name,
  value,
  changeHandler,
  require,
  invalid,
  alt,
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
        <Avator src={profilePicUrl} alt={alt} size="small" />
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

export const TextArea:React.FC<TextAreaProps> = ({
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
        cols={cols ? cols : 30}
        rows={rows ? rows : 5}
        value={value}
        placeholder={placeholder}
        onChange={changeHandler}
      ></textarea>
    </div>
  );
};

export const GooglePlaceAutoCompelete:React.FC<GoogleAutoCompleteProps> = ({setAddress,address,Icon,placeholder}) => {

  const handleSelect = async (value:string) => {
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
                  placeholder: placeholder,
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
