import "./profile.scss";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [openUpdate, setOpenUpdate] = useState(false);

  //get user
  const { isLoading, error, data } = useQuery(["user"], async () => {
    try {
      const res = await makeRequest.get(`/users/find/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  //get relationships
  const { isLoading: rIsLoading, data: rData } = useQuery(
    ["relationships"],
    async () => {
      try {
        const res = await makeRequest.get(`/follow?followUser_id=${id}`);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    }
  );

  //add/delete relationship
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (followed) => {
      if (followed) {
        return makeRequest.delete(`/follow?followUser_id=${id}`);
      }
      return makeRequest.post(`/follow`, { followUser_id: id });
    },
    {
      onSuccess: () => {
        //invalidate and refetch relationships
        queryClient.invalidateQueries(["relationships"]);
      },
    }
  );

  if (error) return <div>{error}</div>;

  const handleFollow = (e) => {
    e.preventDefault();
    mutation.mutate(rData?.includes(currentUser.id));
  };

  return (
    <div className="profile">
      <div className="container">
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            <img
              className="bgImage"
              src={"/public/uploads/" + data?.coverPic}
              alt=""
            />
            <div className="info">
              <div className="user">
                <img src={"/public/uploads/" + data?.profilePic} alt="" />
                <span>{data?.name}</span>
              </div>

              <div className="contact">
                <div className="icons">
                  <i class="fa-brands fa-facebook"></i>
                  <i class="fa-brands fa-twitter"></i>
                  <i class="fa-brands fa-instagram"></i>
                  <i class="fa-brands fa-linkedin"></i>
                  <i class="fa-brands fa-pinterest"></i>
                </div>
                <div className="location">
                  <div className="left">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{data?.city}</span>
                  </div>
                  {data?.website && (
                    <div className="right">
                      <i class="fa-solid fa-globe"></i>
                      <span>{data.website}</span>
                    </div>
                  )}
                </div>
                <div className="email">
                  <i class="fa-solid fa-envelope"></i>
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </div>
              {currentUser.id === data.id ? (
                <button onClick={() => setOpenUpdate(true)}>Update</button>
              ) : (
                <button onClick={handleFollow}>
                  {rIsLoading
                    ? "Loading..."
                    : rData?.includes(currentUser.id)
                    ? "Following"
                    : "Follow"}
                </button>
              )}
              {openUpdate && (
                <Update setOpenUpdate={setOpenUpdate} user={data} />
              )}
            </div>
          </>
        )}
      </div>
      <Posts id={id} />
    </div>
  );
};

export default Profile;
