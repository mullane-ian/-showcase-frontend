import MotionHoc from "./MotionHoc";
import './team.css'
const TeamComponent = () => {
  return (
    <div className="team-main-container">
    <h1 className="team-title">Meet The Dilds</h1>
      <div className="team-container">

        <img className="team-img" src="./team.jpg" />
        <p className="team-desc">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio, unde. Odit voluptatum doloribus atque similique libero harum corrupti corporis? Obcaecati?

        </p>
        <p className="team-desc">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio, unde. Odit voluptatum doloribus atque similique libero harum corrupti corporis? Obcaecati?

        </p>

      </div>

    </div>

  )
};

const Team = MotionHoc(TeamComponent);
export default Team;
