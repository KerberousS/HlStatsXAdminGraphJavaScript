const gad = require('../getdata/getadmindata.js');

/*
Database prepration functions
*/

function createuser_superuser(userDB) {
  const superuser = {
    username: 'superuser',
    password: 'superuser',
    permissions: 'admin',
    servers: {
      server: {
        name: 'default',
        permissions: 'rw'
      }
    }
  }

  const basicUser = {
    username: 'basic',
    password: 'basic',
    permissions: 'admin',
    servers: {
      server: {
        name: 'default',
        permissions: 'rw'
      }
    }
  }

  userDB.insert(superuser);
  userDB.insert(basicUser);
  console.log("Created default users with names: " + superuser.username + " and " + basicUser.username)

  //TODO: Save Settings
}

function ensureUsersDBIndexes(userDB) {
  // Using a sparse unique index
  userDB.ensureIndex({ fieldName: 'username', unique: true }, function (err) {
    console.log('Adding username unique index')
    if (err != null) {
      console.log(err);
    }
  });
}

function prepareUserDB(userDB, serverDB) {
  console.log('Checking for existence of default user')
  userDB.find({ username: 'superuser' }, function (err, docs) {
    if (err != null) {
      console.log(err);
    }
    console.log(docs.length);
    if (docs.length == 0) {
      console.log("Default user is not created, creating one");
      createuser_superuser(userDB);
      ensureUsersDBIndexes(userDB);
      createDefaultServer(serverDB);
      ensureServersDBIndexes(serverDB);
      return false;
    } else {
      console.log("Default user exists in DB");
      return true;
    }
  });
}

/*
Prepare Server DB
*/
function createDefaultServer(serverDB) {
  const defaultServer = {
    sname: 'default',
    address: 'https://csgo-surfcombat.max-play.pl/', //TODO: CHANGE THIS TO SOME NON-EXISTING BASE ADDRESS
    refreshDate: '2019-10-12 22:41:34',
    sessionPath: 'hlstats.php?mode=playersessions&player=',
    admins: [
      {
        name: 'admin1',
        id: 450,
        color: 'rgba(255, 0, 0, 0.2)',
        dats: [ ['2019-01-01', 66], ['2019-01-02', 44], ['2019-01-04', 25]
        ]},
      {
        name: 'admin2',
        id: 288,
        color: 'rgba(0, 0, 255, 0.2)',
        dats: [
          ['2019-01-01', 55], ['2019-01-02', 33], ['2019-01-04', 45]
        ]}
        ]
  }
  serverDB.insert(defaultServer);
  console.log("Created default server with name: " + defaultServer.sname)
}

function ensureServersDBIndexes(serverDB) {

  // Using a sparse unique index
  serverDB.ensureIndex({ fieldName: 'name', unique: true }, function (err) {
    console.log('Adding server name unique index')
    if (err != null) {
      console.log(err);
    }
  });
  serverDB.ensureIndex({ fieldName: 'address', unique: true }, function (err) {
    console.log('Adding servername unique index')
    if (err != null) {
      console.log(err);
    }
  });
}

async function refreshFullAdminDateTimes(serverDB, serverName) {

  if (serverName == null || serverName == undefined) {
    serverDB.find({}, async function (err, docs) {
      if (err != null) {
        console.log(err);
        throw new Error('There was a problem searching for server records');
      }

      for (i = 0; i < docs.length; i++) {
        var admins = docs[i].admins;
        var serverAddress = docs[i].address;
        var sessionPath = docs[i].sessionPath;

        for (i=0; i < admins.length; i++) {
          var int = i;
          var serverSearchQuery = "address"
          var serverSearchParamater = serverAddress;
          var adminSearchQuery = "admins." + int + ".id";
          var adminSearchParameter = admins[i].id;
          var adminDatsSearchQuery = "admins." + int + ".dats";

          setNewDates(serverAddress, sessionPath, serverDB, serverSearchQuery, serverSearchParamater, adminSearchQuery, adminSearchParameter, adminDatsSearchQuery);
        }
      }
    });
  } else {
    serverDB.find({ sname: serverName }, async function (err, docs) { //TODO REDO THIS FOR FULL COMPATIBILITY, ADD ADMIN ID NUMBER ETC.
      if (err != null) {
        console.log(err);
        throw new Error('There was a problem searching for server records');
      }
      
        var admins = docs[0].admins;
        var serverAddress = docs[0].address;
        var sessionPath = docs[0].sessionPath;

        for (i=0; i < admins.length; i++) {
          var int = i;
          var serverSearchQuery = "address"
          var serverSearchParamater = serverAddress;
          var adminSearchQuery = "admins." + int + ".id";
          var adminSearchParameter = admins[i].id;
          var adminDatsSearchQuery = "admins." + int + ".dats";

          setNewDates(serverAddress, sessionPath, serverDB, serverSearchQuery, serverSearchParamater, adminSearchQuery, adminSearchParameter, adminDatsSearchQuery);
        }
      });
  }
}

  async function setNewDates(serverAddress, sessionPath, serverDB, serverSearchQuery, serverSearchParamater, adminSearchQuery, adminSearchParameter, adminDatsSearchQuery) {

    async function getAdminSetQueryWithDats() {
      var newDats = await getAdminDateList(adminSearchParameter, serverAddress, sessionPath);
      return newDats;
    }
    
    var adminDats = await getAdminSetQueryWithDats();

    serverDB.update({[serverSearchQuery]:serverSearchParamater, [adminSearchQuery]:adminSearchParameter}, {$set: { [adminDatsSearchQuery]:adminDats }}, function (err, replaced) {
      if (err != null) {
        console.log(err);
        throw new Error('There was a problem searching for admin record');
      }
      console.log(replaced);
    });

    serverDB.update({[serverSearchQuery]:serverSearchParamater}, {$set: {refreshDate:getCurrentTime()}}, function (err, replaced) {
      if (err != null) {
        console.log(err);
        throw new Error('There was a problem searching for admin record');
      }
      console.log(replaced);
    });
  
  }

  async function getAdminDateList(adminsID, serverAddress, sessionPath) {
    var dats = gad.getFullAdminDateTimesList(serverAddress, sessionPath, adminsID);
    return await dats;
  }

/*
Database CRUD functions
*/

/*
Global functions
*/

function getCurrentTime() {
  var now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}

module.exports = { prepareUserDB, refreshFullAdminDateTimes };

function createCheckDigit(membershipId) {
  if (membershipId.length>1) {
    var SplitID = membershipId.split('');
    var fid;
    for(i=0; i>SplitID.length; i++) {
      for(i=0; i>SplitID.length; i++) {
        fid = fid+SplitID[i];
      }
      SplitID = fid;
    }
    return SplitID;
  } else {
    return membershipId;
  }
}

console.log(createCheckDigit("55555"));