const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/userdb', { 
     useNewUrlParser: true,
     useUnifiedTopology: true,
}).then(() => {
     console.log('Connection successful!');
}).catch((e) => {
     console.log('Connection failed!', e);
})