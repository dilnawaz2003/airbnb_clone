const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./models/User');
const env = require('dotenv');
const cookieParser = require('cookie-parser');
const downloader = require('image-downloader');
const path = require('path');
const multer = require('multer');
const placeModel = require('./models/Place');
const bookingModel = require('./models/Booking');
const dateFns = require('date-fns')
env.config();

const app = express();




app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

//   X-Requested-With

  
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));
const allowedOrigins = ["http://localhost:3000"];




// const corsOptions = {
//     origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//     } else {
//         var msg =
//         "The CORS policy for this site does not " +
//         "allow access from the specified Origin.";
//         callback(new Error(msg), false);
//    }
//  },
//     optionsSuccessStatus: 200,
//     credentials: true,
//  };



//  app.use(cors(
//     corsOptions
// ));


app.get('/profile',async (req,res) => {
    console.log('called profile');
    const token = req.cookies.token;
    try{
        if(token){
            console.log(token);
            const userData = jwt.verify(token,process.env.ACCESS_SECRET_TOKEN);
            console.log(userData);
            if(userData){
                const user = await userModel.findOne({email:userData.email});
                console.log(user);
                res.json(user);
            }else{
                res.json(null);
            }
        }else{
            res.status(500).json({error:'Some Thing WEnt Wrong'});
        }
    }catch(e){
        console.log('error in profile');
    }
    
    
   
});

app.post('/login',async (req,res) => {
    const {email , password} = req.body;

    const existingUser = await userModel.find({email:email});
    try{
        if(existingUser.length === 0) {
            res.status(400).json({ error: 'User Not Found' });
        }else {
           const passOK =  bcrypt.compare(password,existingUser[0].password);
            if(passOK){
                console.log('success');
                jwt.sign({email},process.env.ACCESS_SECRET_TOKEN,(err,token) => {
                    if(err) throw new Error('Some thing went wrong');
                    res.cookie('token',token).json({successful:'user signed in successfuly'});
                });
              
            }else{
                res.status(400).json({error:'Email or Password in incorrect'});
            }
        }
    }catch(e){
        console.log(e);
    }
    

});


app.post('/signup',async (req,res) => {
    console.log('called');

    const {name , email , password} = req.body;

    try{

        const existingUser = await userModel.find({email:email});

        if(existingUser.length !== 0) {
            console.log(existingUser);
            res.status(500).json({ error: 'User Already Exist' });
        } else{
            userModel.create({
                name,
                email,
                password:bcrypt.hashSync(password,10),
            });
            // userModel.save();
            
            res.json({successful:'user signedup successfully'});
        }

    }catch(e){
        console.log('error');
        console.log(e);
    }

   
})


app.post('/logout' , (req,res) => {
    res.cookie('token','').json({successful:"loged out succesfully"});
});




app.post('/upload-photo-by-link', (req,res) => {

    try{
        const {imageLink} = req.body;
    console.log('link');
    

    const newName = Date.now() + ".jpg";

     downloader.image({url:imageLink,dest:__dirname+'/uploads/'+newName}).then(
     ({filename}) => {
        res.json(newName);
     }
     ).catch((err) => console.error(err));;

    
    }catch(e){
        console.log('error in file upload by link');
    }
    
})



// const photoMiddleWare = multer({dest:'/uploads'});
// photoMiddleWare.single('files')


app.use(multer({storage:multer.diskStorage({
    destination:(req,file,cb) => {
       return  cb(null,'./uploads');
    },
    filename:(req,file,cb) => {
       return  cb(null,Date.now()+'.jpg');
    }
})}).array('files',100));



app.post('/upload-local-photo',(req,res) => {
    try{
        // let resFiles = [...req.files];
        console.log(req.files);
        let data = req.files.map(
            (file) => {
                return file.filename;
            }
        )

        console.log(data);
        res.json(data);
    }catch(e){
        res.status(500).json({error:'Some Thing Went Wrong'});
}
})



// *************** PLACES *************************



const authenticateUser = async (req,res,next) => {
    const token = req.cookies.token;
    try{
        if(token){
          
            const userData = jwt.verify(token,process.env.ACCESS_SECRET_TOKEN);
            if(userData){
                const user = await userModel.findOne({email:userData.email});
                req.user = user;
                next();
            }else{
                res.status(500).json({error:'User Not Found'});
            }
        }else{
            res.status(500).json({error:'Some Thing WEnt Wrong'});
        }
    }catch(e){
        console.log('Error Authenticating user ');
        res.status(500).json({error:'Error Authenticating user '});

    }

}
app.post('/place/new',authenticateUser , async (req,res) => {
    
    try{
        const {_id} = req.user;
        const place = await  placeModel.create({
                ownerId:_id,
                ...req.body,
            });
            console.log(place);
        return res.json(place);

    }catch(e){
        res.status(500).json('Error Adding Place to database on server');
    }
})



app.get('/places',authenticateUser,async (req,res) => {
    console.log('called places');
    try{
        const {_id} = req.user;

        const places = await placeModel.find({ownerId:_id}).populate('ownerId');
        console.log(places);

        res.json(places);

    }catch(e){
        res.status(500).json('error Geting Places');
    }

});

app.get('/places/all',async (req,res) =>{

    try{
        const places = await  placeModel.find().populate('ownerId');;
        res.json(places);
    }catch(e){
        res.status(500).json('error getting all places');
    }
});


// ************* BOOKIG - RESERVATION *************


app.post('/booking',authenticateUser,async (req,res) => {
    console.log('caleld booking');
    try{
        const {_id} =  req.user;
        const {placeId,checkInDate ,checkOutDate} = req.body;
        let pricePerNight = null;
        let totalPrice = 0;
        const place = await placeModel.findOne({_id:placeId});

        console.log(_id)
        console.log(placeId)
        console.log(checkInDate)
        console.log(checkOutDate);

        let nights = 0;

        nights = dateFns.differenceInCalendarDays(checkOutDate,checkInDate);
        

        const expiresSecond = 60 * 60 * 24 * nights;

        if(place && nights > 0){
            pricePerNight = place.pricePerNight;
            totalPrice = nights * pricePerNight;
        }else{
            throw new Error('Error Booking place');
        }
        const booking =await  bookingModel.create({
            place:place._id,
            owner:_id,
            checkInTime:checkInDate,
            checkOutTime:checkOutDate,
            price:totalPrice,
            createdAt:new Date(expiresSecond),
        });
        res.json("reservtaion Succesfull");
    }catch(e){
        res.status(500).json(e);
    }
});



app.get('/booking',authenticateUser , async (req,res) => {

    try{

        const {_id} = req.user;
        const bookings = await bookingModel.find({owner:_id}).populate('place');
        res.json(bookings);

    }catch(e){
        res.status(500).json('Error Getting Bookings ');
    }
});




// ************** CONNECTION **********************


// mongodb+srv://dilnawazkhanpk2003:<password>@cluster0.hfmt6ag.mongodb.net/
// mongodb+srv://dilnawazkhanpk2003:Bbcv9klIZX9sFK6N@cluster0.hfmt6ag.mongodb.net/
// mongodb+srv://dilnawazkhanpk2003:<password>@cluster0.hfmt6ag.mongodb.net/?retryWrites=true&w=majority


const uri = "mongodb+srv://dilnawazkhanpk2003:Bbcv9klIZX9sFK6N@cluster0.hfmt6ag.mongodb.net/?retryWrites=true&w=majority";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
    // await mongoose.connection.db.admin().command({ ping: 1 });
    app.listen(4000,(req,res) => {
        console.log('listining');
    });
    
  } 
    catch(e){
        console.log('error occured');
        // console.log(e);
    }
//   finally {
//     await mongoose.disconnect();
//   }
}
run().catch(console.dir);


