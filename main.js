const express = require('express')
const app = express()
const port = 3000
let fs = require('fs')

// Serve static files (HTML, CSS, JS, JSON)
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/posts', (req, res) => {
    let posts = fs.readFileSync('./db.json');
    posts = JSON.parse(posts).posts;
    
    let queries = req.query;
    let views = queries.views;
    let views_lte = queries.views_lte;
    let views_gte = queries.views_gte;
    let title = queries.title;
    let title_like = queries.title_like;
    
    if(views){
        posts = posts.filter(
            p=>p.views==views
        )
    }
    if(views_lte){
        posts = posts.filter(
            p=>p.views<=views_lte
        )
    }
    if(views_gte){
        posts = posts.filter(
            p=>p.views>=views_gte
        )
    }
    if(title_like){
        posts  = posts.filter(
            p=>p.title.includes(title_like)
        )
    }
    if(title){
        posts  = posts.filter(
            p=>p.title == title
        )
    }
    res.json(posts)  // Thay đổi từ res.send thành res.json
})
app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    let posts = fs.readFileSync('./db.json');
    posts = JSON.parse(posts).posts;
    
    let post = posts.filter(
        p=>p.id==id
    )
    if(post.length>0){
        res.json(post[0]);  // Thay đổi từ res.send thành res.json
    }else{
        res.status(404).json({  // Thay đổi từ res.send thành res.json
            success:false,
            data:{
                message: "id not found"
            }
        });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})