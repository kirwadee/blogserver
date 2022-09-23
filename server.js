import express from 'express'

const app = express()

console.log('server')


app.listen('5000', ()=>{
   console.log("Back") 
})