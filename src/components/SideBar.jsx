import logo from "../assets/logo.svg";
import home from "../assets/home-solid.svg";
import team from "../assets/social.svg";
import calender from "../assets/sceduled.svg";
import project from "../assets/starred.svg";
import document from "../assets/draft.svg";
import powerOff from "../assets/power-off-solid.svg";
import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import './SideBar.css'
const Container = styled.div`
  position: fixed;
  left: 0;
  .active {
    border-right: 3px solid var(--white);
  }
`;

const Button = styled.button`
  background: var(--black);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before,
  &::after {
    content: "";
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }
  &::before {
    top: ${(props) => (props.clicked ? "" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props) => (props.clicked ? "" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SlideBarContainer = styled.div`
visibility: ${(props) => (props.clicked ? "visible" : "hidden")};
  background: var(--black);
  width: 3.5rem;
  height: 80vh;
  margin-top: 1rem;
  border-radius: 0 25px 25px 0;
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  position: relative;

`;



const SIDEBAR = styled.ul`
visibility: ${(props) => (props.clicked ? "visible" : "hidden")};

  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--black);
  padding: 1rem 0;

  position: absolute;
  top: 5rem;
  left: 0;
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
`;

const SidebarItem = styled(Link)`
visibility: ${(props) => (props.clicked ? "visible" : "hidden")};

  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;
  padding-left: 1rem;
  display: flex;
  align-items: center;
  &:hover {
    border-right: 3px solid var(--white);
    img {
      filter: invert(100%) sepia(0%) saturate(7479%) hue-rotate(70deg)
        brightness(99%) contrast(107%);
    }
  }
  img {
    width: 1.4rem;
    height: auto;
    filter: invert(75%) sepia(8%) saturate(429%) hue-rotate(162deg)
      brightness(92%) contrast(96%);
  }
`;

const Text = styled.span`
  visibility: ${(props) => (props.clicked ? "visible" : "hidden")};
  opacity: ${(props) => (props.clicked ? "1" : "0")};
  margin-left: ${(props) => (props.clicked ? "2rem" : "0")};
  transition: all .1s ease;
`;




const SideBar = () => {
  const [click, setClick] = useState(false);
  const [clickProfile, setClickProfile] = useState(false);

  return (
    <Container className="sidebar-container">
      <Button clicked={click} onClick={() => setClick(!click)}>
        
      </Button>
     
     
        <SIDEBAR clicked={click}>
          <SidebarItem
            onClick={() => setClick(false)}
            clicked={click}
            activeClassName="active"
            to="/"
          >
            <img src={home} alt="home" />
            <Text clicked={click}>Home</Text>
          </SidebarItem>
          <SidebarItem
            onClick={() => setClick(false)}
            clicked={click}
            activeClassName="active"
            to="/team"
          >
            <img src={team} alt="team" />
            <Text clicked={click}>Team</Text>
          </SidebarItem>
          <SidebarItem
            onClick={() => setClick(false)}
            clicked={click}
            activeClassName="active"
            to="/roadmap"
          >
            <img src={calender} alt="Calender" />
            <Text clicked={click}>Roadmap</Text>
          </SidebarItem>
          <SidebarItem
            onClick={() => setClick(false)}
            clicked={click}
            activeClassName="active"
            to="/whitepaper"
          >
            <img src={document} alt="document" />
            <Text clicked={click}>Mint</Text>
          </SidebarItem>
          <SidebarItem
            onClick={() => setClick(false)}
            clicked={click}
            activeClassName="active"
            to="/projects"
          >
            <img src={project} alt="project" />
            <Text clicked={click}>Showcase</Text>
          </SidebarItem>
        </SIDEBAR>
     
    
    </Container>
  );
};

export default SideBar;
