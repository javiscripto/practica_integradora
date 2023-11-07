import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: { type: String  },
    last_name: { type: String  },
    email: { type: String  },
    age: { type: Number },
    password: { type: String  },
    cart:{type: mongoose.Schema.Types.ObjectId, ref:"carts"},
    role: { type: String }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
