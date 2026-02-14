import { useEffect, useMemo, useRef, useState } from "react";
import Aurora from "./Aurora.jsx";
import GlassNav from "./GlassNav.jsx";
import RotatingText from "./rotatingText.jsx";
import Waves from "./waves.jsx";
import BlurText from "./BlurText";
import FlowingMenu from "./FlowingMenu";
import webDevImg from "./assets/webDev.png";
import softwareImg from "./assets/software.png";
import mern from "./assets/mern.png";
import frameworkImg2 from "./assets/Frameworks2.png";
import ProfileCard from "./ProfileCard";
import MagicBento from "./MagicBento";
import GradientText from "./GradientText.jsx";
import ColorBends from "./ColorBends.jsx";
import ChromaGrid from "./ChromaGrid";
import TextType from "./TextType";
import ContactMe from "./ContactMe";
import Iridescence from "./Iridescence";
import TargetCursor from "./TargetCursor";
import myUltronImg from "./assets/myUltron.webp";
import collabUltronImg from "./assets/CollabUltron.webp";
import portfolioImg from "./assets/Portfolio.webp";
import pyMySQLImg from "./assets/PyMySQL.webp";
import cImg from "./assets/C.webp";



const items = [
    {
        image: myUltronImg,
        title: "Hackathon Web Application",
        subtitle: "Typescript, React, Tailwind, Node, PHP, MySQL, PDO, OGL, Vite ",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/futurixUltron9.0"
    },
    {
        image: collabUltronImg,
        title: "Hackathon Web App (collaborated)",
        subtitle: "Next.JS, React, TypeScript, Tailwind, PostCSS, JS, Radix, Vite",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/Sharveswar007/ultron-futurix"
    },
    {
        image: portfolioImg,
        title: "Portfolio Website",
        subtitle: "JSX, CSS, React, WebGL, Vite, JS",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/portfolio_v2"
    },
    {
        image: pyMySQLImg,
        title: "Student DB Manager",
        subtitle: "Python, MySQL",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/funny/blob/main/Python/studDatabase.py"
    },
    {
        image: "https://www.medschoolcoach.com/wp-content/uploads/2023/01/ReflexArcs-Fig2.jpg",
        title: "Reflex Arc Demonstration",
        subtitle: "BioTech",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py"
    },
    {
        image: cImg,
        title: "C/C++ (Learning)",
        subtitle: "Compile-Time programming, structs, classes, Polymorphism/Inheritance, RAII, Algorithms, RegEx ",
        handle: "",
        borderColor: "#3B82F6",
        gradient: "linear-gradient(145deg, #3B82F6, #000)",
        url: "https://devdocs.io/cpp/"
    }
];


const demoItems = [
    { link: "#", text: "Python, C, C++", image: softwareImg },
    { link: "#", text: "HTML5 CSS3 JavaScript", image: webDevImg },
    { link: "#", text: "Mongo, Express, React, Node ", image: mern },
    { link: "#", text: "MATLAB, NumPy, Pandas, Django, Flask", image: frameworkImg2 }
];

function App() {
    const handleAnimationComplete = () => {};

    const projectsBoxRef = useRef(null);
    const [projectsCursorOn, setProjectsCursorOn] = useState(false);
    const [topBlurOn, setTopBlurOn] = useState(false);
    const [bottomBlurOn, setBottomBlurOn] = useState(false);

    const projectsSectionMarginTop = "clamp(4rem, 10vw, 9rem)";
    const edgeBlurHeight = "6rem";
    const edgeBlurAmount = "18px";
    const edgeThreshold = 70;
    const iridescenceColor = useMemo(() => [0.12, 0.05, 0.18], []);

    useEffect(() => {
        const box = projectsBoxRef.current;
        if (!box) return;

        const ensureCursorTargets = () => {
            const cards = box.querySelectorAll(".chroma-card");
            cards.forEach(el => {
                el.classList.add("cursor-target");
            });
        };

        ensureCursorTargets();

        const observer = new MutationObserver(() => ensureCursorTargets());
        observer.observe(box, { childList: true, subtree: true });

        const updateEdgeBlurs = () => {
            const rect = box.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;

            const showTop = rect.top <= edgeThreshold && rect.bottom > edgeThreshold;
            const showBottom = rect.bottom >= vh - edgeThreshold && rect.top < vh - edgeThreshold;

            setTopBlurOn(showTop);
            setBottomBlurOn(showBottom);
        };

        updateEdgeBlurs();
        window.addEventListener("scroll", updateEdgeBlurs, { passive: true });
        window.addEventListener("resize", updateEdgeBlurs);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", updateEdgeBlurs);
            window.removeEventListener("resize", updateEdgeBlurs);
        };
    }, []);

    const edgeBlurBase = {
        position: "absolute",
        left: 0,
        right: 0,
        height: edgeBlurHeight,
        zIndex: 2,
        pointerEvents: "none",
        backdropFilter: `blur(${edgeBlurAmount})`,
        WebkitBackdropFilter: `blur(${edgeBlurAmount})`,
        transition: "opacity 220ms ease-out",
        opacity: 0
    };

    const topBlurStyle = {
        ...edgeBlurBase,
        top: 0,
        opacity: topBlurOn ? 1 : 0,
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))"
    };

    const bottomBlurStyle = {
        ...edgeBlurBase,
        bottom: 0,
        opacity: bottomBlurOn ? 1 : 0,
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
        maskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
    };

    return (
        <main className="page-content">
            <GlassNav />

            <div className="aurora-bleed">
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="hero-center">
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

                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space"></div>

            <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
            >
                Things I dabble in
            </GradientText>

            <div className="colorbends-section">
                <div className="colorbends-box">
                    <div className="colorbends-bg">
                        <ColorBends
                            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                            rotation={0}
                            speed={0.2}
                            scale={1}
                            frequency={1}
                            warpStrength={1}
                            mouseInfluence={1}
                            parallax={0.6}
                            noise={0.08}
                            transparent
                        />
                    </div>

                    <div className="flowing-menu-container">
                        <div className="flowing-menu-frame">
                            <FlowingMenu items={demoItems} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="magic-bento-container">
                <MagicBento />
            </div>

            <div className="projects-section" style={{ marginTop: projectsSectionMarginTop }}>
                <div
                    ref={projectsBoxRef}
                    className={`projects-iridescence-box ${projectsCursorOn ? "cursor-active" : ""}`}
                    onMouseEnter={() => setProjectsCursorOn(true)}
                    onMouseLeave={() => setProjectsCursorOn(false)}
                >
                    <Iridescence
                        className="projects-iridescence-bg"
                        color={iridescenceColor}
                        mouseReact={false}
                        amplitude={0.1}
                        speed={1.0}
                    />

                    <div style={topBlurStyle} />
                    <div style={bottomBlurStyle} />

                    {projectsCursorOn && (
                        <TargetCursor
                            spinDuration={2}
                            hideDefaultCursor={false}
                            parallaxOn={true}
                            targetSelector=".cursor-target"
                        />
                    )}

                    <div
                        className="projects-iridescence-content"
                        style={{
                            position: "relative",
                            zIndex: 3,
                            height: "100%"
                        }}
                    >
                        <div
                            className="texttype-section"
                        >
                            <TextType
                                text={[
                                    "Projects I've worked on",
                                    "Things I've messed around with",
                                    "What I'm currently working on"
                                ]}
                                typingSpeed={75}
                                pauseDuration={1500}
                                showCursor={true}
                                cursorCharacter="|"
                            />
                        </div>
                        <div className="spacebit"></div>

                        <div className="projects-grid-wrap">
                            <ChromaGrid items={items} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="spacemore"></div>

            <div className="contact-me-container">
                <ContactMe />
            </div>
        </main>
    );
}

export default App;
