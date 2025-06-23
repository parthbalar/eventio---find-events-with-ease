const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require("./routes/ticketRoutes");
const axios = require("axios");
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminEvent = require("./routes/admin/adminEvent");
const adminUsers = require("./routes/admin/adminUsers");
const adminContact = require("./routes/admin/adminContact");
const adminTicket = require("./routes/admin/adminTicket");
const Admin = require("./routes/admin/admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const Ticket = require("./models/Ticket");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);
app.use(express.urlencoded({ extended: true }));

// mongoDb connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.error("MongoDB Connection Error:", err));


const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      {
         email: userDoc.email,
         id: userDoc._id,
      },
      jwtSecret,
      {},
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }
         res.cookie("token", token).json(userDoc);
      }
   );
});

app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) {
           return res.status(401).json({ error: "Unauthorized" });
         }
         const user = await UserModel.findById(userData.id);
         if (!user) {
           return res.status(404).json({ error: "User not found" });
         }
         res.json({ name: user.name, email: user.email, _id: user._id , picture: user.picture });
       });
       
   } else {
      res.json(null);
   }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});


// Google Login
 app.post('/api/auth/google', async (req, res) => {
   const { token } = req.body;

   try {
      // Verify token with Google
      const googleRes = await axios.get(
         `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
      );

      const { email, name, picture } = googleRes.data;

      // Check if user already exists
      let user = await UserModel.findOne({ email });

      // If not, create new user
      if (!user) {
         user = await UserModel.create({ email, name, picture });
      }

      // Generate JWT
      const authToken = jwt.sign(
         {
            id: user._id,
            email: user.email,
            name: user.name,
            picture: user.picture,
         },
         jwtSecret,
         { expiresIn: '1d' }
      );

      // Send token as cookie
      res.cookie('token', authToken, {
         httpOnly: true,
         secure: false,
         sameSite: 'Lax',
         maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: 'Google login success', user });
   } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Google login failed' });
   }
});

 app.get("/events",async (req, res) => {
    await Event.find()
       .then((events) => {
          res.json(events);
       })
       .catch((error) => {
          console.error("Error fetching events:", error);
          res.status(500).json({ message: "Server error" });
       });
 });


app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);
      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   Ticket.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await Ticket.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

app.get("/events/user/:userId", async (req, res) => {
   try {
      const { userId } = req.params;
      const events = await Event.find({ owner: userId });
      res.json(events);
   } catch (error) {
      console.error("Error fetching user events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
   }
});

app.delete('/events/:id', async (req, res) => {
   const { id } = req.params;
   const deletedEvent = await Event.findByIdAndDelete(id);
   if (!deletedEvent) {
     return res.status(404).json({ message: "Event not found" });
   }
   res.json({ message: "Event deleted successfully" });
 });

 
 app.put("/events/:id", async (req, res) => {
   const { id } = req.params;
   const { title } = req.body;
   const event = await Event.findByIdAndUpdate(id, { title }, { new: true });
   if (!event) return res.status(404).send("Event not found");
   res.json(event);
});

// contact us

app.use("/api/contact", require("./routes/contact"));

// Routes
app.use('/api/events',  eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/users', userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscription", require("./routes/Subscription"));
app.use("/api/admin", adminEvent);
app.use("/api/admin", adminUsers);
app.use("/api/admin", adminContact);
app.use("/api/admin", Admin);
app.use("/api/admin", adminTicket);


//  location api

app.get("/api/location", async (req, res) => {
   const { lat, lon } = req.query;
   try {
       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
       res.json(response.data);
   } catch (error) {
       res.status(500).json({ error: "Failed to fetch location" });
   }
});
