import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div>
      <section className="AboutUsSection">
        <h1>ABOUT PICK THE PEN WRITING CONTEST</h1>
        <p>
          The Pick the Pen writing contest is
          <span>
            <Link to="https://www.facebook.com/InkyNovelWritersAcademy">
              INKYNOVEL ACADEMY official writing contest.
            </Link>
          </span>
          We believe and stand for giving writers the recognition and
          appreciation they deserved.
        </p>
        <p>
          The contest started when the academy was founded in 2021 by Damian
          Stanley. And so far, we have kept our promises, integrity and pride.
        </p>
        <p>
          The Pick the Pen contest is a free, fair and transparent writing
          contest, that host writers from across the country and even outside
          the boundaries of Nigeria. We provide writers a platform to share
          their masterpiece, and get recognized for who they are.
        </p>
        <p>
          The contest is open for every writer in these categories; Story,
          Poetry and Essay writing. The contest is usually in 4 stages. After
          every stage, contestants with lower cummulative are evicted, while the
          rest move to the next stage.
        </p>
        <p>
          We make sure to keep the contestants updated with every move, process
          and steps we take through out the contest. This is to ensure that
          there is no cheating, favouritism, bias or lack of transparency.
        </p>
        <p>
          In PTPWC, everybody is equal. It doesn't matter how long you may have
          been writing or contesting. what matters is the task given and every
          other contestants you are competiting against.
        </p>
        <p>
          Here, we do our contest the best way we can, that will benefit
          everyone involved. We promise to explain everything to you and make
          the tasks as clear as possible. However, you should know that we are
          very strict with our rules and regulations. Breaking rules has its
          consequencies.
        </p>
        <p>
          There will be cash prizes and other amazing rewards for the winners
          and runner ups. You also get to sign story contracts with inkypen
          Nigeria
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
