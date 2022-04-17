import { useCallback } from "react";
import classes from "./imageDragDrop.module.css";
import { BsImageFill, BsPlusLg } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const ImageDragDrop = ({ imagePreview, setImagePreview, size }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    },
    [setImagePreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`${
        size === "small" ? classes[`container-small`] : classes[`container`]
      } ${(isDragActive || imagePreview) && classes.highlight}`}
    >
      <input {...getInputProps()} />
      {size === "small" ? (
        <>
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="image preview"
              width={100}
              height={100}
              objectFit="contain"
            />
          ) : (
            <BsPlusLg
              className={
                isDragActive ? classes[`icon-active`] : classes[`icon-small`]
              }
            />
          )}
        </>
      ) : (
        <div className={classes.dropArea}>
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="image preview"
              width={200}
              height={200}
              objectFit="contain"
            />
          ) : isDragActive ? (
            <p className={`${classes.text} ${classes[`text-highlight`]}`}>
              Drop the files here ...
            </p>
          ) : (
            <>
              <BsImageFill className={classes.icon} />
              <p className={classes.text}>
                Drag and drop some files here, <br />
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
