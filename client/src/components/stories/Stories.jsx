import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  //temorary dummy data
  const stories = [
    {
      id: 1,
      name: "Emily Smith",
      img: "https://images.pexels.com/photos/1346382/pexels-photo-1346382.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      name: "Emily Smith",
      img: "https://images.pexels.com/photos/1346382/pexels-photo-1346382.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      name: "Emily Smith",
      img: "https://images.pexels.com/photos/1346382/pexels-photo-1346382.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      name: "Emily Smith",
      img: "https://images.pexels.com/photos/1346382/pexels-photo-1346382.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];
  return (
    <div className="stories">
      <div className="container">
        <div className="story">
          <img src={"/public/uploads/" + currentUser.coverPic} />
          <button>+</button>
          <div className="name">{currentUser.name}</div>
        </div>
        {stories.map((story) => (
          <div className="story" id={story.id}>
            <img src={story.img} />
            <div className="name">{story.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
