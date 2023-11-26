import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";


dotenv.config()



const connectDB = async () => {
    mongoose.connect(process.env.MONGO_LINK)
        .then(() => {
            console.log(`conneced to database ...  `.bgMagenta.white.bold);
        })
        .catch((err) => {
            console.log(`error connecting to database ${err}`.rainbow);
        })
}


export default connectDB





