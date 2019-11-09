//Requires
const $ = require('jquery');
const chart = require("chart");

//Elements
var ctx = document.getElementById('myChart').getContext('2d');
var serverSelect = document.getElementById('serverSelect');
//Modal Elements
var modalHeaderTextElement = document.getElementsByClassName('modal-header');
var modalBodyTextElement = document.getElementsByClassName('modal-body');
//Buttons
var addServerButton = document.getElementById('addServer');
var editServerButton = document.getElementById('editServer');
var deleteServerButton = document.getElementById('deleteServer');


//Data
var servers;
var currentServer;

//Animation functions
animateChart();

//Listeners
addServerButton.addEventListener("click", () => {
  $(modalHeaderTextElement).text('Add new server');
  $(modalBodyTextElement).empty();

  var serverNameElement = '<label for="server_name">Server name:</label>' +
      '<input type="text" name="server_name" placeholder="My new server" class="form-control">'

  var serverAddressElement = '<label for="server_address">Server name:</label>' +
      '<input type="text" name="server_address" placeholder="https://baseserver.hlstatsx.com" class="form-control">'

  var serverSessionpathElement = '<label for="server_address">Session path:</label>' +
      '<div class="input-group-append">' +
      '<input type="text" disabled="disabled" name="server_sessionpath" placeholder="hlstats.php?mode=playersessions&player=" class="form-control">' +
      '<button type="button" style="font-size:10px;" class="btn btn-dark">Click to edit sessionpath</button>' +
      '</div>'

  $(modalBodyTextElement).append(serverNameElement);
  $(modalBodyTextElement).append(serverAddressElement);
  $(modalBodyTextElement).append(serverSessionpathElement);
});

editServerButton.addEventListener("click", () => {
  $(modalHeaderTextElement).text('Edit server "' + serverSelect.value()) +'"';
  $(modalBodyTextElement).empty();

  var serverNameElement = '<label for="server_name">Server name:</label>' +
      '<input type="text" name="server_name" placeholder="Server name" class="form-control">'

  var serverAddressElement = '<label for="server_address">Server name:</label>' +
      '<input type="text" name="server_address" placeholder="https://baseserver.hlstatsx.com" class="form-control">'

  var serverSessionpathElement = '<label for="server_address">Server name:</label>' +
      '<input type="text" name="server_address" placeholder="https://baseserver.hlstatsx.com" class="form-control">'

  $(modalBodyTextElement).append(serverNameElement);
  $(modalBodyTextElement).append(serverAddressElement);
  $(modalBodyTextElement).append(serverSessionpathElement);
});

deleteServerButton.addEventListener("click", () => {
  $(modalHeaderTextElement).text('Are you sure?');
  $(modalBodyTextElement).text('Are you sure you want to delete server x?');
});


serverSelect.addEventListener("change", function() {
  console.log('updating chart')
  for (i=0; i<servers.length; i++) {v
    currentServer = serverSelect.value;
    if (server[i].sname==currentServer) {
      updateChart(server[i].admins);
      break;
    }
  }
});

//Start functions
getData();

//Data functions
function addServerSelectOption(servername) {
	var newSelectHTML = "<option>" + servername + "</option>";
	$(serverSelect).append(newSelectHTML);
}

function updateChart(chart, admins) {
  chart.data.labels = [];
  chart.data.datasets = [];

  for (i=0; i<admins[0].dats.length; i++) {
    chart.data.labels.push(admins[0].dats[i][0]);
  }

  for (i2=0; i2<admins.length; i2++) {
    chart.data.datasets.push(createAdminData(admins[i2]));
  }

  chart.update();
}

function createAdminData(admin) {
  var times = [];
  var timetotal = 0;

  for (i=0; i<admin.dats.length; i++) {
    times.push(admin.dats[i][1]);
    timetotal += admin.dats[i][1];
  }

  data = {
    label: admin.name + ' (' + timetotal + ' minutes)',
    data: times,
    backgroundColor: admin.color,
    borderColor: admin.color,
  }

  return data;
}

Chart.defaults.global.defaultFontColor = 'white';
let myChart = new Chart(ctx, { //Creating basic chart so it can get updated later
  type: 'line',
  data: {
    labels: ['test 2019-01-01', '2019-01-02', '2019-01-03'],
    datasets: [{
      label: 'admin1',
      data: [25, 50, 75],
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgba(255, 0, 0, 1)',
    },
    {
      label: 'admin2',
      data: [55, 24, 0],
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      borderColor: 'rgba(0, 255, 0, 1)',
    },
    {
      label: 'admin3',
      data: [11, 44, 23],
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      borderColor: 'rgba(0, 0, 255, 1)',
    },
  ]
  },
  options: {
    scales: {
      yAxes: [{
        gridLines: {
          display: true,
          color: "rgba(255,255,255,0.2)"
        },
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        gridLines: {
          display: true,
          color: "rgba(255,255,255,0.2)"
        },
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: true,
    }
  }
});

//Post functions
function getCookieValue(cookieName) {
  var b = document.cookie.match('(^|[^;]+)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

function getCookieCredetentials() {
  
  const credentials = {
    username:getCookieValue('username'),
    password:getCookieValue('password')
  }

  return credentials;
}

async function getData() {
  const username = getCookieValue('username');
  const password = getCookieValue('password');

  const data = { username, password }
  console.log(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch('/servers', options).then(response => response.json())
  .then(json => {
    console.log(json);
    if (json.status=='failure') {
      showErrorMessage(json.message);
    } else if (json.status=='success') {
	  console.log(json.length);

	  for (i=0; i<json.serverList.length; i++)
	  {
      addServerSelectOption(json.serverList[i].sname);
      updateChart(myChart, json.serverList[i].admins); //TODO: FIX
    }

    } else {
      showErrorMessage('Unknown error');
    }
  });
}

//Animation functions
function animateChart() {
  $(".container-fluid").fadeIn();
  $(".form-control").fadeIn();
}

//Animation functions
function hideChart() {
  $(".container-fluid").fadeOut();
}

function showErrorMessage(text) {
  $(".ds-alert").text(text);
  $(".ds-alert").animate({
    opacity: 1
  }, 1000);

  setTimeout(function(){
    $(".ds-alert").animate({
      opacity: 0
    }, 1000);
}, 8000);

  setTimeout(function(){
    $(".ds-alert").text("");
}, 9000);
}