import axios, { AxiosResponse } from "axios";

export const uploadPic = async (image:string):Promise<string> => {
  try {
    const form = new FormData();
    form.append("file", image);
    form.append("upload_preset", "social_media");
    form.append("cloud_name", process.env.CLOUDINARY_NAME);
    const res = await axios.post(process.env.CLOUDINARY_URL, form);
    return res.data.url;
  } catch (err) {
    console.log(err);
    return;
  }
};
