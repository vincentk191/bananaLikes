const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fileName = 'likes.json'
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: false
}));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err;
      }

      let parsedData = JSON.parse(data);
      const likes = parsedData.Images;
      res.render('thumbNail', {
         counter: likes
      });
   });
});

app.get('/loadUser', (req, res) => {
   let input = req.query.input.toLowerCase();

   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err
      }
      const parsedJson = JSON.parse(data);

      const userDB = parsedJson.users;

      let output = userDB.find(element => {
         let username = element.toLowerCase();

         if (input !== '') {
            if (username.indexOf(input) > -1) {

               return element;
            } else if (username.indexOf(input) > -1) {
               return element;
            }
         }
      });
      res.send({
         user: output,
      })

   })


});

app.post('/liked', (req, res) => {
   const xLiked = req.body.imageLiked - 1;
   const user = req.body.username
   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err;
      }

      let parsedData = JSON.parse(data);
      let likes = parsedData.Images;
      let i = 0;

      if (user === 'Bob') {
         i = 0;
      } else if (user === 'Patrick') {
         i = 1;
      } else if (user === 'Edward') {
         i = 2;
      }
      let userLikes = parsedData.likesOfUsers[i];

      if (userLikes[xLiked] === 1) {
         likes[xLiked] = likes[xLiked] - 2;
         userLikes[xLiked] = -1;
      } else if (userLikes[xLiked] === 0) {
         likes[xLiked] += 1;
         userLikes[xLiked] = 1;
      } else {
         likes[xLiked] += 1;
         userLikes[xLiked] = 0;
      }

      let newData = JSON.stringify(parsedData);
      fs.writeFile(fileName, newData, (err) => {
         if (err) {
            return console.log(err);
         }
      });
      res.send({
         counter: likes
      });
   });
});

var server = app.listen(3000, () => {
   console.log(`Server's working just fine on port 3000!`);
});
