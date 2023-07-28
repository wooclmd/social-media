import { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [coverFile, setCoverFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [inputs, setInputs] = useState({
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updatedInfo) => {
      return makeRequest.put("/users", updatedInfo);
    },
    {
      onSuccess: () => {
        //invalidate and refetch user profile
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = coverFile ? await upload(coverFile) : user.coverPic;
    profileUrl = profileFile ? await upload(profileFile) : user.profilePic;

    mutation.mutate({ ...inputs, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <button onClick={() => setOpenUpdate(false)}>X</button>
      <form>
        <div className="uploads">
          <div className="upload">
            <label htmlFor="coverPic">Cover photo</label>
            <input
              type="file"
              name="coverPic"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </div>
          <div className="upload">
            <label htmlFor="profilePic">Profile photo</label>
            <input
              type="file"
              name="profilePic"
              onChange={(e) => setProfileFile(e.target.files[0])}
            />
          </div>
        </div>

        <div className="inputs">
          <div className="input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={inputs.name}
            />
          </div>
          <div className="input">
            <label>City</label>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              value={inputs.city}
            />
          </div>
          <div className="input">
            <label>Website</label>
            <input
              type="text"
              name="website"
              onChange={handleChange}
              value={inputs.website}
            />
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default Update;
