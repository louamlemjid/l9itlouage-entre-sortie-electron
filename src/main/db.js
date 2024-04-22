import { mongoose } from "mongoose";


const louajeschema=new mongoose.Schema({
  name:String,
  lastName:String,
  email:String,
  password:String,
  model:String,//toyota..
  matricule:String,//240 Tunis 2039
  numeroTel:Number,
  places:[],
  availableSeats:Number,
  status:Boolean,//instation, true=in station,false=left
  cityDeparture:String,
  cityArrival:String,
  trajet:String,//city1-city2
  adress:String
});
const Louaje=mongoose.model('Louaje',louajeschema);

const stationschema=new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  codeStation:String,
  tel:Number,
  louagesOfAllTime:[],
  city:String,
  _id:String,
  adress:String,//latitude and longitude
  louages:[//keep track of dstinations
      {
          destinationCity:String,
          lougeIds:[],
          tarif:Number,
          placesDisponibles:Number
      }
  ],
  tax:[
    {
      dayOfPaiment:Date,
      paidLouages:[]
    }
  ],
  dateExpiration:Date,
  countLouaje:Number//nombres des louajes dans la stations
});
const Station=mongoose.model('Station',stationschema);

const passengerschema=new mongoose.Schema({
  name:String,
  lastName:String,
  email:String,
  numeroTel:Number,
  password:String,
  adress:String,//latitude and longitude
  points:Number
});
const Passenger=mongoose.model('Passenger',passengerschema);

const ticketschema= new mongoose.Schema({
  dateOfReservation:Date,
  price:Number,
  travel:String,
  idP:String,
  idL:String,
  idS:String,
  numberOfTickets:Number,
  matriculeLouage:String,
  departure:String,
  destination:String
})
const Ticket=mongoose.model('Ticket',ticketschema);

const cityListschema=new mongoose.Schema({
  cities:[]
})
const CityList=mongoose.model("CityList",cityListschema);

export { Louaje, Station, Passenger, Ticket, CityList};