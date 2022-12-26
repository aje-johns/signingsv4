"use strict";
const textareaInput = document.getElementById("inputValues");
const button = document.getElementById("button");
const sliderValue = document.getElementById("sliderValue");
const slider = document.getElementById("numberOfAllocations");
let tBodyEl = document.querySelector("tbody");
let umrObjectArraySorted;
let numberOfUsers;
const copyButton = document.getElementById("copy");
const outputBox = document.getElementById("arrayOutput");
const button2 = document.getElementById("button2");

// bureau ref

button2.addEventListener("click", (e) => {
  const bureauRefInput = document.getElementById("inputValues2");
  const productivityOutputValue = document.getElementById("productivityOutput");
  let tBodyElement = document.getElementById("tbody2");
  const countOfBureauRef = document.getElementById("countOfBureauRef");
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
  const bureauRefDupicate = getBureauRefRepetetion(inputValue);
  console.log(bureauRefDupicate.length);
  bureauRefDupicate.sort((a, b) => {
    return b.duplicateEntries - a.duplicateEntries;
  });
  console.log(bureauRefDupicate[0]["duplicateEntries"]);
  for (let i = 0; i < bureauRefDupicate.length; i++) {
    // the logic to push data into the table
    tBodyElement.innerHTML += `
      <tr>
       <td>${bureauRefDupicate[i]["Data"]}</td>
        <td>${bureauRefDupicate[i]["duplicateEntries"]}</td>
     </tr>
    `;
  }

  console.log(`no of Users = ${noOfResources}`);
  console.log(`AHT = ${aht}`);
  console.log(`Count of Unique Bureau Ref = ${bureauRefDupicate.length}`);
  const minutesAvailable = 480 * noOfResources;
  const timeRequired = bureauRefDupicate.length * aht;
  const Productivity = (timeRequired / minutesAvailable) * 100;
  countOfBureauRef.innerHTML = `Bureau Ref Count : ${bureauRefDupicate.length}`;
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
slider.addEventListener("input", () => {
  sliderValue.innerHTML = slider.value;
  numberOfUsers = slider.value;
});

button.addEventListener("click", () => {
  var userArray = getUserList(numberOfUsers);
  var inputUMR = textareaInput.value.split("\n");
  const userObj = createUserObj(userArray);
  const umrWitNoBrokerCode = removeBrokerCode(inputUMR, 5);
  const umrAndDupicate = getRepetetion(umrWitNoBrokerCode);
  allocate(umrAndDupicate, userObj);
  const finalAllocation = swap(userObj, inputUMR);

  console.log(userObj);

  finalAllocation.forEach((item) => {
    outputBox.innerHTML += `${item} \n`;
  });

  for (let i = 0; i < inputUMR.length; i++) {
    // the logic to push data into the table

    tBodyEl.innerHTML += `
      <tr>
       <td>${inputUMR[i]}</td>
        <td>${finalAllocation[i]}</td>
     </tr>
    `;
  }
});

copyButton.addEventListener("click", () => {
  const dataToCopy = outputBox.value;
  async function copyContent() {
    try {
      await navigator.clipboard.writeText(dataToCopy);
      console.log(dataToCopy);
    } catch (err) {
      console.log("error");
    }
  }
  copyContent();
});

/////////////////////////////
//Functions
/////////////////////////////

function getUserList(count) {
  let userList = [];
  for (let i = 0; i < count; i++) {
    let userNameTemp = prompt(`Enter user ${i + 1}'s Name`);
    userList.push(userNameTemp.toUpperCase());
  }
  return userList;
}

function getRepetetion(umrWitNoBrokerCode) {
  let umrAndCount = [];

  umrWitNoBrokerCode.forEach((umr) => {
    umrAndCount[umr] = umrAndCount[umr] ? umrAndCount[umr] + 1 : 1;
  });

  //the umrAndCount variable is an object that has umr and its count
  //Object.entries(umrAndCount) will display it in an array like fashion

  //spliting the umrAndCount object into an Array and then
  //allocationg the data in array into an object for ease of access
  let umrObjectArray = [];
  Object.entries(umrAndCount).forEach((umrArray) => {
    //we have to create the umr Objects inside the foreach loop
    //and then push it into an array
    let umrObject = { umr: umrArray[0], duplicateEntries: umrArray[1] };
    umrObjectArray.push(umrObject);
  });
  return umrObjectArray;
}

function allocate(umrAndDupicate, userObj) {
  //we are doing the below step to prevent altering the original Array
  let remainingSignings = umrAndDupicate.slice();
  //sorting the remainingSignings in Ascending Order
  // assigning to a new variable is not necessary because this effects the Original Array
  remainingSignings.sort(function (a, b) {
    return a.duplicateEntries - b.duplicateEntries;
  });

  for (let i = 0; i < umrAndDupicate.length; i++) {
    // userObj.forEach((user) => {//the forEach wont work, i have to use a for loop
    //sort it and allocate to the user that has the least count
    for (let j = 0; j < userObj.length; j++) {
      userObj.sort(function (a, b) {
        return b.totalCount - a.totalCount;
      });

      let singingsOnStage = remainingSignings.pop();
      let currentUser = userObj.at(-1);
      if (singingsOnStage == undefined) {
        return;
      } else {
        currentUser.allocatedUMR.push(singingsOnStage);
        currentUser.totalCount =
          currentUser.totalCount + singingsOnStage.duplicateEntries;
      }
    }
    // });//end of forEach()
  }
}

function createUserObj(userArray) {
  let userObjectArray = [];
  userArray.forEach((item) => {
    let userObj = {
      userName: item,
      allocatedUMR: [],
      totalCount: 0,
    };
    userObjectArray.push(userObj);
  });
  return userObjectArray;
}

function removeBrokerCode(umr, index) {
  //if the index is 5 Then the broker code can be removedon the acutal data
  let umrWitNoBrokerCode = [];
  umr.forEach((element) => {
    let umrWithBrokerRemoved = element.slice(index);
    umrWitNoBrokerCode.push(umrWithBrokerRemoved);
  });
  return umrWitNoBrokerCode;
}

function replaceUmrWithUsername(originalInput, allocation) {
  originalInputArray = originalInput.slice();

  console.log(originalInputArray);
  const filteredAllocation = allocation.filter((e) => {
    return e.allocaredUmr !== undefined;
  });
  console.log(filteredAllocation);

  filteredAllocation.forEach((e) => {
    console.log(`${e.allocaredUmr["umrNumber"]} Is Allocated To ${e.userName}`);

    const allocatedUmr = e.allocaredUmr["umrNumber"];
    const allocatedUserName = e.userName;
    originalInputArray.forEach((item) => {
      if (item == allocatedUmr) {
        let newIndex = originalInputArray.indexOf(item);
        originalInputArray[newIndex] = allocatedUserName;
      }
    });
  });
  for (let i = 0; i < originalInputArray.length; i++) {
    // the logic to push data into the table

    tBodyEl.innerHTML += `
      <tr>
       <td>${originalInput[i]}</td>
        <td>${originalInputArray[i]}</td>
     </tr>
    `;
  }
}

function swap(userObj, inputUMR) {
  let tempUmrArray = [...inputUMR];
  // console.log(userObj[0]);
  // console.log(inputUMR);
  //we have to consider the REGEX, since we had removed the Broker code
  //////test
  userObj.forEach((userObj) => {
    userObj["allocatedUMR"].forEach((umr) => {
      let currentUserName = userObj["userName"];
      let currentUmr = umr["umr"];
      console.log(`${currentUserName} has ${currentUmr} allocated`);
      tempUmrArray.forEach((entry) => {
        let tempRegex = new RegExp(`^.....${currentUmr}$`);
        if (tempRegex.test(entry)) {
          let ogArrayIndex = tempUmrArray.indexOf(entry);
          tempUmrArray[ogArrayIndex] = currentUserName;
        }
      });
    });
  });
  return tempUmrArray;
  //////End test
}
