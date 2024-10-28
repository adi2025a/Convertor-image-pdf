import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT =3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

//ROUTES
app.get('/', (req, res) => {
  res.render(path.join(__dirname,'views/home.ejs'));
});

app.get('/imagetopdf',(req,res)=>{
    res.render(path.join(__dirname,'views/imagesToPdf.ejs'));
})


app.get('/pdftoimage',(req,res)=>{
    res.render(path.join(__dirname,'views/pdfToImages.ejs'));
})
//PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
