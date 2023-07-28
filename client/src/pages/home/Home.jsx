import "./home.scss";
import Stories from "../../components/stories/Stories.jsx";
import Posts from "../../components/posts/Posts.jsx";
import Share from "../../components/share/Share";

const Home = () => {
  return (
    <>
      <Stories />
      <Share />
      <Posts />
    </>
  );
};

export default Home;
