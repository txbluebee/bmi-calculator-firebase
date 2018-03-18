////////////////
// DOM       ///
///////////////

const resultBtn = document.querySelector('.result-btn');
const resultTop = document.querySelector('.result-top');
const resultList = document.querySelector('.result-list');

// Firebase
const bmiDataFirebase = firebase.database().ref('bmiData');

////////////////
// Functions///
///////////////

//bmi caculator
function bmiCalulator(foot, inch, weight) {
  var total_inches = foot * 12 + inch;
  return 703 * (weight / Math.pow(total_inches, 2));
}

//get today's dat mm-dd-yyyy format
function getToday(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = '0'+ dd;
  if (mm < 10) mm = '0'+mm;
  today = mm+'-'+dd+'-'+yyyy;
  return today;
}


////////////////
// EVENTS    ///
///////////////

// RELOAD PAGE
resultTop.addEventListener('click',function(e){
  e.preventDefault(e);
  if (e.target.nodeName !== "IMG"){ return;}
  location.reload();
})



//display BMI data when submiting user input
resultBtn.addEventListener('click', displayBmiDataItem);

function displayResultCircle(number, text){
  let color = (text === "morbidly obese")?"morbidly":text; 
  console.log(color);
  let str = `<div class="${color}">
              <div class="d-flex justify-content-center align-items-center">
                <div class="circle">
                  <div class="inner-circle d-flex flex-column justify-content-center align-items-center">
                    <div class="h3">${number}</div>
                    <span>bmi</span>
                  </div>
                  <a class="reload-icon text-center">
                    <img src="./resources/img/icons_loop.png" alt="reload icon">
                  </a>
                </div>
                <span>${text}</span>
              </div>
            </div>`
  resultTop.innerHTML = str;          
}

function displayBmiDataItem() {
  const weight = document.querySelector('.weight').value;
  const foot = document.querySelector('.foot').value;
  const inch = document.querySelector('.inch').value;
  const height = `${foot}.${inch}`;
  const bmiNumber = bmiCalulator(parseInt(foot), parseInt(inch), parseInt(weight)).toFixed(2);
  let bmiText = '';
  const date = getToday();
  if (bmiNumber >= 40) {
    bmiText = "morbidly obese";
  } else if (bmiNumber >= 30 && bmiNumber < 40) {
    bmiText = "obese";
  } else if (bmiNumber >= 25 && bmiNumber < 30) {
    bmiText = 'overweight';
  } else if (bmiNumber >= 18 && bmiNumber < 25) {
    bmiText = 'healthy';
  } else {
    bmiText ='underweight';
  }
  // save data object to firebase
  bmiDataFirebase.push({weight, height,bmiNumber,bmiText,date});
  // display on result top section
  displayResultCircle(bmiNumber, bmiText)
}

// Retrieve and display data from firebase

bmiDataFirebase.on('value', (snapshot)=>{
  const data = [];
  let str = "";
  snapshot.forEach(item=>{
    data.push(item.val());
  })
  console.log(data.reverse())
  for (let item in data.reverse()){
    str += `<li data-set=${item}>${data[item].bmiText}</li>`
  }
  resultList.innerHTML = str;
});


