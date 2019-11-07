//Requires
const fetch = require("node-fetch");
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

async function getAdminDateTimes(url) {

  var response = await fetch(url); //TODO: ADD CHECKS FOR 404/500 and other problems

  var getTimes = async function (text) {
    return await text.match(/(\d\d\d\d-\d\d-\d\d)|(\d\d:\d\d:\d\d)/gi);
  }

  var changeTimeToMins = async function (text) {
    var newTimesArray = [];
    for (i = 0; i < text.length - 1; i++) {
      if (text[i].match(/(\d\d:\d\d:\d\d)/gi)) {

        var splitTime = text[i].split(':');

        var h = Number(splitTime[0]);
        var m = Number(splitTime[1]);
        var s = Number(splitTime[2]);

        if (s >= 30) s = 1; //Swap seconds to minutes if above or equal to 30

        if (h >= 1) h = h * 60; //Change hours to minutes

        var minutes = m + h + s; //Sum times into minutes

        newTimesArray.push(minutes);
      } else {
        newTimesArray.push(text[i]);
      }
    }
    return newTimesArray;
  }

  var convertArrayListToDatesTimes = async function (array) {
    var newDateTimeArray = [];
    for (i = 0; i < array.length; i++) {
      newDateTimeArray.push([array[i], array[i + 1]]);
      i++
    }
    return newDateTimeArray;
  }

  async function getThis() {
    var responseText = await response.text();
    var timesDates = await getTimes(responseText);
    var fullArrayList = await changeTimeToMins(timesDates);
    var dateTimesArray = await convertArrayListToDatesTimes(fullArrayList);
    return dateTimesArray;
  }

  return await getThis();
}

function getLast28Days() {
  var endDate = moment() + 1, startDate = moment().subtract(28, 'days');
  var last28days = moment.range(startDate, endDate);
  var last28daysArray = Array.from(last28days.by('day'));
  var last28DaysFormattedArray = last28daysArray.map(m => m.format("YYYY-MM-DD"));
  return last28DaysFormattedArray;
}

async function getFullAdminDateTimesList(baseURL, staticSessionPath, playerID) {
  var url = baseURL + staticSessionPath + playerID;
  var daysList = getLast28Days();
  var i2 = 0;

  function reverseDates(unReversedDats) {
    if (unReversedDats != null) {
      return unReversedDats.reverse();
    } else {
      return null;
    }
  }

  function cutDats(dats) {
    if (dats != null) {
      for (i = 0; i < dats.length; i++) {
        // console.log('Checking if: ' + daysList[0] + "is after: " + dats[i][0]);
        if (Moment(daysList[0]).isAfter(dats[i][0])) {
          dats.shift();
          i--;
        } else {
          return dats;
        }
      }
      return dats;
    } else {
      return null;
    }
  }

  function fillLast28Days(baseDats) {
    var fullAdminDateTimes = [];

    if (baseDats != null && baseDats.length != 0) {
      for (i = 0; i < daysList.length; i++) {
        if (baseDats[i2] != undefined) {
          if (daysList[i] == baseDats[i2][0]) {
            // console.log("Day number " + i + " is: " + daysList[i] + " ||| And adminDateIs: " + baseDats[i2][0]);
            fullAdminDateTimes.push([daysList[i], baseDats[i2][1]]);
            i2++;
          } else {
            // console.log("Day is: " + daysList[i] + " ||| And adminDateIs: " + baseDats[i2][0]);
            fullAdminDateTimes.push([daysList[i], 0]);
          }
        } else {
          // console.log("Day is: " + daysList[i] + " ||| And adminDateIs: " + baseDats[i2][0]);
          fullAdminDateTimes.push([daysList[i], 0]);
        }
      }
      return fullAdminDateTimes;
    } else {
      for (i = 0; i < daysList.length; i++) {
        fullAdminDateTimes.push([daysList[i], 0]); //If dates are null then fill all with empty time dates
      }
      return fullAdminDateTimes;
    }
  }

  var getBaseDats = await getAdminDateTimes(url);

  var reversedDates = reverseDates(getBaseDats);
  var cdats = cutDats(reversedDates);
  var getFullDates = fillLast28Days(cdats);

  console.log(getFullDates);
  return getFullDates;
}



module.exports = { getFullAdminDateTimesList, getLast28Days };