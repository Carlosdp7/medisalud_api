const mongoose = require('mongoose');

async function start() {
  try{
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
  });

  console.log('DB CONNECTED!!')
  }catch (err){
    console.log(err);
    process.exit(1);
  }
}

start();