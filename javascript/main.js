const time = document.querySelector('.datepicker');
const addBtn = document.querySelector('.add-btn');
const timeFrame = document.querySelector('#timePeriod');
const maxDays = document.querySelector('#maxDays');
const submitBtn = document.querySelector('.submit-btn');
let entryDateNum = 1;
let exitDateNum = 1;
let allNewEntries = [];
let allNewExits = [];
let amountAllDays;

time.flatpickr({
    allowInput: true,
    wrap: true,
    // humanfriendly date
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d"
});

let fpEntry = flatpickr('#entryDate1', {});
let fpExit = flatpickr('#exitDate1', {});
// let addedDays = 0;
// console.log(addedDays);
// let allAddedDaysRounded = 0;
// console.log(allAddedDaysRounded);
let newFpEntry;
let newFpExit;
let newFieldPairs = 0;

const addFields = function (event) {
  event.preventDefault();
  entryDateNum +=1;
  exitDateNum +=1;

  // creating two new input fields
  let newEntry = document.createElement('input');
  let newExit = document.createElement('input');

  // identify the parent element after which the new elements should be placed
  let parent = document.querySelector('.parent');

  // give newEntry properties
  newEntry.type = "text";
 /* not working: newEntry.classList.add = ("datepicker", "flatpickr-input", "active");
 ==> adding CSS class names individually */
  newEntry.className += "datepicker";
  newEntry.className += " flatpickr-input";
  newEntry.className += " active";
  newEntry.placeholder = "Entry Date..";
  newEntry.id = `entryDate${entryDateNum}`;

  // give newExit properties
  newExit.type = "text";
  newExit.className += "datepicker";
  newExit.className += " flatpickr-input";
  newExit.className += " active";
  newExit.placeholder = "Exit Date..";
  newExit.id = `exitDate${exitDateNum}`;

  // inserting both new elements into the DOM
  parent.appendChild(newEntry);
  parent.appendChild(newExit);


 /* create new fields with entry and exit input fields that will have their
   own id that is incremented by 1 each time you click the button
  apply flatpickr to the new elements */
  newFpEntry = flatpickr(`#entryDate${entryDateNum}`, {});
  newFpExit = flatpickr(`#exitDate${exitDateNum}`, {});

  allNewEntries.push(newFpEntry);
  allNewExits.push(newFpExit);
  console.log(allNewEntries);
  console.log(allNewExits);

  newFieldPairs = document.querySelector(".parent").childNodes.length;
  newFieldPairs = (newFieldPairs-3)/2;
  console.log(newFieldPairs)
  console.log('newFpEntry');
}


/* adding another function that will check how many new entries there are (.include?) and count them, get the number to loop through the days count

*/

// adding eventListener to the Add Trip button, callbackfunction = addField
addBtn.addEventListener('click', addFields);

/* Still todo: when the input date or exit date is after timeframe set, it needs to ignore the days
could limit the dates you can pick by using first entry + timeframe and cancel out every date after that
using lastExit as limit on datepickr */

// start calculations when the submit button is clicked
submitBtn.addEventListener('click', event => {

  // prevents the fields to be 'filled' with invalid input elements
  event.preventDefault();
  // if (amountAllDays.value != 0) {amountAllDays = 0};

  // defining variables and assigning them to values you can use in calculation
  let maxDaysValue = maxDays.value;

  let timeFrameValue = parseInt(timeFrame.value);
  let text;
  const firstEntryDate = fpEntry.selectedDates[0];

  const firstExitDate = fpExit.selectedDates[0];


  /* calculating the days of first trip, adding one day, since the entry day as
  well as exit day count as one full day each */
  const amountFirstDays = ((firstExitDate - firstEntryDate) / (60*60*24*1000)) + 1;
  const amountFirstDaysRounded = Math.floor(amountFirstDays);
  // let amountAllDays;

  /* check if there are new fields added or the calculation is limited to onw trip
  if there is an element in the DOM that has the id = entryDate2,
    the value will be assigned to the new entry variables and the amount of days
    bewteen the dates will be calculated */
    let addedDays = 0;
    let allAddedDaysRounded = 0;

  if (document.querySelector('#entryDate2')){
    let newEntryDate;
    let newExitDate;

    for (let i = 0; i < newFieldPairs; i ++) {
      let entries = allNewEntries[i];
      console.log(`entries: ${entries}`);
      newEntryDate = entries.selectedDates[0];
      console.log(`new entry date = ${newEntryDate}`);
      let exits = allNewExits[i];

      newExitDate = exits.selectedDates[0];
      console.log(`new exit date = ${newExitDate}`);

      /* calculating the days, adding one day, since the entry day as well
      as exit day count as one full day each */
      addedDays = ((newExitDate - newEntryDate) / (60*60*24*1000)) + 1;
      console.log(`added days = ${addedDays}`);

      /*using Math.floor to round down the days, since it would otherwise
      take hours into account */
      addedDaysRounded = Math.floor(addedDays);
      console.log(`added days rounded = ${addedDaysRounded}`);

      // adding result to the variable that will later be used to calculate all days
      allAddedDaysRounded += addedDaysRounded;
      console.log(`all added days rounded = ${allAddedDaysRounded}`);
  // console.log('break');
    }

  }

  if (!document.querySelector('#entryDate2')){
    // If there is only one trip, amountAllDays = amountFirstDaysRounded
    amountAllDays = amountFirstDaysRounded;
  }else{
    // if there are more trips, it adds them to the first trip
    amountAllDays = amountFirstDaysRounded  + allAddedDaysRounded;
  }

  // function to calculate the timeFrame input to the entryDate
  function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  // calling addDays function, assigning result to last day of time frame
  const lastExit = addDays(firstEntryDate, timeFrameValue );

  // applying readable format: Day of the week date month year
  const lastExitReadable = lastExit.toDateString();
  /* alternatively applying format: day/month/year
 const dateFormat = Intl.DateTimeFormat().format(lastExit); */

  // output:
  if (maxDaysValue < amountAllDays) {
    text = `Please remove ${amountAllDays - maxDaysValue} days to not overstay your visit.`;
  }else {
    text = `You are within the allowed time range, using ${amountAllDays} days and have another ${maxDaysValue - amountAllDays} days to use until ${lastExitReadable}`;
  }

  /* Creating new DOM-elements to display the output
  identify parent element after which insert the results */
  const result = document.querySelector('#result');
  result.textContent = text;
});

/* Reminder how JS Dates work:
const firstEntry = `${firstEntryDate.getDate()}. ${firstEntryDate.getMonth()+1}. ${firstEntryDate.getYear()+1900}`;
console.log(firstEntryDate.getDate());
console.log(firstEntryDate.getMonth()+1); // JS starts month with index 0
console.log(firstEntryDate.getYear()+1900); // JS starts counting at 1900 */
