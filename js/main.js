let dishes = [];
let cardList = document.getElementById('card-list');
let dishArea = document.getElementById('dish-area');

document.getElementById('food-inp').addEventListener('change', (e) => {
    let food = e.target.value;
    getFoods(food);
});

function getFoods(food)  {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
    .then(res => res.json())
    .then(data => {
        dishes = [];
        data.meals.forEach(meal => dishes.push(meal));
        dishArea.innerHTML = '';
        displayDishes();
    })
    .catch(()=>{
        cardList.innerHTML = `<p class="lead text-center">Sorry !!! No recipes found. Try searching for soething else</p>`

    })
}

function displayDishes()  {
    let output = '';
    dishes.forEach(dish => {
        output+=`
            <div class="col-xl-3 col-sm-6 col-lg-4">
                <div class="food-card" style="background: url('${dish.strMealThumb}');">
                    <div class="food-card-details text-white" foodId="${dish.idMeal}">
                        <h1 class="text-center">${dish.strMeal}</h1>
                    </div>
                </div>  
            </div>  
        `
    });
    cardList.classList.remove('d-none');
    cardList.innerHTML = output;
    init();
}

function init() {
    let foodItem = document.querySelectorAll('.food-card-details');
    foodItem.forEach(item => {
        item.addEventListener('click', (e)=> {
            const id = item.getAttribute("foodId");
            displayRecipe(id);
        })
    })    
}

function displayRecipe(id)  {
    cardList.classList.add('d-none');
    const selectedDish = dishes.filter(dish => dish.idMeal == id);
    const dish = selectedDish[0];
    let ingredients = [];
    for(let i=1;i<=20;i++) {
        let ingredientName = `strIngredient${i}`;
        let quantity = `strMeasure${i}`;
        if(dish[ingredientName]) {
            const ingredient = {
                'ingredientname' : dish[ingredientName],
                'quantity' : dish[quantity]
            }
            ingredients.push(ingredient);
        }
    }
    let ingredientOuput = '';
    ingredients.forEach(ingredient => {
        ingredientOuput+=
        `
            <div class="ingredient lead">${ingredient.ingredientname}<span class="amount">${ingredient.quantity}</span> </div>
        `
    })
    
    let output = 
    `
        <div id="recipe-header" style="backGround : url(${dish.strMealThumb})">
        </div>
        <div class="row" id="recipe">
            <h1 class="display-2 text-center col-12 mb-5">${dish.strMeal}</h1>
            <hr class="mb-5">
            <div class="col-lg-4">
                <div class="ingredient-list">
                    ${ingredientOuput}
                </div>
            </div>
            <div class="col-lg-8 px-5">
                <div id="steps">
                    <h1 class="display-4">Instructions</h1>
                    <hr>
                    <p class="lead">${dish.strInstructions}</p>
                    <a href="${dish.strYoutube}" class="btn btn-outline btn-lg btn-outline-danger">Youtube link for the recipe</a>
                </div>
            </div>
        </div>  
    `
    dishArea.innerHTML = output;
}


