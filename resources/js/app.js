////////////////
// DOM       ///
///////////////

const resultBtn = document.querySelector('.result-btn');
const resultTop = document.querySelector('.result-top');
const resultList = document.querySelector('.result-list');

// Firebasedelete-btn
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
  if (e.target.nodeName !== "SPAN"){ return;}
  location.reload();
  // document.querySelector('.weight').value = "";
  // document.querySelector('.foot').value = "";
  // document.querySelector('.inch').value = "";
  // resultTop.innerHTML = `<a class="result-btn d-flex justify-content-center align-items-center">
  //                         see result
  //                       </a>`
})



//display BMI data when submiting user input
resultBtn.addEventListener('click', displayBmiDataItem);

function displayResultCircle(number, text){
  let color = (text === "morbidly obese")?"morbidly":text; 
  let str = `<div class="result-circle ${color}">
              <div class="d-flex justify-content-center align-items-center">
                <div class="circle">
                  <div class="inner-circle d-flex flex-column justify-content-center align-items-center">
                    <div class="h3">${number}</div>
                    <span>bmi</span>
                    <span class="reload-icon"></span>
                  </div>
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

  if (isNaN(parseInt(foot))|| isNaN(parseInt(inch)) || isNaN(parseInt(weight))){
    alert('Please enter valid numbers!');
    return;
  }


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

// bmiDataFirebase.on('value', (snapshot)=>{
//   const data = snapshot.val();
//   let str = "";
//   for (let item in data){
//     str += `<li data-key=${item}>
//               <div class="colortheme bg-${data[item].bmiText}"></div>
//               <div>${data[item].bmiText}</div>
//               <div class="box-number">
//                 <span>BMI</span>
//                 ${data[item].bmiNumber}
//               </div>
//               <div class="box-number">
//                 <span>weight</span>
//                 ${data[item].weight} lbs
//               </div>
//               <div class="box-number">
//                 <span>height</span>
//                 ${data[item].height} ft
//               </div>
//               <div>${data[item].date}</div>
//               <div class="close">
//                 <a class="delete-btn">
//                   <i class="ion-ios-close-outline" data-key=${item}></i>
//                 </a>
//               </div>
//             </li>`
//   }
//   resultList.innerHTML = str;
// });


bmiDataFirebase.on('value', (snapshot)=>{
  const data = [];
  snapshot.forEach(item=>{
    var bmiObj = item.val();
    bmiObj.key = item.key;
    data.push(bmiObj);
  })
  let str = "";
  for (let item of data.reverse()){
    str += `<li data-key=${item.key}>
              <div class="colortheme bg-${item.bmiText}"></div>
              <div>${item.bmiText}</div>
              <div class="box-number">
                <span>BMI</span>
                ${item.bmiNumber}
              </div>
              <div class="box-number">
                <span>weight</span>
                ${item.weight} lbs
              </div>
              <div class="box-number">
                <span>height</span>
                ${item.height} ft
              </div>
              <div>${item.date}</div>
              <div class="close">
                <a class="delete-btn">
                  <i class="ion-ios-close-outline" data-key=${item.key}></i>
                </a>
              </div>
            </li>`
  }
  resultList.innerHTML = str;
});

// Delete BMI data

resultList.addEventListener('click', function(e){
  if (e.target.nodeName !=='I') return;
  let key = e.target.dataset.key;
  bmiDataFirebase.child(key).remove();
})


