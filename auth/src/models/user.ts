import mongoose from 'mongoose'

// describes the attributes that are required to create a new user
interface UserAttrs {
  email: string
  password: string
}

// describes the properties/methods that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// describes the properties a single user has (User Document)
// to access properties added by mongoose (ex: updatedAt), need to add that also 
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    // the type here is a mongoose not typescript requirement
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// adding a custom function to a model
// to create a new user have to call User.build and NOT new User to allow for TS type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// feed schema into mongoose to create a model out of it
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }