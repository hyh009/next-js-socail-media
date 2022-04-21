import React,{ useState, useEffect, useRef, Dispatch,SetStateAction } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import { Button } from "../../Common";
import { BiCrop, BiReset } from "react-icons/bi";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { RiDragMove2Fill } from "react-icons/ri";
import { FcPicture } from "react-icons/fc";
import classes from "./cropImageModal.module.css";
interface Props {
  imagePreview:string
  setImagePreview:Dispatch<SetStateAction<string>>
  setShowModal:Dispatch<SetStateAction<boolean>>
}


const CropImageModal:React.FC<Props> = ({ imagePreview, setImagePreview, setShowModal }) => {
  const [domReady, setDomReady] = useState<boolean>(false);
  const [cropper, setCropper] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cropperRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setDomReady(true);
  }, []);

  useEffect(() => {
    const shortcut = ({ key }):void => {
      if (cropper) {
        if (key === "m") cropper.setDragMode("move");
        if (key === "c") cropper.setDragMode("crop");
        if (key === "r") cropper.reset();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [cropper]);

  const onCrop = ()=>{
    if(cropperRef.current){
      const imageElement: any = cropperRef.current;
      setCropper(imageElement?.cropper)
    }
  }

  const getCropData = () => {
    if (cropper) {
      setLoading(true);
      setImagePreview(cropper.getCroppedCanvas().toDataURL());
      cropper.destroy();
      setShowModal(false);
    }
  };

  return (
    domReady &&
    ReactDOM.createPortal(
      <div className={classes.background}>
        <div className={classes.container}>
          <h3 className={classes.title}>
            <FcPicture />
            Crop image before update
          </h3>
          <div className={classes.wrapper}>
            <div className={classes[`cropper-container`]}>
              <Cropper
                style={{ width: "100%", height: 400, aspectRatio: "1/1" }}
                zoomable
                cropBoxResizable
                responsive
                guides
                center
                initialAspectRatio={1}
                preview=".img-preview"
                src={imagePreview}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                autoCropArea={1}
                crop={onCrop}
                ref={cropperRef}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />
            </div>
            <div className={classes[`preview-container`]}>
              <div
                className="img-preview"
                style={{ width: "100%", height: "250px", overflow: "hidden" }}
              />
            </div>
          </div>
          <div className={classes.bottom}>
            <BiReset
              className={classes.icon}
              title="reset (R)"
              onClick={() => cropper && cropper.reset()}
            />
            <RiDragMove2Fill
              className={classes.icon}
              title="move canvas (M)"
              onClick={() => cropper && cropper.setDragMode("move")}
            />
            <BiCrop
              className={classes.icon}
              title="New cropbox (C)"
              onClick={() => cropper && cropper.setDragMode("crop")}
            />
            <Button
              content="Cancel"
              type="button"
              look="cancel-button"
              icon={AiOutlineClose}
              clickHandler={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}
            />
            <Button
              content="Crop image"
              type="button"
              icon={AiOutlineCheck}
              look="confirm-button"
              clickHandler={getCropData}
              loading={loading}
            />
          </div>
        </div>
      </div>,
      document.getElementById("backdrop-root")
    )
  );
};

export default CropImageModal;
