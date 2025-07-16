// src/utlis/index.js
export const getRandomBG = () => {
    const colors = [
        "#FF0000", "#00FF00", "#0000FF",  "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB", "#808080",
    ];

      return colors[Math.floor(Math.random() * colors.length)];

}