export function makeProduct(
 overrides = {}
){

 return {

  name:'iPhone 16',

  price:1200,

  categoryId:'electronics',

  stock:10,

  description:'Apple phone',

  tags:[
   'apple',
   'phone'
  ],

  brand:'Apple',

  images:[],

  colors:[
   'black'
  ],

  sizes:[],

  discount:0,

  isFeatured:false,


  ...overrides

 };

}