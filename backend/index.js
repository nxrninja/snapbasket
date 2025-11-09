import app from "./server.js";
import { Catogery } from "./src/Models/catogery.model.js";



// import Routes Path
import userRoutes from './src/Routes/user.Route.js';
import adminRoutes from './src/Routes/admin.router.js'













// Routes
app.use('/api/user', userRoutes);
app.post('/api/admin/catogery' , async (req , res) => {
    const {catogery} = req.body;

    const newCatogery = new Catogery({catogery: catogery})
  await  newCatogery.save();
  

  return res.status(200).json({
    message: "Success"
  })

})


app.use('/api/admin' , adminRoutes )






app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


