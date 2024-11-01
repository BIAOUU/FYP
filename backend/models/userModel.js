const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    enum: ['guest', 'user', 'admin'], 
    default: 'user'  // Default role is 'user'
  },
  profile: {
    age: Number,
    bio: String,
    name: String
  },
  reviewsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],  // Reviews made by the user
  reviewsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],  // Reviews the user received
  suspended: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  categoryPreferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {timestamps: true})

// static signup method
userSchema.statics.signup = async function(email, password, name, age, categoryPreferences, role = 'user') {
    // validation
    if (!email || !password || !name || !age) {
      throw Error('All fields must be filled');
    }
  
    if (!validator.isEmail(email)) {
      throw Error('Email is not valid');
    }
  
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }
  
    const exists = await this.findOne({ email });
  
    if (exists) {
      throw Error('Email already in use');
    }
  
    // hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    // create user with additional fields including role
    const user = await this.create({
      email,
      password: hash,
      role,  // Add role when creating the user
      profile: {
        name,
        age,
      },
      categoryPreferences,
    });
  
    return user;
  };
  

// static login method
userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect Email')
    }

    // compare hash version of the password enter by the user and the one in the db
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect Password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)
