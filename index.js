import express from "express"
import jwt from "jsonwebtoken"

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world")
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        fullname: 'Lol'
    }, 'secret123');

    res.json({
        succes: true,
    });
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server OK')
});