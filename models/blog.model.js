const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
    username :{type:String,require:true},
    title :{type:String,require:true},
    content  :{type:String,require:true},
    category   :{type:String,default:"Business",enum:['Business', 'Tech', 'Lifestyle',  'Entertainment' ]},
    date :{type:String,require:true}
},{
    versionKey:false
})

const blogModel = mongoose.model("blog",blogSchema)

module.exports={
    blogModel
}