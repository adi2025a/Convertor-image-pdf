import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const PORT =3000;
const app = express();

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

//ROUTES
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
