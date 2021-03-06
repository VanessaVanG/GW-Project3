const firstCloud = document.querySelector('#first-cloud');
const secondCloud = document.querySelector('#second-cloud');


//populate the select menu for the clouds
function cloudNameSelect() {
  const labels = ['All Right News', 'The American Conservative', 'Breitbart', 'Daily Wire', 'Economist', 'The Fiscal Times', 'Fox News', 'The Hill', 'NY Post', 'Reason', 'Washington Times', '-----------', 'All Left News', 'The Atlantic', 'BBC', 'Daily Beast', 'The Guardian', 'Intercept', 'Mother Jones', 'New Republic', 'Politico', 'Slate', 'Washington Post'];
  const png_name = [
    'R-All.png', 
    'R-AmericanConservative.png', 
    'R-Breitbart.png', 
    'R-DailyWire.png',
    'R-Economist.png', 
    'R-FiscalTimes.png', 
    'R-FoxNews.png', 
    'R-Hill.png', 
    'R-NewYorkPost.png', 
    'R-Reason.png', 
    'R-WashingtonTimes.png', 
    ' ', 
    'L-All.png', 
    'L-Atlantic.png', 
    'L-BBC.png', 
    'L-DailyBeast.png', 
    'L-Guardian.png', 
    'L-Intercept.png', 
    'L-MotherJones.png', 
    'L-NewRepublic.png', 
    'L-Politico.png', 
    'L-Slate.png', 
    'L-WashingtonPost.png'];
  
  for (let i = 0; i < labels.length; i++) {
    let firstOption = document.createElement('option');
    let secondOption = document.createElement('option');
    firstOption.text = labels[i];
    firstOption.value = png_name[i];
    firstOption.className = 'form-control';
    secondOption.text = labels[i];
    secondOption.value = png_name[i];
    secondOption.className = 'form-control';
    firstCloud.appendChild(firstOption);
    secondCloud.appendChild(secondOption);
  }
}

//function to handle when a new news org is selected
function firstOptionChanged(news_org) {
  showWordCloud(news_org, side='first');
}

function secondOptionChanged(news_org) {
  showWordCloud(news_org, side='second');
}

//get the word cloud image
function showWordCloud(news_org, side) {
  let url = `/view/${news_org}`;
  if (side === 'first' &&  news_org !== ' ') {
    let firstImage = document.querySelector('#first-image');
    firstImage.innerHTML = '<img class="figure-img rounded" src=' + url + '>';
  } else if (side === 'second' && news_org !== ' ') {
    let secondImage = document.querySelector('#second-image');
    secondImage.innerHTML = '<img class="figure-img rounded" src=' + url + '>';
  }
}

//make the select menus
cloudNameSelect();

//set the initial selection
firstCloud.options[12].selected = true;
firstOptionChanged('L-All.png');
secondOptionChanged('R-All.png');
