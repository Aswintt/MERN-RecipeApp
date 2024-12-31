import { useEffect, useState, useRef } from "react";
import axios from "axios";

export const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const hasFetched = useRef(false); // Ref to track fetch status -smr

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get("http://localhost:3001/recipes");
                setRecipes(response.data);
                console.log(response.data);                
            } catch (err) {
                console.error(err);
            }
        };

        //smr start this is to avoid strict mode for this page and the twice api call prblm
        if (!hasFetched.current) {
            hasFetched.current = true; // Mark as fetched
            fetchRecipe();
        }
        // smr end
    }, []);
    return (
        <div>
            <h1>Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div>
                            <h2>{recipe.name}</h2>
                        </div>
                        <div className="instructions">
                            <p> {recipe.instructions}</p>
                        </div>
                        <img src={recipe.imageUrl} alt={recipe.name} />
                        <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
                    </li>
                ))}
            </ul>
        </div>

    );
};