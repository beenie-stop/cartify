import Product from "../model/productSchema.js";
import User from "../model/userschema.js";

export const createProduct = async (req, res) => {
    try {
        const { name,
            description,
            price,
            category,
            brand,
            gender,
            images,
            sizes,
        } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            brand,
            gender,
            images,
            sizes,
            user: req.user.userId
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ message: error.message || "server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            brand,
            sizes,
            gender,
            images
        } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.gender = gender || product.gender;
        product.images = images || product.images;

        const updatedProduct = await product.save();

        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send({ message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const allProducts = async (req, res) => {
    try {
        const {
            sizes,
            maxPrice,
            minPrice,
            gender,
            sortBy,
            search,
            category,
            brand,
            limit
        } = req.query;

        let query = {};
        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category;
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (sizes) {
            query.sizes = { $in: sizes.split(",") };
        }

        if (gender) {
            query.gender = { $in: gender.split(",") };
        }

        if (maxPrice || minPrice) {
            query.price = {};
            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "PriceAsc":
                    sort.price = 1;
                    break;
                case "PriceDsc":
                    sort.price = -1;
                    break;
                case "Popularity":
                    sort.ranking = -1; // Ensure you have a 'ranking' field
                    break;
                default:
                    sort.createdAt = -1;
                    break;
            }
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);

        res.status(200).json({
            success: true,
            total: products.length,
            products
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error fetching products" });
    }
};

export const oneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(400).send({ message: "product not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "server error" })
    }
}

export const similarProducts = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.status(400).send({ message: "product not found" })
        }
        const similarProducts = await Product.find({
            _id: { $ne: id },
            category: product.category,
            gender: product.gender,
        }).limit(4)

        res.json(similarProducts);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "server error" })
    }
}
