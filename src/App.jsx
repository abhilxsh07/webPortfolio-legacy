import Aurora from "./Aurora.jsx";
import GlassNav from "./GlassNav.jsx";
import RotatingText from "./rotatingText.jsx";
import Waves from "./waves.jsx";
import BlurText from "./BlurText";
import GradientText from "./GradientText";
import FlowingMenu from "./FlowingMenu";
import webDevImg from "./assets/webDev.png";
import softwareImg from "./assets/software.png";
import frameworkImg from "./assets/Frameworks.png";
import frameworkImg2 from "./assets/Frameworks2.png";
import ProfileCard from "./ProfileCard";
import MagicBento from "./MagicBento";
import ScrambledText from "./ScrambledText";

// demo items for FlowingMenu
const demoItems = [
    { link: "#", text: "Python, C, C++", image: softwareImg },
    { link: "#", text: "HTML5 CSS3 JavaScript", image: webDevImg },
    { link: "#", text: "Mongo, Express, React, Node ", image: frameworkImg },
    { link: "#", text: "MATLAB, NumPy, Pandas, Django, Flask", image: frameworkImg2 }
];

function App() {
    const handleAnimationComplete = () => {
        // optional: do something when the BlurText animation finishes
        // console.log("BlurText animation complete");
    };

    return (
        <main className="page-content">
            <GlassNav />

            <div>
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            {/* Centered hero block */}
            <div className="hero-center">
                {/* Inner wrapper so BlurText and hero card share the same left edge */}
                <div className="hero-inner">
                    <BlurText
                        text="Hello. I'm Abhilash Kar."
                        delay={750}
                        animateBy="words"
                        direction="top"
                        onAnimationComplete={handleAnimationComplete}
                        className="text-2xl mb-8"
                    />

                    <div className="hero-card">
                        {/* Waves background filling the card */}
                        <div className="hero-waves-bg">
                            <Waves
                                lineColor="#2e8b57"
                                backgroundColor="rgba(255, 255, 255, 0.2)"
                                waveSpeedX={0.02}
                                waveSpeedY={0.01}
                                waveAmpX={40}
                                waveAmpY={20}
                                friction={0.9}
                                tension={0.01}
                                maxCursorMove={120}
                                xGap={12}
                                yGap={36}
                            />
                        </div>

                        {/* Foreground content: left = hero-role, right = profile card */}
                        <div className="hero-content">
                            <div className="hero-role">
                                <span className="hero-prefix">I am a</span>

                                <button type="button" className="btn btn-primary rotating-btn">
                                    <span className="rotating-text-wrapper">
                                        <RotatingText
                                            texts={[
                                                "Full Stack Developer",
                                                "Software Developer",
                                                "API Engineer",
                                                "MERN Stack Developer",
                                                "Tech Enthusiast"
                                            ]}
                                            mainClassName="rotating-text-inner"
                                            staggerFrom={"last"}
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "-120%" }}
                                            staggerDuration={0.025}
                                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                            rotationInterval={2000}
                                        />
                                    </span>
                                </button>
                            </div>

                            {/* Right side profile card */}
                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrambled text between hero and flowing menu */}
            <div className="scrambled-text-wrapper">
                <ScrambledText
                    className="scrambled-text-demo"
                    radius={10}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars="?/!@#$%"
                >
                    Skills-
                </ScrambledText>
            </div>

            {/* Flowing menu below the hero-inner */}
            <div className="flowing-menu-container">
                <div style={{ height: "600px", position: "relative", width: "80%" }}>
                    <FlowingMenu items={demoItems} />
                </div>
            </div>

            {/* MagicBento below the flowing menu */}
            <div className="magic-bento-container">
                <MagicBento />
            </div>
        </main>
    );
}

export default App;
