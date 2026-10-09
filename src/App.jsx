import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import RecipeDiscoveryApp from "./components/recipeDiscoveryApp";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={styles["app-shell"]} id="top">
            <SiteHeader
                title="Supper Club"
                mark="S"
                navItems={[["Recipes", "#workspace"], ["Saved", "#saved"]]}
                repoUrl="https://github.com/a2rp/recipe-discovery-app"
            />
            <main className={styles.pageContent}>
                <RecipeDiscoveryApp />
            </main>
            <SiteFooter repoUrl="https://github.com/a2rp/recipe-discovery-app" />
            <BackToTop visible={showBackToTop} />
        </div>
    );
};

export default App;