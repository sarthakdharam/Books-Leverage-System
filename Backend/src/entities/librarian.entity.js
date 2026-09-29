const { EntitySchema }=require('typeorm')


const librarian=new EntitySchema({
    name:'librarian',
    tableName:'labrarian',
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true,
        },
        name:{
            type:'varchar',
        },
        username:{
            type:'varchar',
            unique: true,
        },
        email:{
            type:'varchar',
            unique: true,
        },
        phone:{
            type:'varchar',
            length:10,
        },
        password:{
            type:'varchar',
            length:255,
            select:false,
        },
        branch:{
            type:'varchar',
        },
        created_at:{
            type:'timestamp',
            createDate:true,
        },
        updated_at:{
            type:'timestamp',
            updateDate:true
        },
        is_active: {
            type: 'boolean',
            default:true,
        },
               
    }
})
module.exports = {librarian};