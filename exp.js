const Joi = require('joi')// It is used for validation purposes...
const express = require('express')
const app = express()
var fs=require('fs');
var users = [
    { 
        id : 1 ,
        name : "karthik" ,
        password : "sarma" ,
        profession : "student"
    } , 
    {
        id : 2,
        name : "shiva" ,
        password : "goinaka" ,
        profession : "student "
    }
]
app.use(express.json());
//Middle ware
app.use((req,res,next)=>{
    var date= new Date();
    var time=
    {
        date:date,
        path:req.path,
        method:req.method
    }
    var ft=JSON.stringify(time);
    fs.appendFileSync('logpath.txt',ft+'\n',(err)=>
    {
        if(err)
        throw new Error('path isnt saved');
        else
        console.log('path is saved');
    })
    next();
})
// app.use(k);
//Get all user details
app.get('/api/userdetails', (req ,res)=>
{
    res.send(users);
    const m=JSON.stringify(users);
    fs.appendFile('log.txt',"Get method(all details)"+"\n"+m+"\n",(err)=>
    {
        if(err)
        {
        throw new Error('output isnt saved in file');
        }
        else{
            console.log('File saved');
        }
    });
});
//checking whether the particular user is there or not....
app.get('/api/userdetails/:id',(req,res)=>
{
    console.log('user verification!!!');
    const user= users.find(c => c.id === parseInt(req.params.id));
    if(!user)
    {
    res.status(404).send("User doesnot exist!!....");
    }
    res.send(user);
    const x=JSON.stringify(user);
    fs.appendFile('log.txt',"User verification.."+"\n"+x+"\n",(err)=>
    {
      if(err)
      {
      throw new Error('output isnt saved in file');
      }
      else{
          console.log('File saved');
      }
    })
});
//New user registration...
app.post('/api/userdetails',(req,res)=>
{
    console.log("User registration.....");
    const user1 =
    {
        id : users.length +1,
        name : req.body.name ,
        password : req.body.password ,
        profession : req.body.profession 
    }   
    users.push(user1);
    res.send(user1);
    const x=JSON.stringify(user1);
    fs.appendFile('log.txt',"New user"+"\n"+x+"\n",(err)=>
    {
        if(err)
        {
        throw new Error('output isnt saved in file');
        }
        else{
            console.log('File saved');
        }
      })
});
//Username and password updation and validation using JOI package...
app.put('/api/userdetails/:id',(req,res)=>
{
    console.log("Userame and password validation and modification....");
    const user= users.find(c => c.id === parseInt(req.params.id));
    if(!user)
    {
    res.status(404).send("User doesnot exist!!....");
    }
    const part= {
        name : Joi.string().min(4).required(),
        password : Joi.string().min(4).required(),
    };
   const result =Joi.validate(req.body , part);
   if(result.error) return res.status(400).send(result.error.details[0].message);
   user.name=req.body.name;
   user.password=req.body.password;
   const y=JSON.stringify(user);
   fs.appendFile('log.txt',"User details updation"+"\n"+y+"\n",(err)=>
   {
    if(err)
    {
    throw new Error('output isnt saved in file');
    }
    else{
        console.log('File saved');
    }
   });
   res.send(user);
});
//Deleting user details
app.delete('/api/userdetails/:id',(req,res)=>
{
console.log("User deletion...");
const user2=users.find( d=>d.id===parseInt(req.params.id));
if(!user2) return res.status(404).send('User doesnt exist...');
const index = users.indexOf(user2);
users.splice(index , 1);
const z=JSON.stringify(user2);
res.send(user2);
fs.appendFile('log.txt',"Deleted user"+"\n"+z+"\n",(err)=>
{
    if(err)
    {
    throw new Error('output isnt saved in file');
    }
    else{
        console.log('File saved');
    }
})
});
const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}...`));   