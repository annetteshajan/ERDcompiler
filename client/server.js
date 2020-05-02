const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const Router = Express.Router();
var path = require("path");
var app = Express();
var http = require("http").createServer(app);

const io = require("socket.io")(http);
const users = {};
io.on("connection", function (socket) {
  console.log("new user");
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
http.listen(4000, function () {
  console.log("Listening on 4000");
});
console.log("hello here");

const CONNECTION_URL =
  "mongodb+srv://annette:hello@mycluster-6gzlj.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "DB";
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
// const item = [];
var database, collection, item;

var result = [];

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});

// create a GET route
var list;
app.get("/express_backend", async (req, res, next) => {
  try {
    MongoClient.connect(
      CONNECTION_URL,
      { useNewUrlParser: true },
      (error, client) => {
        if (error) {
          throw error;
        }

        database = client.db(DATABASE_NAME);
        collection = database.collection("people");
        console.log("Connected to `" + DATABASE_NAME + "`!");

        var myPromise = () => {
          return new Promise(function (resolve, reject) {
            collection.find({}).toArray(function (err, docs) {
              if (err) {
                // Reject the Promise with an error
                return reject(err);
              }
              console.log("success");
              // Resolve (or fulfill) the promise with data
              return resolve(docs);
            });
          });
        };
        var callMyPromise = async () => {
          var result = await myPromise();
          return result;
        };

        callMyPromise().then(function (result) {
          // client.close();
          console.log(result);
          res.send(result);
        });
        list = result;
        // console.log(collection);
        // item = result;
      }
    );
  } catch (error) {
    next(error);
  }
  // var a = getFiles();
  // console.log(results);
  // res.send(getFiles);
});
function contain(a, b) {
  var i;
  for (i = 0; i < a.length; i++) {
    if (a[i] == b) {
      return 1;
    }
  }
  return 0;
}
function generateSQLquery(entitylist, nameID, pklist, weakentitylist) {
  var query = "";
  var j;
  for (var k in entitylist) {
    var query1 = "CREATE TABLE ";
    query1 = query1.concat(nameID[k] + "(");
    for (j = 0; j < entitylist[k].length; j++) {
      query1 = query1.concat(entitylist[k][j] + " VARCHAR(255),");
    }

    query1 = query1.concat("PRIMARY KEY(" + pklist[k] + "));");
    query = query.concat(query1 + "\n");
  }
  for (var k in weakentitylist) {
    var query1 = "CREATE TABLE ";
    query1 = query1.concat(nameID[k] + "(");
    for (j = 0; j < entitylist[k].length - 1; j++) {
      query1 = query1.concat(entitylist[k][j] + " VARCHAR(255),");
    }

    query1 = query1.concat(entitylist[k][j] + " VARCHAR(255));r");
    query = query.concat(query1 + "\n");
  }

  console.log(query);
  return query;
}
function generateEntityList(tgtmap, linkTo, linkToName, nameID) {
  var entitylist = {};
  var finalEntity = {};
  var weakentitylist = {};
  var pklist = {};
  for (var i in tgtmap) {
    attributelist = [];

    if (tgtmap[i] == "Entity") {
      for (j = 0; j < linkToName[i].length; j++) {
        if (
          tgtmap[linkToName[i][j]] == "Attribute" ||
          tgtmap[linkToName[i][j]] == "MultiAttribute" ||
          tgtmap[linkToName[i][j]] == "PrimaryKey"
        ) {
          attributelist.push(nameID[linkToName[i][j]]);
          if (tgtmap[linkToName[i][j]] == "PrimaryKey") {
            pklist[i] = nameID[linkToName[i][j]];
          }
        }
      }
      entitylist[i] = attributelist;
      finalEntity[nameID[i]] = attributelist;
    } else if (tgtmap[i] == "WeakEntity") {
      for (j = 0; j < linkToName[i].length; j++) {
        if (
          tgtmap[linkToName[i][j]] == "Attribute" ||
          tgtmap[linkToName[i][j]] == "MultiAttribute" ||
          tgtmap[linkToName[i][j]] == "PrimaryKey"
        ) {
          attributelist.push(nameID[linkToName[i][j]]);
        }
      }
      weakentitylist[i] = attributelist;
      finalEntity[nameID[i]] = attributelist;
    }
  }

  console.log(entitylist);

  return [
    generateSQLquery(entitylist, nameID, pklist, weakentitylist),
    finalEntity,
  ];
}
function func(a) {
  var i, j;
  var targetmap = {};
  var linkTo = {};
  var linkToName = {};
  var arr = [];
  var nameID = {};
  for (i = 0; i < a.length; i++) {
    targetmap[a[i]["id"]] = a[i]["type"];
    nameID[a[i]["id"]] = a[i]["name"];
  }
  for (i = 0; i < a.length; i++) {
    arr = [];
    arrname = [];
    console.log("hiii");
    try {
      for (j = 0; j < a[i]["linksTo"].length; j++) {
        {
          arr.push(targetmap[a[i]["linksTo"][j]["target"]]);
          arrname.push(a[i]["linksTo"][j]["target"]);
        }
      }
      linkTo[a[i]["id"]] = arr;
      linkToName[a[i]["id"]] = arrname;
    } catch (error) {
      continue;
    }
  }

  var temp, type;
  var errorlist = "";
  for (var k in linkTo) {
    temp = targetmap[k];
    switch (temp) {
      case "Entity": {
        type = 1;
        break;
      }
      case "Relationship": {
        type = 2;
        break;
      }
      case "Attribute": {
        type = 3;
        break;
      }
      case "MultiAttribute": {
        type = 4;
        break;
      }
      case "WeakEntity": {
        type = 5;
        break;
      }
      case "WeakRelationship": {
        type = 6;
        break;
      }
      case "primaryKey": {
        type = 7;
        break;
      }
    }
    // check for wrong connections
    for (j = 0; j < linkTo[k].length; j++) {
      if (linkTo[k][j] == "Entity" || linkTo[k][j] == "WeakEntity") {
        if (type == 1 || type == 5) {
          errorlist = errorlist.concat("|Entity cannot be linked to entity|");
          console.log("error1");
        }
      }
      if (
        linkTo[k][j] == "Relationship" ||
        linkTo[k][j] == "WeakRelationship"
      ) {
        if (type == 2 || type == 6) {
          errorlist = errorlist.concat(
            "|Relationship cannot be linked to relationship|"
          );
        }
        if (type == 3 || type == 4) {
          errorlist = errorlist.concat(
            "|Relationship cannot be linked to attributes|"
          );
        }
      }
      if (linkTo[k][j] == "Attribute" || linkTo[k][j] == "MultiAttribute") {
        if (type == 2 || type == 6) {
          errorlist = errorlist.concat(
            "|Attribute cannot be linked to Relationship|"
          );
        }
      }
    }
  }
  // check for primary key for every strong entity
  for (var k in linkTo) {
    if (targetmap[k] == "Entity" && !contain(linkTo[k], "PrimaryKey")) {
      errorlist = errorlist.concat("|Every strong entity needs a primary key|");
      break;
    }
  }
  // check if relationships are connected to an entity
  for (var k in targetmap) {
    if (targetmap[k] == "Relationship") {
      try {
        if (contain(linkTo[k], "Entity") || contain(linkTo[k], "WeakEntity")) {
        }
      } catch (error) {
        errorlist = errorlist.concat(
          "|Relationship needs to be connected to an Entity|"
        );
      }
    }
  }
  //check for disconnected items
  var found;
  for (var k in targetmap) {
    found = 0;
    for (var i in linkToName) {
      if (k == i) {
        found = 1;
        break;
      }
      for (j = 0; j < linkToName[i].length; j++) {
        if (k == linkToName[i][j]) {
          found = 1;
          break;
        }
      }
      if (found == 1) {
        break;
      }
    }
    if (found == 0) {
      errorlist = errorlist.concat("|Disconnected items not allowed|");
      break;
    }
  }
  if (errorlist == "") {
    var q = generateEntityList(targetmap, linkTo, linkToName, nameID);
    return [q[0], 1, q[1]];
  }
  console.log(targetmap);
  console.log(linkTo);
  console.log(linkToName);
  return [errorlist, 0, null];
  console.log([errorlist, 0]);
  console.log(targetmap);
  console.log(linkTo);
  console.log(linkToName);
}

app.post("/express_backend", (req, res) => {
  // console.log("hereee");
  // console.log("item" + item);

  let date_ob = new Date();

  let date = ("0" + date_ob.getDate()).slice(-2);

  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();

  let minutes = date_ob.getMinutes();
  let current_date = date + "/" + month + "/" + year;
  let current_time = hours + ":" + minutes;
  console.log(req.body);
  var filename = req.body[req.body.length - 1];

  req.body.pop();
  var q = func(req.body[0]);
  //insert into table
  // console.log(req.method);
  // res.json({ greeting: "hello" });

  if (q[1] == 1) {
    body = {
      filename: filename,
      entitylist: req.body[0],
      HTML: q[0],
      time: current_time,
      date: current_date,
    };
    if (filename != "") {
      collection.remove({
        filename: filename,
      });
      console.log("deleted");
      collection.insertOne(body, (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        console.log("inserted");
      });
    }
  }
  // console.log(res);

  // console.log(res);
  // console.log("result:" + item);
  res.send(q);
});
