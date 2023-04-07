const mongoose = require('mongoose')

const connection_url = 'mongodb+srv://dubeydhruv020:123LMS123@cluster0.svcbbne.mongodb.net/?retryWrites=true&w=majority';

console.log(connection_url)

const connectDB = async () => {
    console.log('inside f');
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(connection_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // make the process fail
        process.exit(1);
    }
}

module.exports = connectDB
