import express from 'express';
import { admin, authentication } from '../middleware/auth.js';
import { register, signIn } from '../controller/usercontroller.js';
import { allProducts, createProduct, deleteProduct, oneProduct, similarProducts, updateProduct } from '../controller/productcontroller.js';
import { AllOrders, placeOrder, updateStatus, viewMyOrders, getOrderById } from '../controller/ordercontroller.js';
import { addToCart, viewCart, updateCartItem, removeFromCart } from '../controller/cartController.js';
import { addCheckout, updateCheckout } from '../controller/checkoutController.js';




const router = express.Router();

router.post('/register', register)
router.post('/signin', signIn)

router.post('/createproduct', authentication, createProduct);
router.put('/update/:id', authentication, admin, updateProduct);
router.delete('/delete/:id', authentication, admin, deleteProduct);
router.get('/all', allProducts);
router.get('/one/:id', oneProduct);
router.get('/similar/:id', similarProducts);
router.post('/addorder', authentication,admin, placeOrder)
router.get('/myorders', authentication, viewMyOrders)
router.get('/allorder', authentication, AllOrders)
router.put('/updatestatus/:id', authentication,  updateStatus)
router.post("/addtocart", authentication, addToCart);
router.get("/viewcart", authentication, viewCart);
router.put("/updatecart/:id", authentication, updateCartItem);
router.delete("/removecart/:id", authentication, removeFromCart);
router.post('/addcheckout', authentication, addCheckout);
router.put('/checkout/update/:id', authentication, updateCheckout);
router.get('/order/:id', authentication, getOrderById);


export default router;
