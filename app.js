const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const date=require(__dirname+'/date.js')

const app=express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

// connect to database
mongoose.connect('mongodb://localhost:27017/todolistDB',{ useUnifiedTopology: true,useNewUrlParser: true } )
const itemsSchema={
    name:String
};
const Item=mongoose.model('Item',itemsSchema);

//default items
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


//get command, inital rendering
app.get ('/', (req,res)=>{
    Item.find({},function(err,foundItems){
       if (foundItems.length===0){
    Item.insertMany(defaultItems, (error)=>{
    if(error){
        console.log(error)
    } else {
        console.log("success")
    }   
}) ; 
res.redirect('/')
}
else {
    res.render('list',{listTitle:"today", newListItem:foundItems})  
}  })
  
//get command to other pages
app.get('/work', (req,res)=>{
res.render('list',{listTitle:"work list", newListItem:workItems})
})
   
app.get('/about', (req,res)=>{
    res.render('about')
})

// post commend,add new items
   app.post('/',function(req,res){

    const itemName=req.body.newItem
    const newItem= new Item({
        name: itemName
    })
    if (req.body.list==='work')
    {
        workItems.push(item)
        res.redirect('/work')
    }
    else{
        Item.create(newItem)
       res.redirect('/')
    }
       
   })
})

app.post('/delete', (req,res)=>{
    const checkedbox= req.body.checkbox
    Item.findByIdAndDelete(checkedbox,(err)=>{
        if(err){
            console.log(err)
        } else{
            console.log('success')
        }
    })
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log('Server started at port 3000')
})
