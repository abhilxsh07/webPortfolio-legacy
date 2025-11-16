import DecryptedText from "./DecryptText.jsx";
import Aurora from "./Aurora.jsx";
import GlassNav from "./GlassNav.jsx";

function App() {
    return (
        <main className="page-content">
            <GlassNav />

            {/*    <div>*/}

            {/*    <DecryptedText*/}
            {/*        text="Customize me"*/}
            {/*        speed={10}*/}
            {/*        maxIterations={20}*/}
            {/*        characters="ABCD1234!?"*/}
            {/*        className="introLine"*/}
            {/*        parentClassName="all-letters"*/}
            {/*        encryptedClassName="encrypted"*/}
            {/*    />*/}
            {/*</div>*/}

            <div>
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>
        </main>
    );
}

export default App;
