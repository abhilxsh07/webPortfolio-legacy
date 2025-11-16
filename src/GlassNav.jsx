import "./GlassNav.css";

const GlassNav = () => {
    const items = ["Projects", "About", "Blog", "Contact"];

    return (
        <div className="glass-nav-wrapper">
            <nav className="glass-nav">
                <ul className="glass-nav-list">
                    {items.map(label => (
                        <li key={label} className="glass-nav-item">
                            <a href="#" className="glass-nav-link">
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>

            </nav>
        </div>
    );
};

export default GlassNav;
