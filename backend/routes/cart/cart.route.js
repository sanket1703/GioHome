const router = require('express').Router();
const Cart = require('../../models/cart/cart.model.js');

var User;

// Get all products to cart
router.route('/:id').get((req, res)=>{
   
    User = req.params.id

    Cart.findOne({email:User},'products',function (err, user){
        if (err) 
        {
            res.send(err);
        } 
        else 
        {
            res.json(user.products);
        }
    });

});

// Checkout
router.route('/checkout').get((req, res)=>{

    Cart.findOne({email:User},'products',function (err, user){

        if(err) 
        {
            res.send(err);
        } 
        else 
        {
            res.json(user.products);
        }

    });

});

// Update products to cart

router.route('/edit/:id').post((req, res)=>{
    
    const updateData = req.body;
    console.log("Hello",updateData)
    const id = req.params.id
    console.log("--",id)
    Cart.exists({email:id,products: updateData}, function(err, result) {
        
        
        if (err) 
        {
          res.send(err);
        } 
        else 
        { 
            res.json(result)
            console.log(result)
            if (!result)
            {
            
            Cart.findOneAndUpdate({email:id},{$push: {products: updateData}},function (error, success) {
                
                if (error) 
                {
                    console.log(error);
                } 
                else 
                {
                    console.log("Added!",success);
                }

            });
        }
        
        
        }
      })
});

// Make new cart

router.route('/add').post(
    (req,res) => {


        const email = req.body.email;
    
        
        const name = String(req.body.name);
        const products = (req.body.products);

        Cart.exists({email:email}, function(err, result)
        {
            if(!result)
            {
                const newCart = new Cart(
                    {   
                        name,
                        products,
                        email
                    }
                    
                    );
                    
        
                newCart.save()
                .then(()=>res.json('Cart Created!'))
                .catch(err=> res.status(400).json('Error: '+err));
            }
        })

        

    }
);


router.route('/updatecart/:id').post((req, res) => {

    
    var updateData = req.body.available_quantity
    var id = req.params.id

    Cart.updateOne({email:User,"products.name":id},{$set:{"products.$.available_quantity":updateData}},function (error, success) {
        
        if (error) 
        {
            console.log(error);
        } 
        else 
        {
            console.log(success);
        }

    });
  });
    
// Remove from Cart

router.route('/remove/:id').get((req, res)=>{

    var id = req.params.id;

    Cart.findOneAndUpdate({email:User},{$pull: {products: {name:id}}},function (error, success) {
       
        if (error) 
        {
            console.log(error);
        } 
        else
        {
            console.log(success);
        }

    });

});

// Extra
////////////////////////////////////////////
// router.route('/:id').delete((req, res) => {
//   Exercise.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Exercise deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/update/:id').post((req, res) => {
//   Exercise.findById(req.params.id)
//     .then(exercise => {
//       exercise.username = req.body.username;
//       exercise.description = req.body.description;
//       exercise.duration = Number(req.body.duration);
//       exercise.date = Date.parse(req.body.date);

//     });
// });

module.exports = router;