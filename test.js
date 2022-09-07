const arr = [1, 2, 3];
console.log(arr);

const addElementToArry = (arr, el) => {
  return [...arr, el];
};

console.log(addElementToArry(arr, 4));
console.log(arr);
