"use strict";
const bureauRefInput = document.getElementById("inputValues");
const productivityOutputValue = document.getElementById("productivityOutput");
let tBodyElement = document.querySelector("tbody2");

button2.addEventListener("click", (e) => {
  let aht;
  e.preventDefault();
  const radioInput = document.getElementsByName("aht");
  for (let i = 0; i < radioInput.length; i++) {
    if (radioInput[i].checked) {
      aht = Number(radioInput[i].value);
    }
  }
  const noOfResources = Number(document.getElementById("userCountInput").value);
  const inputValue = bureauRefInput.value.split("\n");
  const umrAndDupicate = getBureauRefRepetetion(inputValue);
  console.log(umrAndDupicate.length);
  umrAndDupicate.sort((a, b) => {
    return b.duplicateEntries - a.duplicateEntries;
  });
  console.log(umrAndDupicate[0]["duplicateEntries"]);
  for (let i = 0; i < umrAndDupicate.length; i++) {
    // the logic to push data into the table
    tBodyElement.innerHTML += `
      <tr>
       <td>${umrAndDupicate[i]["Data"]}</td>
        <td>${umrAndDupicate[i]["duplicateEntries"]}</td>
     </tr>
    `;
  }

  console.log(`no of Users = ${noOfResources}`);
  console.log(`AHT = ${aht}`);
  console.log(`Count of Unique Bureau Ref = ${umrAndDupicate.length}`);
  const minutesAvailable = 480 * noOfResources;
  const timeRequired = umrAndDupicate.length * aht;
  const Productivity = (timeRequired / minutesAvailable) * 100;
  productivityOutputValue.innerHTML = `${Productivity}%`;
});

function getBureauRefRepetetion(input) {
  let dataAndCount = [];
  input.forEach((umr) => {
    dataAndCount[umr] = dataAndCount[umr] ? dataAndCount[umr] + 1 : 1;
  });
  let countObjectArray = [];
  Object.entries(dataAndCount).forEach((item) => {
    let countObject = { Data: item[0], duplicateEntries: item[1] };
    countObjectArray.push(countObject);
  });
  return countObjectArray;
}
