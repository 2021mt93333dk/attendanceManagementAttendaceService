require("dotenv").config();
const express = require('express');
const axios = require('axios');

// Connect
require('../db/db');

const Attendance = require('./Attendance');

const app = express();
const port = 3002;
app.set('port', port);
app.use(express.json())

app.post('/create/attendance/:rollno', async (req, res) => {
    const rollno = req.params.rollno;
    try{
        /**
         * cases:
         * 1. If student exists 
         * --> Check if the attendance record exists.
         * ------> If yes, then push date to existing attendance
         * ------> If no, then create a new attendance record for the student
         * 
         * 2. If student does not exists, then don't create a new attendance record.
         */

        try{
            const response = await axios.get(`http://127.0.0.1:3001/student/${rollno}`);
            const studentData = response?.data[0];
            console.log(studentData,rollno)
            if(studentData){
                const { rollno, name } = studentData;
                const result = await Attendance.find({ rollno });
    
                if(result.length > 0){
                    result[0].date.push(new Date());
                    result[0].save();
                    res.status(200).send(`Attendance for rollno: ${rollno} updated successfully!`)
                } else {
                    /**
                     * Fetch student data.
                     * Create new entry
                     * add the new attendance.
                     */
                    const newAttendance = new Attendance({rollno, name, date: [new Date()]});
                    newAttendance.save();
                    res.status(200).send("Attendance recorded successfully!")
                }
            }
        }catch(err){
            res.send(err.response.data)
        }
    }catch(err){
        console.log({ err });
        res.status(500).send('Internal Server Error!');
    }
})

app.get("/attendance/all", (req, res) => {
    Attendance.find().then((item) => {
        if (item.length !== 0) {
              res.json(item)
        } else {
            res.status(404).send('No Attendance record found');
       }
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
    });
})

// app.get("/student/:rollno", (req, res)=> {
//     Student.find({rollno: req.params.rollno}).then((student) => {
//         if (student) {
//            res.json(student)
//         } else {
//             res.status(404).send('student not found');
//         }
//      }).catch((err) => {
//         res.status(500).send('Internal Server Error!');
//     });
// })

app.delete('/attendance/deleteAll', (req, res) => {
    Attendance.deleteMany().then((item) 	=> {
        if (item) {
             res.json('All Attendance records deleted Successfully!')
        } else {
            res.status(404).send('No Attendance record found!'); 
        }
    }).catch((err) => {
         res.status(500).send('Internal Server Error!');
    });
});
// app.delete('/student/:rollno', (req, res) => {
//     Student.findOneAndRemove({rollno: req.params.rollno}).then((student) 	=> {
//         if (student) {
//              res.json('student deleted Successfully!')
//         } else {
//             res.status(404).send('student Not found!'); 
//         }
//     }).catch((err) => {
//          res.status(500).send('Internal Server Error!');
//     });
// });

// app.put('/student/update/:rollno', async function (req, res) {
//     const rollno = req.params.rollno;
//     try{
//         const data = await Student.updateOne({ rollno }, {...req.body});
//         res.json(data);
//     }catch(e){
//         res.staus(500).send("Internal server error!!!");
//     }
// });

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Attendance service`);
})
