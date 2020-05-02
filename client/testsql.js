var nosql = require("database-jones");

var Town = function(name, county) {
  if (name) this.town = name;
  if (county) this.county = county;
};

// create basic object<->table mapping
var annotations = new nosql.TableMapping("towns").applyToClass(Town);

//check results of find
var onFind = function(err, result) {
  console.log("onFind.");
  if (err) {
    console.log(err);
  } else {
    console.log("Found: " + JSON.stringify(result));
  }
  process.exit(0);
};

//check results of insert
var onInsert = function(err, object, session) {
  console.log("onInsert.");
  if (err) {
    console.log(err);
  } else {
    console.log("Inserted: " + JSON.stringify(object));

    // Now read the data back out from the database
    session.find(Town, "Maidenhead", onFind);
  }
};

// insert an object
var onSession = function(err, session) {
  console.log("onSession.");
  if (err) {
    console.log("Error onSession.");
    console.log(err);
    process.exit(0);
  } else {
    var data = new Town("Maidenhead", "Berkshire");
    session.persist(data, onInsert, data, session);
  }
};

var dbProperties = nosql.ConnectionProperties("ndb");

console.log("Openning session");

// connect to the database
nosql.openSession(dbProperties, Town, onSession);

console.log("Openned session");
