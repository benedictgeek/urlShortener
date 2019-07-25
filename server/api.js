const matchEndpoint = require("./helper/matchEndpoint").matchEndpoint;
const getDb = require("./database").getDb;

const getRandom = () => {
  let random =
    Math.random()
      .toString(25)
      .substring(6, 19)
      .toLowerCase() +
    Math.random()
      .toString(36)
      .substring(4, 10)
      .toUpperCase();

  random = random.substring(0, 7);
  if (random.length < 7) {
    getRandom();
  }

  return random;
};

class API {
  constructor() {}

  static exec(req, res) {
    if (req.method == "POST") {
      let urlData = [];

      req.on("data", chunk => {
        urlData.push(chunk);
      });

      req.on("end", () => {
        let parsedData = Buffer.concat(urlData).toString();
        if (matchEndpoint("url", "shrt")) {
          const db = getDb();
          let url = parsedData.split(':')[1].trim();
          url = url.substr(1, url.length - 3)

          let randomMixedString = getRandom();
          db.collection("shrt")
            .findOne({ shortened: randomMixedString })
            .then(data => {
              if (data) {
                randomMixedString = getRandom();
              }
              return db.collection("shrt").insertOne({
                originalUrl: url,
                shortened: randomMixedString,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
            })
            .then(result => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: "Url shortened succesfully",
                    data: {
                        originalUrl: url,
                        shortenedUrl: randomMixedString
                    }
                }))
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }

  static execNonApi(req, res) {
    if(req.url.split('/')[1].length == 7) {
        let urlCode = req.url.split('/')[1];
        let db = getDb();

        db.collection("shrt")
        .findOne({shortened: urlCode})
        .then(response => {
            if(!response) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: 'Invalid url code',
                    statusCode: 404
                }))
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Operation successful',
                statusCode: 200,
                originalUrl: response.originalUrl
            }))
        })

    }
  }

  static catchApiRequest(api) {
    api[0] == "/" ? (api = api.substring(1, api.length)) : (api = null);

    if (api.split("/")[0] == "api") {
      API.parts = api.split("/");
      return true;
    }
    return false;
  }
}

module.exports = API;
