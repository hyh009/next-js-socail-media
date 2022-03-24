import { useCallback } from "react";
import classes from "./imageDragDrop.module.css";
import { BsImageFill, BsPlusLg } from "react-icons/bs";
import { useDropzone } from "react-dropzone";

const ImageDragDrop = (props) => {
  const { imagePreview, setImagePreview } = props;
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`${
        props.size === "small"
          ? classes[`container-small`]
          : classes[`container`]
      } ${(isDragActive || imagePreview) && classes.highlight}`}
    >
      <input {...getInputProps()} />
      {props.size === "small" ? (
        <div className={classes[`dropArea-small`]}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="updated image"
              className={classes.img}
            />
          ) : (
            <BsPlusLg
              className={
                isDragActive ? classes[`icon-active`] : classes[`icon-small`]
              }
            />
          )}
        </div>
      ) : (
        <div className={classes.dropArea}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="updated image"
              className={classes.img}
            />
          ) : isDragActive ? (
            <p className={`${classes.text} ${classes[`text-highlight`]}`}>
              Drop the files here ...
            </p>
          ) : (
            <>
              <BsImageFill className={classes.icon} />
              <p className={classes.text}>
                Drag 'n' drop some files here, <br />
                or click to select files
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDragDrop;
