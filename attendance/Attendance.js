
const mongoose = require('mongoose');
const attendanceSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
      },
      rollno: {
         type: Number,
         require: true
      },
   date: [{
    type: Date,
    require: false
   }]
})

const Attendance = mongoose.model("attendance", attendanceSchema);

module.exports = Attendance;