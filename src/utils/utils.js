// Give a random integer between 0 and num, 0 inclusive
const giveRandom = (num) => Math.floor(Math.random(num) * num);

// Print an array of length 9 into 3x3 matrix
// const printBoard = boardArr => {
//   const chunkSize = 3;
//   for (let i = 0; i < boardArr.length; i += chunkSize) {
//   const chunk = boardArr.slice(i, i + chunkSize);
//   console.log(chunk)
//   }
// }

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
