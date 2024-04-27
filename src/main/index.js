import { 
  app,
  shell,
  BrowserWindow,
  ipcMain ,
  session,
  Tray,
Notification} from 'electron'

import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {mongoose} from 'mongoose';

import dotenv from 'dotenv';
dotenv.config()
import { 
  Louaje,
  Station,
  Passenger,
  Ticket,
  CityList } from "./db"
import { reverse } from 'dns/promises';


mongoose.connect(process.env.MONGODB_LINK);

const db = mongoose.connection;




let mainWindow;
let tray;
let notification;
let entreeAlert;
let sortieAlert;

const entreeNotification=(plaque)=>{
  entreeAlert=new Notification({
    title:'l9itlouage',
    body:`دخول اللواج ذات اللوحة ${plaque}`,
  icon:join(__dirname,"../../resources/logo.png")})
}
const sortieNotification=(plaque)=>{
  sortieAlert=new Notification({
    title:'l9itlouage',
    body:`خروج اللواج ذات اللوحة ${plaque}`,
  icon:join(__dirname,"../../resources/logo.png")})
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon:join(__dirname,"../../resources/icon.png"),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })


  tray=new Tray(join(__dirname,"../../resources/icon.png"))
  tray.on('click',()=>{
    mainWindow.isVisible()?mainWindow.hide():mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', async function () {
    console.log('Connected to the database');
    //do something
    try{
      console.log('working ..')
      const ses = session.fromPartition('persist:name')
      // const p=await Louaje.updateOne({email:"ij@gmail.com"},{$set:{cityDeparture:"Kelibia",cityArrival:"Kebili"}})
    //   const r=await Station.updateOne({email:"ala@gmail.com","louages.destinationCity":"kelibia"},
    //   {$set:{"louages.$.placesDisponibles":24}})
    
    // console.log(r)
       //find
       ipcMain.on('find',async(event,data) => {
        try{
        
        const result=await Station.findOne({email:data.email,password:data.password}
          /*,{dateExpiration:{ $gt:new Date() }} */);
        if(result){
          console.log("valide data")
          ses.setUserAgent(data.email)
          event.sender.send('find',true,'hello from back')
          
          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log(listtax[0]==undefined)
        
        if(listtax[0]==undefined ){
          const addtax=await Station.findOneAndUpdate(
                  { email: ses.getUserAgent()},
                  { $addToSet: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
                  { new: true } 
                )
                console.log("undif*ined test",addtax)
        }else{
          console.log('else triggured')
          let fetchedDate=new Date(listtax[0].tax[0].dayOfPaiment.getFullYear(),
          listtax[0].tax[0].dayOfPaiment.getMonth(),
          listtax[0].tax[0].dayOfPaiment.getDate())
          
          let today=new Date(new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate())
  
          if(today.getTime()>fetchedDate.getTime() )
          {
            const addtax=await Station.findOneAndUpdate(
              { email: ses.getUserAgent()},
              { $push: { tax: { dayOfPaiment: new Date()} },$set: { codeStation: randomString.generate(6) } },
              { new: true } 
            )
            console.log("new day, new money, monet money money !",addtax)
          }
        }
        }
        }catch(error){console.error("error in signin/find route : ",error)}
      })

      //scan entree
      ipcMain.on('scan-entree',async(event,id) => {
        try{
          console.log(`id recieved in scan-entree: ${id}`)

          const louage=await Louaje.findById({_id:id})
          console.log(`fetched louage to string(): ${louage.id.toString()},${louage.cityDeparture},${louage.cityArrival}`)

          const check=await Station.findOne({email:ses.getUserAgent(),city:louage.cityArrival,"louages.destinationCity":louage.cityDeparture})
        console.log("check result: ",check)

        const checkReverse=await Station.findOne({email:ses.getUserAgent(),city:louage.cityDeparture,"louages.destinationCity":louage.cityArrival})
        console.log("checkReverse result: ",checkReverse)

        const checkExistance=await Station.findOne({email:ses.getUserAgent(),"louages.lougeIds":louage.id.toString()})
    
    console.log(checkExistance)
    console.log("boolean",(check!=null || checkReverse!=null) && checkExistance==null)

          if((check!=null || checkReverse!=null) && checkExistance==null){
            const defaultPlaces = {
              one: 'free',
              two: 'free',
              three: 'free',
              four: 'free',
              five: 'free',
              six: 'free',
              seven: 'free',
              eight: 'free',
            };

            const stationInfo=await Station.findOne({email:ses.getUserAgent()})
            console.log(stationInfo)
            
            if(check!=null){
              const statusLouage=await Louaje.updateOne({_id:louage.id.toString()},
              {$set:{places:defaultPlaces,
                status:true,
                cityDeparture:stationInfo.city,
                cityArrival:louage.cityDeparture,
                availableSeats:8}})
            console.log(`status louage est change ${statusLouage}`)
            
            const result2=await Station.findOneAndUpdate(
                { email: ses.getUserAgent(), "louages.destinationCity": louage.cityDeparture },
                { $addToSet: { "louages.$.lougeIds": louage._id.toString() },
              $inc:{"louages.$.placesDisponibles":8,countLouaje:1} },
                { new: true } 
            )
            console.log(result2)
            }else if(checkReverse!=null){
              const statusLouage=await Louaje.updateOne({_id:louage.id.toString()},
              {$set:{places:defaultPlaces,
                status:true,
                availableSeats:8}})
            console.log(`status louage est change ${statusLouage}`)
            
            const result2=await Station.findOneAndUpdate(
                { email: ses.getUserAgent(), "louages.destinationCity": louage.cityArrival },
                { $addToSet: { "louages.$.lougeIds": louage._id.toString() },
              $inc:{"louages.$.placesDisponibles":8,countLouaje:1} },
                { new: true } 
            )
            console.log(result2)
            }

            const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
            console.log(destinations.louages)
            
            const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
            console.log(`les louages: ${louages}`)

            let listtax=await Station.aggregate([
              { $match: { email: ses.getUserAgent()} },
                    { $unwind: '$tax' },
                    { $sort: { "tax.dayOfPaiment": -1 } },
                    { $group: {_id: "$_id", tax: { $push: "$tax" }}},
                    { $project: { _id: 0, tax: 1 } }
                ]);
                console.log(listtax[0].tax[0]._id.toString())
                //louages -->> louagesOfAllTime
                // event.sender.send('destinations',destinations.louages,louages,listtax[0]?listtax[0].tax[0].paidLouages:[])
                event.sender.send('scan',true)
                console.log("data is sent to react")
          }else{
            console.log("louage does not match station properties !!!")
            event.sender.send('scan',false)
          }
        

        }catch(error){console.error("error in scan-entree route:",error)}
      })

      //scan sortie
      ipcMain.on('scan-sortie',async(event,id)=>{
        try{
          const louage=await Louaje.findById({_id:id})
        console.log(`fetched louage from db: ${louage}`)

        
        const firstLouage= await Station.aggregate([
          { $match: { email: ses.getUserAgent() } },
          { $unwind: "$louages" },
          { $match: { "louages.destinationCity": louage.cityArrival } },
          { $limit: 1 },
          { $project: { _id: 0, firstLouage: { $arrayElemAt: ["$louages.lougeIds", 0] } } }
        ]);
        console.log("firstLouage: ",firstLouage[0])
        
        if(firstLouage[0]!=undefined){
          if(firstLouage[0].firstLouage==id){
          const result2=await Station.findOneAndUpdate(
            { email:ses.getUserAgent(), "louages.destinationCity": louage.cityArrival },
            { $pull: { "louages.$.lougeIds": firstLouage[0].firstLouage },
            $inc:{countLouaje:-1,"louages.$.placesDisponibles":-louage.availableSeats}},
            { new: true } 
          )
          console.log("result2 : ",result2)
  
          const statusChange=await Louaje.updateOne({_id:id},{$set:{status:false}})
          console.log(`fetched louage from db: ${statusChange}`)

          const destinations=await Station.findOne({email:ses.getUserAgent()}).lean()
          console.log(destinations.louages)
          
          const louages = await Louaje.aggregate([{$project: { _id: { $toString: "$_id" },matricule: 1 ,availableSeats:1,status:1}}]);
          console.log(`les louages: ${louages}`)

          let listtax=await Station.aggregate([
            { $match: { email: ses.getUserAgent()} },
            { $unwind: '$tax' },
            { $sort: { "tax.dayOfPaiment": -1 } },
            { $group: {_id: "$_id", tax: { $push: "$tax" }}},
            { $project: { _id: 0, tax: 1 } }
        ]);
        console.log("list tax from scan sortie",listtax/*[0].tax[0]._id.toString() */)
        //louages -->> louagesOfAllTime
        event.sender.send('scan',true)
          // event.sender.send('destinations',destinations.louages,louages,listtax[0]?listtax[0].tax[0].paidLouages:[])
          console.log("data is sent to react")
          console.log("louage est sortie",id)
          
        }else{
          event.sender.send('scan',false)
        }
      }else{
          event.sender.send('scan',false)
        }

        }catch(error){
          console.error("error in scan-sortie route: ",error)
        }
      })
      
    }catch(error){
      console.error("impossible to connect to mongodb")
    }
  })
    createWindow()
    


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
