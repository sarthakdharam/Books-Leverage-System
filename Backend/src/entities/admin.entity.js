const {EntitySchema}=require('typeorm')

const Admin=new EntitySchema({
    name:'Admin',
    tableName:'admin',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true,
        },        
        username:{
            type:'varchar',
            unique: true,
        },
        password:{
            type:'varchar',
            length:255,
            select:false,
        },        
        created_at:{
            type:'timestamp',
            createDate:true,
        },
               
    }
})
module.exports = {Admin};