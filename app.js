import express from "express";
import "./addRequire.js";
import DbService from "./dbService.js";
import cors from "cors";
// import 'dotenv'
// const express = require('express')
const app = express();
// const cors = require('cors');
const dotenv = require("dotenv");

const PORT = process.env.PORT || 5000;

dotenv.config();

// const dbService = require('./dbService')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/insert", (req, res) => {
    const {name} = req.body;
  const db = DbService.getDbServiceInstance();
    const result = db.insertNewName(name);
    
    result
    .then(data => res.json({ data: data}))
    .catch(err => console.log(err))
});

//read
app.get("/getAll", (req, res) => {
  const db = DbService.getDbServiceInstance();
  const result = db.getAllData(); //#endregion
  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

//update
app.patch('/update', (req, res)=>{
  // console.log(req)
  const {id, name }=  req.body;
  const db = DbService.getDbServiceInstance();
  const result = db.updateNameById(id, name);

  result
  .then((data)=> res.json({success: data}))
  .catch((err) => console.log(err));
})

//delete
app.delete('/delete/:id', (req, res)=>{
  const { id } = req.params;
  const db = DbService.getDbServiceInstance();
  const result = db.deleteRowById(id)

  result
  .then((data)=> res.json({success : data}))
  .catch(err => console.log(err))
})








app.listen(PORT, () => console.log(`app is running on port  ${PORT}`));
