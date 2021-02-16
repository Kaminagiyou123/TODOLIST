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

const listSchema={
    name:String,
    items:[itemsSchema]
}
const List=mongoose.model('List', listSchema)

//get command, inital rendering on home page
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
}  })})

//get command to other pages
app.get("/:customListName",(req,res)=>{
   const customListName=req.params.customListName;
   console.log(customListName)
   List.findOne({name:customListName},(err,foundList)=>{
if (!err){
if (!foundList){
    const list =new List({
       name:customListName,
       items:defaultItems
   });
   list.save();
   res.redirect('/'+customListName)
} else {
    res.render('list', {listTitle:foundList.name, newListItem:foundList.items})  
}}
   })  
});

app.post ('/',(req,res)=>{
    const itemName=req.body.newItem;
    const listName=req.body.list
    const item=new Item({
        name:itemName
    });
    if (listName==='today'){
     item.save();
    res.redirect('/');   
    } else {
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item);
            foundList.save()
          res.redirect('/'+listName) 
        })
    }  
})

app.post('/delete', (req,res)=>{
    const checkedItemId= req.body.checkbox
    const listName=req.body.listName;
    if (listName==='today'){
    Item.findByIdAndDelete(checkedbox,(err)=>{
        if(err){
            console.log(err)
        } else{
            console.log('success')
        }
    })
    res.redirect('/')} else{
        List.findOneAndUpdate({name:listName},
            {$pull:{items:{_id:checkedItemId}}},
            (err,foundList)=>{
                if (!err)
          {res.redirect('/'+listName) }
        })
    }

})

app.listen(3000,()=>{
    console.log('Server started at port 3000')
})
