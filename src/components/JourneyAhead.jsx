import React, { useEffect } from "react";
import "../assets/JourneyAhead.css";
import "aos/dist/aos.css";
import AOS from "aos";

const JourneyAhead = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: true,
      offset: 100,
    });

    // Refresh AOS on window resize
    window.addEventListener("load", AOS.refresh);
    return () => {
      window.removeEventListener("load", AOS.refresh);
    };
  }, []);

  return (
    <div className="journey-ahead-container">
      {/* Main Title */}
      <div
        className="main-title-section"
        data-aos="fade-up"
        data-aos-delay="0"
      >
        <h1 className="main-title">THE JOURNEY AHEAD</h1>
        <div className="title-line"></div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Column - Text Content */}
        <div className="text-content">
          <p className="lead-paragraph" data-aos="fade-up" data-aos-delay="0">
            As the Space Launch System lifts off from a launchpad at Cape
            Canaveral in Florida later this month, the behemoth rocket,
            propelled by five-segment boosters and four RS-25 engines, will
            usher in a new era of space exploration, one that takes us back into
            the heavens and knocks on our next-door cosmic neighbour.
          </p>

          <p data-aos="fade-up" data-aos-delay="200">
            The maiden mission set to be launched on August 29 will be a test
            drive, an uncrewed launch, with the Orion spacecraft on top. The
            primary goal of the mission, as per the US space agency Nasa, is to
            assure a safe crew module entry, descent, splashdown, and recovery.
            Once these are done successfully, it will set the stage for
            astronauts to jump on board and travel to the Moon.
          </p>

          <p data-aos="fade-up" data-aos-delay="200">
            The August 29 launch of Artemis-I will commence a 42-day-long
            journey that will take the Orion spacecraft far beyond the Moon and
            return it safely to Earth.
          </p>
        </div>

        {/* Right Column - Image Grid */}
        <div className="image-grid" data-aos="fade-left" data-aos-delay="0">
          <div className="image-row">
            <div
              className="image-card floating-image-1"
              data-aos="zoom-in"
              data-aos-delay="0"
            >
              <div className="image-placeholder ">
                <img
                  width="100%"
                  height="100%"
                  src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/51954891833_e2fdf7a30a_k.jpg"
                  alt="Launchpad with Rocket"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            <div
              className="image-card floating-image-2"
              data-aos="zoom-in"
              data-aos-delay="0"
            >
              <div className="image-placeholder">
                <img
                  width="100%"
                  height="100%"
                  src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/artemis_block1_crew_oceanview_launch.jpg"
                  alt="Artemis Launch"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          <div className="image-row">
            <div
              className="image-card floating-image-3"
              data-aos="zoom-in"
              data-aos-delay="0"
            >
              <div className="image-placeholder">
                <img
                  width="100%"
                  height="100%"
                  src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/52200283798_d6ea9d7db6_k.jpg"
                  alt="Spacecraft"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div
        className="divider-line"
        data-aos="fade-up"
        data-aos-delay="0"
      ></div>

      {/* Moments After Launch Section */}
      <div className="moments-section" data-aos="fade-up" data-aos-delay="800">
        <div className="moments-header">
          <h2 className="moments-title">MOMENTS AFTER LAUNCH</h2>
          <div className="moments-title-line"></div>
        </div>

        <div className="moments-content">
          <div className="moments-text">
            <p data-aos="fade-up" data-aos-delay="0">
              With the four RS-25 engines powering the SLS, the rocket will
              experience maximum atmospheric pressure (Max Q) within{" "}
              <span className="highlight">90 seconds</span> after launch. Two
              minutes into the flight, the solid rocket boosters will jettison
              after completely exhausting their fuel, pushing the core stage
              forward.
            </p>

            <p data-aos="fade-up" data-aos-delay="0">
              Eight minutes after leaving the ground, the core stage will shut
              down with the service module panels, and the launch abort system
              separating forever.{" "}
              <span className="highlight">No more turning back now.</span>
            </p>

            <p data-aos="fade-up" data-aos-delay="0">
              As the core stage shuts down, it will separate from the spacecraft
              leaving the Orion attached to the Interim Cryogenic Propulsion
              Stage (ICPS) that will propel it toward the Moon.
            </p>

            <p className="serious-text">This is where it gets serious.</p>
          </div>

          <div className="image-grid" data-aos="fade-left" data-aos-delay="0">
            <div className="image-row">
              <div
                className="image-card floating-image-1"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder ">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/artemis_i_3_28_22.jpg"
                    alt="Launchpad with Rocket"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div
                className="image-card floating-image-2"
                data-aos="zoom-in"
                data-aos-delay="0"
                style={{ opacity: 0 }}
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/in-space.jpg"
                    alt="Artemis Launch"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div
                className="image-card floating-image-3"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/in-space.jpg"
                    alt="Artemis Launch"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="divider-line"
          data-aos="fade-up"
          data-aos-delay="0"
        ></div>

        <div
          className="main-title-section"
          data-aos="fade-up"
          data-aos-delay="0"
        >
          <h1 className="main-title">LUNAR JOYRIDE AND RETURN HOME</h1>
          <div className="title-line"></div>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Column - Text Content */}
          <div className="text-content">
            <p
              className="lead-paragraph"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              Orion has been programmed to fly about 97 kilometres above the
              surface of the Moon. But that's not it.
            </p>

            <p data-aos="fade-up" data-aos-delay="0">
              Nasa will use the Moon's gravitational force to propel Orion into
              a distant retrograde orbit pushing it over 60,000 kilometers
              beyond the Moon. This is part of a demonstration to see whether
              the spacecraft can someday journey towards Mars.
            </p>

            <p data-aos="fade-up" data-aos-delay="0">
              Once Orion achieves its goals, the spacecraft will use the Moon
              for another assist and harness its gravity to accelerate back
              toward Earth. Orion will enter Earth's atmosphere at a staggering
              speed of 40,000 kilometers per hour and will have to be slowed
              down as it sustains the fiery wrath of the atmosphere boiling up
              to a temperature of 2,800 degrees Celsius.
            </p>
            <p data-aos="fade-up" data-aos-delay="0">
              Once it safely passes through the atmosphere, two drogue
              parachutes will be deployed at an altitude of 25,000 feet, and
              within a minute slow it down to about 160 kilometers per hour.
              Three pilot chutes will follow, which will further reduce the
              speed to 32 kilometers per hour as the capsule splashes into the
              sea off the coast of San Diego.
            </p>
          </div>

          {/* Right Column - Image Grid */}
          <div className="image-grid" data-aos="fade-left" data-aos-delay="0">
            <div className="image-row">
              <div
                className="image-card floating-image-1"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder ">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/ksc_20181101_ph_awg01_0057_large.jpg"
                    alt="Launchpad with Rocket"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div
                className="image-card floating-image-2"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/landing-(1).jpg"
                    alt="Artemis Launch"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            <div className="image-row">
              <div
                className="image-card floating-image-3"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/manikin_image.jpg"
                    alt="Spacecraft"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="divider-line"
          data-aos="fade-up"
          data-aos-delay="0"
        ></div>

        <div
          className="main-title-section"
          data-aos="fade-up"
          data-aos-delay="0"
        >
          <h1 className="main-title">WHY IS THIS MISSION SO IMPORTANT?</h1>
          <div className="title-line"></div>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Column - Text Content */}
          <div className="text-content">
            <p data-aos="fade-up" data-aos-delay="0">
              The Artemis-I mission is the culmination of over five decades of
              planning, budgetary approvals, scientific ingenuity, and
              technological advancement, ever since the Apollo missions came to
              a halt.
            </p>

            <p data-aos="fade-up" data-aos-delay="0">
              When Neil Armstrong landed on the Moon in 1969, it seemed as
              though the United States could soon go far beyond. After that
              historic first landing, Nasa went ahead with seven more human
              missions to the Moon.
            </p>
            <p data-aos="fade-up" data-aos-delay="0">
              The space agency had plans to launch three more Apollo missions:
              18, 19, and 20. The hardware was ready, astronauts were trained
              and systems were optimised. But what followed was a 50-year-long
              lull.
            </p>
            <p data-aos="fade-up" data-aos-delay="0">
              What happened? Well, we don't know for sure.
            </p>
          </div>

          {/* Right Column - Image Grid */}
          <div className="image-grid" data-aos="fade-left" data-aos-delay="300">
            <div className="image-row">
              <div
                className="image-card floating-image-1"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder ">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/337294main_pg62_as11-40-5903_full.jpg"
                    alt="Launchpad with Rocket"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div
                className="image-card floating-image-2"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/as11-40-5944.jpg"
                    alt="Artemis Launch"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            <div className="image-row">
              <div
                className="image-card floating-image-3"
                data-aos="zoom-in"
                data-aos-delay="0"
              >
                <div className="image-placeholder">
                  <img
                    width="100%"
                    height="100%"
                    src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/as16-113-18339.jpg"
                    alt="Spacecraft"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="divider-line"
          data-aos="fade-up"
          data-aos-delay="0"
        ></div>

        <div>
          <div className="muchAwaited">MUCH AWAITED RETURN</div>

          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            With Artemis, the US aims to re-establish its dominance around lunar
            exploration. But this time it will be more difficult as Russia,
            China, and to some extent, India mounts a challenge. While Artemis-I
            will cater to scientific research from 20 countries in lunar orbit
            and surface, China is fast pushing its lunar program with its fourth
            phase now in operation.
          </p>

          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            While Artemis-1 will cater to scientific research from 20 countries
            in lunar orbit and surface, China is fast pushing its lunar
            programme with its fourth phase now in operation.
          </p>

          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            Meanwhile, India will launch its Chandrayana-3 mission by next year
            to explore the Moon with its legacy spacecraft that first detected
            water on the surface. Russia has plans to build a research base.
          </p>

          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            Artemis-1 will, however, remain the most ambitious exploration
            mounted by humanity. The programme aims not just to land humans on
            Moon but also build bases and research stations on the lunar
            surface. The hope is that the Moon could one day be used as a pit
            stop for even more ambitious space journeys, such as to Mars.
          </p>
          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            “Nasa plans to launch the crewed Artemis-II mission no earlier than
            May 2024. We will name a crew for the Artemis II after Artemis-I has
            returned,” Rachel told indiatoday.in in an email interaction.
          </p>
          <p data-aos="fade-up" data-aos-delay="0" className="awaitedPara">
            As this new age of space exploration begins, new science is on the
            corner and so is the Moon, which has been quietly awaiting our
            return.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="0" >
            <img src="https://akm-img-a-in.tosshub.com/sites/interactive/immersive/ride-on-the-moon/assest/img/seprate/as16-113-18339.jpg"/>
        </div>

        {/* Credits Section */}
        
      </div>
    </div>
  );
};

export default JourneyAhead;
