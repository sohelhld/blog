const express = require('express');
// const { auth } = require('../middleware/auth.middleware ');
// const { authorisation } = require('../middleware/Authorisation');
const { blogModel } = require('../models/blog.model');



const blogRouter = express.Router()

blogRouter.post("/add",async(req,res)=>{
   
        const payload = req.body
       
        try {
            const products = new blogModel(payload)
            await products.save()
            res.status(200).send({msg:"new products is added"})
    
        } catch (error) {
            res.status(400).send({msg:error.message})
        }
   

})

blogRouter.get("/blogs",async(req,res)=>{

    try {
        const allPro = await blogModel.find()
        res.status(200).send(allPro)
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})
blogRouter.get('/blogst',async (req, res) => {
    const titleQuery = req.query.title;
  
    if (!titleQuery) {
      return res.status(400).json({ error: 'Title parameter is missing in the query.' });
    }   
    //  const matchingBlogs = await blogModel.filter(blog => blog.title.includes(titleQuery));
     const matchingBlogs = await blogModel.find({ title: { $regex: titleQuery, $options: 'i' } });
  
    res.status(200).send(matchingBlogs)
  });

 blogRouter.get('/blogsc',async (req, res) => {
    const categoryQuery = req.query.category;
  
    if (!categoryQuery) {
      return res.status(400).json({ error: 'Category parameter is missing in the query.' });
    }
  
    const matchingBlogs =   await blogModel.find({ category: { $regex: categoryQuery, $options: 'i' } });
    res.status(200).send(matchingBlogs)
  });

  blogRouter.get('/blogss', (req, res) => {
    const sortOption = req.query.sort;
    const orderOption = req.query.order;
  
    if (!sortOption || !orderOption) {
      return res.status(400).json({ error: 'Sort and order parameters are required in the query.' });
    }
  
    if (sortOption !== 'date' || (orderOption !== 'asc' && orderOption !== 'desc')) {
      return res.status(400).json({ error: 'Invalid sort or order parameters.' });
    }
  
    // Simulate sorting blogs based on the date field
    const sortedBlogs = blogs.sort((a, b) => {
      const comparison = orderOption === 'asc' ? 1 : -1;
      return comparison * (new Date(a.date) - new Date(b.date));
    });
  
    res.json(sortedBlogs);
  });
  


blogRouter.delete("/blogs/:id",async(req,res)=>{
    const payload=req.body
        try {
            const deletePro = await blogModel.findByIdAndDelete({_id:payload._id})
            res.status(200).send("produts is deleted")
        } catch (error) {
            res.status(400).send({msg:error.message})
        }

})

blogRouter.patch("/blogs/:id",async(req,res)=>{
    const payload=req.body
    try {
        const updateePro = await blogModel.findByIdAndUpdate({_id:payload._id},payload)
        res.status(200).send("blog is updated",updateePro)
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})


blogRouter.patch('/blogs/:id/like', async(req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = await blogModel.find(blog => blog.id === blogId);
  
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    blog.likes++;
  
    res.json({ message: 'Blog liked successfully.', blog });
  });
blogRouter.patch('/blogs/:id/comment', async(req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = await blogModel.find(blog => blog.id === blogId);
  
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    blog.comment++;
  
    res.json({ message: 'Blog liked successfully.', blog });
  });

  
  

module.exports={
    blogRouter
}