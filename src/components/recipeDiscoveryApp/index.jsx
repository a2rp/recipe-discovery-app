import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiClock, FiHeart, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const savedKey = "supper-club-saved-recipes";
const shoppingKey = "market-day-list";
const recipes = [
    { id: 1, name: "Lemony chickpea bowls", category: "Vegetarian", time: 25, servings: 2, difficulty: "Easy", art: "bowl", icon: "🥗", ingredients: ["1 can chickpeas", "1 lemon", "2 cups greens", "1 cup cooked couscous"], steps: ["Warm the chickpeas with olive oil, cumin, salt, and pepper.", "Whisk lemon juice with olive oil and a little honey.", "Serve over couscous with greens and lemon dressing."] },
    { id: 2, name: "Tomato butter beans", category: "One pot", time: 30, servings: 3, difficulty: "Easy", art: "tomato", icon: "🍅", ingredients: ["2 cans butter beans", "1 cup cherry tomatoes", "2 cloves garlic", "A handful of basil"], steps: ["Soften sliced garlic in olive oil in a deep pan.", "Add tomatoes and cook until their skins begin to split.", "Stir in drained beans and simmer for ten minutes. Finish with basil."] },
    { id: 3, name: "Ginger sesame noodles", category: "Quick", time: 18, servings: 2, difficulty: "Easy", art: "noodle", icon: "🍜", ingredients: ["200 g noodles", "1 tbsp fresh ginger", "2 tbsp soy sauce", "1 tsp sesame oil"], steps: ["Cook noodles following the packet directions.", "Mix ginger, soy sauce, sesame oil, and a splash of noodle water.", "Toss the noodles through the sauce and finish with sesame seeds."] },
    { id: 4, name: "Mushroom toast with thyme", category: "Vegetarian", time: 22, servings: 2, difficulty: "Easy", art: "toast", icon: "🍄", ingredients: ["250 g mushrooms", "2 thick slices sourdough", "1 tbsp butter", "A few thyme sprigs"], steps: ["Toast the sourdough until crisp at the edges.", "Brown the mushrooms in butter, then add thyme and black pepper.", "Spoon the mushrooms over toast and serve warm."] },
    { id: 5, name: "Crispy potato tacos", category: "Family", time: 35, servings: 4, difficulty: "Steady", art: "taco", icon: "🌮", ingredients: ["500 g small potatoes", "8 corn tortillas", "1 avocado", "1 lime"], steps: ["Roast the potatoes with oil and smoked paprika until crisp.", "Mash avocado with lime and a pinch of salt.", "Fill warm tortillas with potatoes and avocado."] },
    { id: 6, name: "Coconut lentil soup", category: "One pot", time: 40, servings: 4, difficulty: "Easy", art: "soup", icon: "🍲", ingredients: ["1 cup red lentils", "1 can coconut milk", "3 cups vegetable stock", "1 tsp curry powder"], steps: ["Rinse the lentils and add them to a pot with stock and curry powder.", "Simmer until the lentils are tender, about twenty minutes.", "Stir in coconut milk and warm through."] },
];
const readSaved = () => {
    try {
        const value = localStorage.getItem(savedKey);
        return value ? JSON.parse(value) : [2, 5];
    } catch {
        return [2, 5];
    }
};
const readShoppingList = () => {
    try {
        const value = localStorage.getItem(shoppingKey);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
};

const RecipeDiscoveryApp = () => {
    const [saved, setSaved] = useState(readSaved);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All recipes");
    const [savedOnly, setSavedOnly] = useState(false);
    const [selected, setSelected] = useState(null);
    const [notice, setNotice] = useState("");
    useEffect(() => localStorage.setItem(savedKey, JSON.stringify(saved)), [saved]);

    const categories = ["All recipes", ...new Set(recipes.map((recipe) => recipe.category))];
    const visibleRecipes = useMemo(() => recipes.filter((recipe) => {
        const text = (recipe.name + " " + recipe.category + " " + recipe.ingredients.join(" ")).toLowerCase();
        return text.includes(query.toLowerCase()) && (category === "All recipes" || recipe.category === category) && (!savedOnly || saved.includes(recipe.id));
    }), [query, category, savedOnly, saved]);
    const toggleSaved = (id) => setSaved((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    const addToShoppingList = () => {
        if (!selected) return;
        const current = readShoppingList();
        const additions = selected.ingredients.map((ingredient, index) => ({ id: Date.now() + index, name: ingredient, amount: "1", aisle: "Pantry", price: 0, checked: false }));
        localStorage.setItem(shoppingKey, JSON.stringify([...current, ...additions]));
        setNotice(selected.ingredients.length + " ingredients added to Market Day.");
    };

    return (
        <section className={styles.recipeDiscoveryApp} id="workspace">
            <div className={styles.recipeHero}>
                <div><p className={styles.label}>WHAT SOUNDS GOOD?</p><h1>Find your next<br /><span>favorite supper.</span></h1><p className={styles.description}>A small collection of doable meals, sorted by the way you cook.</p></div>
                <div className={styles.openBook}><FiBookOpen aria-hidden="true" /><strong>6</strong><span>kitchen-tested ideas</span></div>
            </div>
            <div className={styles.discoveryTools}>
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a dish or ingredient" aria-label="Search recipes" /></label>
                <label className={styles.categorySelect}><span>Cook by</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
                <button type="button" className={savedOnly ? styles.savedButtonActive : styles.savedButton} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><FiHeart aria-hidden="true" /> Saved recipes <span>{saved.length}</span></button>
            </div>
            <div className={styles.contentLayout}>
                <section className={styles.recipeResults} aria-label="Recipes">
                    <div className={styles.resultsHeading}><div><h2>{savedOnly ? "Your saved recipes" : "Good things to make"}</h2><p>{visibleRecipes.length} recipes to explore</p></div><span>All times are hands-on estimates</span></div>
                    <div className={styles.recipeGrid}>
                        {visibleRecipes.map((recipe) => <article className={styles.recipeCard} key={recipe.id}>
                            <div className={styles.recipeArt + " " + styles[recipe.art]}><span>{recipe.icon}</span><small>{recipe.category}</small><button type="button" className={saved.includes(recipe.id) ? styles.favoriteActive : styles.favorite} aria-label={(saved.includes(recipe.id) ? "Remove from" : "Save to") + " favorites: " + recipe.name} aria-pressed={saved.includes(recipe.id)} onClick={() => toggleSaved(recipe.id)}><FiHeart aria-hidden="true" /></button></div>
                            <div className={styles.recipeInfo}><div className={styles.meta}><span><FiClock aria-hidden="true" /> {recipe.time} min</span><span>{recipe.difficulty}</span></div><h3>{recipe.name}</h3><p>{recipe.servings} servings · {recipe.ingredients.length} ingredients</p><button type="button" className={styles.openRecipe} onClick={() => { setSelected(recipe); setNotice(""); }}>See recipe <FiBookOpen aria-hidden="true" /></button></div>
                        </article>)}
                        {visibleRecipes.length === 0 && <p className={styles.emptyState}>No recipes match. Try another ingredient or category.</p>}
                    </div>
                </section>
                {selected ? <aside className={styles.detailPanel} aria-label={selected.name + " recipe"}>
                    <div className={styles.detailHead}><div><span>RECIPE CARD</span><h2>{selected.name}</h2></div><button type="button" className={styles.closeButton} aria-label="Close recipe details" onClick={() => setSelected(null)}><FiX aria-hidden="true" /></button></div>
                    <div className={styles.detailMeta}><span><FiClock aria-hidden="true" /> {selected.time} minutes</span><span>{selected.servings} servings</span></div>
                    <h3>What you need</h3><ul>{selected.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
                    <h3>Make it</h3><ol>{selected.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
                    <button type="button" className={styles.shoppingButton} onClick={addToShoppingList}><FiShoppingBag aria-hidden="true" /> Add ingredients to grocery list</button>
                    {notice && <p className={styles.notice}>{notice}</p>}
                </aside> : <aside className={styles.cookingNote}><div className={styles.noteIcon}>✳</div><p className={styles.label}>A GOOD PLACE TO START</p><h2>Pick a recipe<br />that fits tonight.</h2><p>Choose any card to see ingredients and step-by-step instructions. Save recipes to make them easy to find again.</p><button type="button" onClick={() => setCategory("Quick")}>Show quick meals <FiClock aria-hidden="true" /></button></aside>}
            </div>
            <section className={styles.savedStrip} id="saved"><FiHeart aria-hidden="true" /><span>{saved.length} recipes saved for another day</span><button type="button" onClick={() => { setCategory("All recipes"); setSavedOnly(true); }}>See saved</button></section>
        </section>
    );
};

export default RecipeDiscoveryApp;
