const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const date=require(__dirname+'/date.js')


const app=express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
// let items=['Buy Food','Cook Food', 'Eat Food'];
// let workItems=[];

mongoose.connect('mongodb://localhost:27017/todolistDB')
const itemsSchema={
    name:String
};
const Item=mongoose.model('Item',itemsSchema);

const item1=new Item({
    name: 'Welcome to your to-do list'
})

const item2=new Item({
    name: 'hit the +button to add a new item'
})

const item3=new Item({
    name: 'press the -button to delete an existing item'
})
const defaultItems=[item1,item2,item3]

Item.insertMany(defaultItems, (error)=>{
    if(error){
        console.log(error)
    } else {
        console.log("success")
    }
})


app.get ('/', (req,res)=>{
    let day=date.getDate()
    res.render('list',{listTitle:"today", newListItem:items})   

app.get('/work', (req,res)=>{
res.render('list',{listTitle:"work list", newListItem:workItems})
})
   
app.get('/about', (req,res)=>{
    res.render('about')
})

   app.post('/',function(req,res){
    let item=req.body.newItem

    if (req.body.list==='work')
    {
        workItems.push(item)
        res.redirect('/work')
    }
    else{item=req.body.newItem;
       items.push(item)
       res.redirect('/')
    }
       
   })
})


app.listen(3000,()=>{
    console.log('Server started at port 3000')
})
