const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { cloudinary } = require("./config/cloudinary");
const Product = require("./model/product");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  

async function seedProducts() {
  try {
    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=194"
    );
    await Product.deleteMany({});


    for (const product of data.products) {
      console.log(`Uploading ${product.title}`);
      
	  const res = await cloudinary.uploader.upload(product.thumbnail);
	  product.thumbnail = res.secure_url;
      

      await Product.create({
        name: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        imageurl: product.thumbnail,
        stock: product.stock || 100,
        rating: product.rating || 0,
        numReviews: product.reviews.length || 0,
      });
    }

    console.log("Products Imported Successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const deleteData = async() => {
	try {
		await Product.deleteMany({});
		console.log("Data Deleted Successfully");
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

if (process.argv.includes("-d")) {
	deleteData();
} else {
	seedProducts();
}
