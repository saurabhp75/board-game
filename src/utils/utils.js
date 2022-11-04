// Give a random integer between 0 and num, 0 inclusive
const giveRandom = (num) => Math.floor(Math.random(num) * num);

// Return a random board (array with 9 numbers)
const getRandomBoard = () => {
  const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const boardArray = [];

  for (let i = 9; i > 0; --i) {
    const temp = giveRandom(i);
    boardArray.push(numArray[temp]);
    numArray.splice(temp, 1);
  }
  return boardArray;
};

export default getRandomBoard;
