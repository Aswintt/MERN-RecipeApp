import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";

export const CreateRecipe = () => {
    const userID = useGetUserID();

    const [recipe, setRecipe] = useState({
        name: "",
        ingredients: [],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,
        
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRecipe({...recipe, [name]: value});
    };

    const handleIngredientsChange = (event, idx) => {
        const { value } = event.target;
        const ingredients = recipe.ingredients;
        ingredients[idx] = value;
        // ingredients : ingredients is down single ingredientss
        setRecipe({...recipe, ingredients });
    };

    const addIngredients = () => {
        setRecipe({...recipe, ingredients: [...recipe.ingredients, ""] });
    };
    console.log(recipe);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:3001/recipes", recipe);
            alert("Recipe Created!");
            navigate("/")
        } catch (err) {
            console.error(err);
        }
    };
    return (
    <div className="create-recipe">
        <h2>Create Recipe</h2>
        <form onSubmit={onSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" onChange={handleChange}/>
            
            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" onChange={handleChange}></textarea>

            <label htmlFor="ingredients">Ingredients</label>
            <button onClick={addIngredients} type="button">Add Ingredients</button>
            {recipe.ingredients.map((ingredients, idx) => (
                <input key={idx} type="text" name="ingredients" value={ingredients} onChange={(event) => handleIngredientsChange(event, idx)}/>
            ))}
            <label htmlFor="imageUrl">imageUrl</label>
            <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange}/>

            <label htmlFor="cookingTime">cookingTime</label>
            <input type="number" id="cookingTime" name="cookingTime" onChange={handleChange}/>

            <button type="submit">Create Recipe</button>
        </form>
    </div>
    );
};