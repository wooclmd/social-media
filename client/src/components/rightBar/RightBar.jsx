import "./rightBar.scss";

const rightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="suggest">
          <span className="title">Suggestiona For You</span>
          <div className="name">
            <div className="left">
              <img
                src="https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt=""
              />
              <span>Jane Doe</span>
            </div>
            <div className="right">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
          <div className="name">
            <div className="left">
              <img
                src="https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt=""
              />
              <span>Jane Doe</span>
            </div>
            <div className="right">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
        </div>
        <div className="activity">
          <span className="title">Latest Activities</span>
          <div className="name">
            <div className="left">
              <img
                src="https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt=""
              />
              <span className="name">Jane Doe</span>
              <span className="desc">changed their cover picture</span>
            </div>
            <div className="right">
              <span>1 min ago</span>
            </div>
          </div>
        </div>
        <div className="friends">
          <span className="title">Online Friends</span>
          <div className="name">
            <div className="img">
              <div className="circle"></div>
              <img
                src="https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt=""
              />
            </div>
            <span>Jane Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default rightBar;
